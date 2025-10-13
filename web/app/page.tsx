'use client'

import HomePage from "@/components/HomePage";
import Header from "@/components/ui/Header";
// import WalletPage from "@/components/WalletPage";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Header />

      <HomePage />
    </main>
  )
}
