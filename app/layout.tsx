import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartProvider } from "@/context/CartContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

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
        <Providers>
          <ShopProvider>
            <CartProvider>
              {/* TopBar temporarily hidden - remove this comment to show TopBar */}
              {/* <div className="sm:block hidden">
                <TopBar />
              </div> */}
              <Navbar />
              <main className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartProvider>
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}
