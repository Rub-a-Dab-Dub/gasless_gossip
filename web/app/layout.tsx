"use client"

import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, user, authenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  if (!pathname.includes("auth")) {
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}  ${fredoka.variable} antialiased bg-[#121418]`}
      >
        <Providers>{loading ? <></> : <>{children}</>}</Providers>
      </body>
    </html>
  );
}
