'use client'

import Landing from "@/components/Landing";
import LandingHeader from "@/components/ui/LandingHeader";

/**
 * Landing Page (Public Route)
 * 
 * This is the entry point for new/unauthenticated users.
 * Authenticated users are automatically redirected to /feed via:
 * 1. middleware.ts (server-side)
 * 2. useAuth hook (client-side fallback)
 */
export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <LandingHeader />
      <Landing />
    </main>
  )
}
