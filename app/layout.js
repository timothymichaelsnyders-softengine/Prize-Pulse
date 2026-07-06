import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Price Pulse",
  description: "Monitor Prices, Purchase Better",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>

      <Toaster richColors/>
    </html>
  );
}
