import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ermita del Silencio — Retiros católicos",
    template: "%s | Ermita del Silencio",
  },
  description:
    "Centro de retiros espirituales de la Iglesia Católica. Un lugar de silencio y oración, al servicio de la vida interior.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ee",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isAdminAuthenticated();

  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh min-h-screen flex-col">
        <SiteHeader isAdmin={isAdmin} />
        <main className="relative flex-1">{children}</main>
        <SiteFooter isAdmin={isAdmin} />
      </body>
    </html>
  );
}
