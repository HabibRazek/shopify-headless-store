import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shopify Headless Store",
  description: "A headless Shopify store built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ShopProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
          </CartProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
