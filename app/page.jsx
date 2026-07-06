import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { TrendingDown, Shield, Bell, Rabbit } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";

export default async function Home() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {/* <Image src={"/deal-drop-logo.png"} alt="Deal Drop Logo"  */}
            <Image src={"/price-pulse-orange.png"} alt="Deal Drop Logo" 
              width={600}
              height={200}
              className="h-12 w-auto"
              // className="h-17 w-auto"
            />
          </div>

          {/* Auth Button */}
          <AuthButton user={user} />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-20 px-4">
        {/* Div for hero TEXT */}
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6
            py-2 rounded-full text-sm font-medium mb-6">
              Made with ❤️ by 
              <span className="text-black font-bold italic">CodeXone Inc.</span>
            </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Never miss a Price Drop</h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices from any E-COMMERCE site. Get instant alerts when prices drop. Save money effortlessly.
          </p>

          {/* Product form */}
          <AddProductForm user={user}/>

          {/* Features */}
          {/* Features will only be visible when there is NO PRODUCT!! */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div 
                  key={title}
                  className="bg-white p-6 rounded-xl border border-gray-200"  
                >
                  {/* ICON */}
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Render products */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Tracked Products</h3>

            <span className="text-md text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Render products */}
          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map(product => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>
        </section>
      )}

      {/* If the user is logged in BUT there are no products */}
      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
