import { sendPriceDropAlert } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Price check endpoint is working. Use POST to trigger.",
    });
}

export async function POST(request) {
    try {
        // lets get the CRON secret
        const authHeader = request.headers.get("authorization"); // the authorization header contains the secret from the cron job
        const cronSecret = process.env.CRON_SECRET; // this is our version of the secret, which we will use to compare

        // this is how you trigger an API call for Authorization
        if( !cronSecret || authHeader !== `Bearer ${cronSecret}` ) {
            return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
        }

        // Use service role to bypass RLS (Role Level Security)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*"); // get all the products

        if(productsError) throw productsError;

        console.log(`Found ${products.length} products to check`);

        const results = {
            total: products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0,
        };

        // loop through the products
        for(const product of products) {
            try {
                // scrape the data for each product using our scrape function
                const productData = await scrapeProduct(product.url);

                if(!productData.currentPrice) {
                    results.failed++;
                    continue;
                }

                const newPrice = parseFloat(productData.currentPrice);
                const oldPrice = parseFloat(product.current_price);

                await supabase.from("products").update({
                    current_price: newPrice,
                    currency: productData.currenyCode || product.currency,
                    name: productData.productName || product.name,
                    image_url: productData.productImageUrl || product.image_url,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", product.id);

                // we will only add it to the history table if the prices are now different
                if(oldPrice !== newPrice) {
                    // insert inside of price history table
                    await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        currency: productData.currencyCode || product.currency,
                    });

                    results.priceChanges++; // this is for our debuggin purposes

                    if(newPrice < oldPrice) {
                        // Send alert to the user
                        
                        // First, who is the user??
                        const {
                            data: { user }
                        } = await supabase.auth.admin.getUserById(product.user_id);

                        if(user?.email) {
                            // Send Email
                            const emailResult = await sendPriceDropAlert(
                                user.email,
                                product,
                                oldPrice,
                                newPrice
                            );

                            if( emailResult.success ) {
                                results.alertsSent++;
                            }
                        }
                    }
                }

                results.updated++;
            } catch (error) {
                console.error(`Error processing product ${product.id}: `, error);
                results.failed++;
            }
        }

        // response of somesorts
        return NextResponse.json({
            success: true,
            message: "Price check completed",
            results,
        });
    } catch (error) {
        console.error("Cron job error: ", error);
        return NextResponse.json({ error: errorm.message }, { status: 500 });
    }
}

// curl -X POST https://pricepulse.vercel.app/api/cron/check-prices \
// -H "Authorization: Bearer your_cron_secret"