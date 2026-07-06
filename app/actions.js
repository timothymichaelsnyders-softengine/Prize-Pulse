"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient(); // from the server side
    await supabase.auth.signOut(); // sign out the user
    revalidatePath("/"); // revalidate the home page after signing out/ fetch all the information from this path
    redirect("/"); // redirect to the home page after signing out
}

// Add a product
export async function addProduct(formData) {
    const url = formData.get("url"); // we're just sending through the URL

    if(!url) {
        return {error: "URL is required"};
    }

    try {
        // make call to our database

        const supabase = await createClient(); // from the server

        // get user
        const {
            data: {user},
        } = await supabase.auth.getUser();

        // check if user is logged in or not
        if(!user) {
            return { error: "Not authenticated" };
        }

        // scrape product data with Firecrawl
        const productData = await scrapeProduct(url);

        // check productName and productPrice
        if( !productData.productName || !productData.currentPrice ) {
            console.log(productData, "productData");
            return { error: "Could not extract product information from this URL" };
        }

        // take our price and currency
        const newPrice = parseFloat(productData.currentPrice);
        const currency = productData.currencyCode || "USD";

        // if the product already exists, we'll simply update it
        const { data:existingProduct } = await supabase
            .from("products")
            .select("id, current_price")
            .eq("user_id", user.id)
            .eq("url", url)
            .single(); 

        const isUpdate = !!existingProduct;

        // upsert product (insert or update based on user_id + url)
        const { data: product, error } = await supabase.from("products").upsert({
            user_id: user.id,
            url,
            name: productData.productName,
            current_price: newPrice,
            currency: currency,
            image_url: productData.imageUrl,
            updated_at: new Date().toISOString(),
        },{
            onConflict: "user_id,url", // unique constraint on user_id + url, to avoid duplicates
            ignoreDuplicates: false, // always update if exists
        }
    )
        .select()
        .single();

        if( error ) {
            throw error;
        }

        // Add to price history if it's a new product or if the price has changed
        const shouldAddHistory = !isUpdate || existingProduct.current_price !== newPrice;

        if( shouldAddHistory ) {
            await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
                currency: currency,
            });
        }

        revalidatePath("/");

        return {
            success: true,
            product,
            message: isUpdate ? "Product updated with latest price!" : "Product added successfully!",
        };

    } catch (error) {
        console.error("Error adding product:", error);
        return { error: error.message || "Failed to add product" };
    }
}

// Delete a product
export async function deleteProduct(productId) {
    try {
        const supabase = await createClient(); // from the server

        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);


        if(error) throw error;

        revalidatePath("/");
        return { success: true };
    } catch(error) {
        return { error: error.message };
    }
}

// Get all products
export async function getProducts() {
    try {
        const supabase = await createClient();

        // const {
        //     data: {user}
        // } = await supabase.auth.getUser();

        // if(!user) {
        //     return { error: "Not authenticated" };
        // }

        const { data, error } = await supabase
          .from("products")
          .select("*")
        //   .eq("user_id", user.id);
          .order("created_at", {ascending: false});

        if(error) throw error;

        return data || [];
    } catch (error) {
        console.error("Get products error:", error);
        return [];
    }
}

// Get Price History for a particular product
export async function getPriceHistory(productId) {
    try {
        const sb = await createClient();

        const { data, error } = await sb
          .from("price_history")
          .select("*")
          .eq("product_id", productId)
          .order("checked_at", { ascending: true });

        if( error ) throw error;
        return data || [];
    } catch (error) {
        console.error("Get price history error:", error);
        return [];
    }
}