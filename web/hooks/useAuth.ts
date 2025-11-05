"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getFromCookie } from "@/lib/cookies";
import { getFromLocalStorage } from "@/lib/local-storage";
import { IUser } from "@/types/user";

// Routes that require authentication
const protectedRoutes = ['/feed', '/me', '/profile', '/wallet', '/rooms', '/chat', '/quests'];

// Routes that should redirect to /feed if already authenticated
const authRoutes = ['/auth'];

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const token = getFromCookie("token");
    const get_user = getFromLocalStorage("user");
    
    const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));
    const isLandingPage = pathname === '/';

    if (!token) {
      // User is not authenticated
      setAuthenticated(false);
      setUser(null);
      
      // Redirect to auth if trying to access protected route
      if (isProtectedRoute) {
        router.push(`/auth?redirect=${pathname}`);
      }
    } else {
      // User is authenticated
      if (get_user) {
        setUser(JSON.parse(get_user));
      }
      setAuthenticated(true);
      
      // Redirect authenticated users away from auth page or landing
      if (isAuthRoute || isLandingPage) {
        const redirectParam = new URLSearchParams(window.location.search).get('redirect');
        router.push(redirectParam || '/feed');
      }
    }
    
    setLoading(false);
  }, [router, pathname]);

  return { loading, user, authenticated };
};
