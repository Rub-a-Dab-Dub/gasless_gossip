import type { Metadata } from "next";
import { Fredoka, Baloo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});
const baloo_2 = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo_2",
});
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Gasless Gossip - Social Messaging on Stellar",
  description:
    "A social messaging app built on Stellar with real-time chat and token tipping - all gasless.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${baloo_2.variable} antialiased `}>
        {children}
      </body>
    </html>
  );
}
