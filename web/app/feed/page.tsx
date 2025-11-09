"use client";

import HomePage from "@/components/HomePage";
import Header from "@/components/ui/Header";
import { useAuth } from "@/hooks/useAuth";

/**
 * Feed Page (Protected Route)
 * 
 * This is the main dashboard for authenticated users.
 * Unauthenticated users are automatically redirected to /auth via:
 * 1. middleware.ts (server-side)
 * 2. useAuth hook (client-side fallback)
 */
export default function FeedPage() {
  const { loading, authenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7AF8EB]"></div>
      </main>
    );
  }

  // This should rarely show due to middleware, but acts as a safeguard
  if (!authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen text-white">
      <Header />
      <HomePage />
    </main>
  );
}
