import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../assets/styles/globals.css";
import Navbar from "@/components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarbonCupid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      > 
        <Navbar />
        <div className="pt-20 pb-10">
          {children}
        </div>
      </body>
    </html>
  );
}
