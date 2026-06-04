import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fahrschule Lohrmann – Sicher ans Ziel",
  description:
    "Fahrschule Lohrmann – Ihr zuverlässiger Partner für den Führerschein. Theorie, Praxis, Fahrsimulator. Jetzt online buchen.",
  keywords: ["Fahrschule", "Führerschein", "Lohrmann", "Fahrsimulator", "Theorieunterricht"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
