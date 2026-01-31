import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LD Importaciones | Productos Importados de Calidad en Argentina",
    template: "%s | LD Importaciones"
  },
  description: "La mejor selección de productos importados de tecnología, hogar, camping y más con envío a toda Argentina y garantía oficial.",
  keywords: ["productos importados", "tecnología argentina", "importaciones argentina", "camping", "hogar", "LD Importaciones"],
  authors: [{ name: "LD Importaciones" }],
  creator: "LD Importaciones",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://ld-importaciones.com.ar",
    siteName: "LD Importaciones",
    title: "LD Importaciones | Productos Importados de Calidad en Argentina",
    description: "La mejor selección de productos importados con envío a toda Argentina.",
    images: [
      {
        url: "/og-image.png", // Image should be added later or exist
        width: 1200,
        height: 630,
        alt: "LD Importaciones"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LD Importaciones",
    description: "Productos importados de calidad con envío a toda Argentina.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
