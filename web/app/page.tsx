'use client'

import Landing from "@/components/Landing";
import LandingHeader from "@/components/ui/LandingHeader";
// import WalletPage from "@/components/WalletPage";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <LandingHeader />

      <Landing />
    </main>
  )
}
