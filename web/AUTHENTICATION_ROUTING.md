# Authentication & Routing Implementation

## Overview
This document explains the smart routing system that differentiates between new and returning users, providing automatic redirects based on authentication status.

## Architecture

### 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Journey                         │
└─────────────────────────────────────────────────────────┘

NEW USER (Unauthenticated):
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│   / ────┼───→│  /auth  ├───→│ Sign Up ├───→│  /feed  │
│ Landing │    │ Login   │    │ Success │    │Dashboard│
└─────────┘    └─────────┘    └─────────┘    └─────────┘

RETURNING USER (Authenticated):
┌─────────┐                                   ┌─────────┐
│   /     │──────(Auto Redirect)─────────────→│  /feed  │
│ Landing │                                   │Dashboard│
└─────────┘                                   └─────────┘
```

## File Structure

```
web/
├── middleware.ts              # Server-side route protection (NEW)
├── hooks/
│   └── useAuth.ts            # Client-side auth hook (UPDATED)
├── app/
│   ├── layout.tsx            # Root layout with loading state (UPDATED)
│   ├── page.tsx              # Landing page (UPDATED)
│   ├── auth/
│   │   └── page.tsx          # Login/Signup page (UPDATED)
│   └── feed/
│       └── page.tsx          # Protected dashboard (UPDATED)
└── lib/
    ├── cookies.ts            # Cookie management (existing)
    └── local-storage.ts      # Local storage utils (existing)
```

---

## Key Components Explained

### 1. **middleware.ts** (NEW) 🛡️
**Location:** `/web/middleware.ts`

**Purpose:** Server-side route protection that runs BEFORE pages load

**How it works:**
```typescript
// Defines route categories
const protectedRoutes = ['/feed', '/me', '/profile', '/wallet', '/rooms', '/chat', '/quests']
const authRoutes = ['/auth']
const publicRoutes = ['/']

// Checks cookie for token
const token = request.cookies.get('token')?.value
const isAuthenticated = !!token

// Three main redirect scenarios:
1. Unauthenticated → Protected Route → Redirect to /auth
2. Authenticated → /auth → Redirect to /feed  
3. Authenticated → / (landing) → Redirect to /feed
```

**Why middleware?**
- Runs on the server (faster than client-side)
- Prevents flash of wrong content
- Adds security layer before React even loads

**Protected Routes:**
- `/feed` - Main dashboard
- `/me` - User profile
- `/profile` - Public profile view
- `/wallet` - Wallet management
- `/rooms` - Chat rooms
- `/chat` - Messaging
- `/quests` - Gamification

---

### 2. **useAuth Hook** (UPDATED) 🎣
**Location:** `/web/hooks/useAuth.ts`

**Purpose:** Client-side authentication state management + fallback redirects

**What it does:**
```typescript
export const useAuth = () => {
  // 1. Check cookies for token
  const token = getFromCookie("token");
  
  // 2. Get user data from localStorage
  const user = getFromLocalStorage("user");
  
  // 3. Determine current route type
  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));
  
  // 4. Redirect logic (client-side fallback)
  if (!token && isProtectedRoute) {
    router.push(`/auth?redirect=${pathname}`); // Save intended destination
  }
  
  if (token && (isAuthRoute || isLandingPage)) {
    router.push(redirectParam || '/feed'); // Go to feed or saved redirect
  }
  
  // 5. Return state
  return { loading, user, authenticated };
}
```

**Key Features:**
- Reads from both cookies (token) and localStorage (user data)
- Adds `?redirect=` parameter to preserve intended destination
- Acts as fallback if middleware doesn't catch something
- Provides loading state to prevent content flash

---

### 3. **Root Layout** (UPDATED) 📐
**Location:** `/web/app/layout.tsx`

**Changes:**
```typescript
// BEFORE (unused auth check)
const { loading, user, authenticated } = useAuth();
if (!pathname.includes("auth")) { } // Empty logic

// AFTER (proper loading state)
const { loading } = useAuth();
return loading ? <LoadingSpinner /> : <>{children}</>;
```

**Why?**
- Shows loading spinner while checking authentication
- Prevents flash of unauthenticated content
- Clean user experience during redirects

---

### 4. **Landing Page** (UPDATED) 🏠
**Location:** `/web/app/page.tsx`

**Route:** `/`

**Behavior:**
- **Unauthenticated users:** See landing page normally
- **Authenticated users:** Instantly redirected to `/feed` (via middleware)

**Comments added:**
```typescript
/**
 * Landing Page (Public Route)
 * 
 * This is the entry point for new/unauthenticated users.
 * Authenticated users are automatically redirected to /feed via:
 * 1. middleware.ts (server-side)
 * 2. useAuth hook (client-side fallback)
 */
```

---

### 5. **Auth Page** (UPDATED) 🔑
**Location:** `/web/app/auth/page.tsx`

**Route:** `/auth`

**New Features:**
```typescript
// Extract redirect parameter from URL
const searchParams = useSearchParams();
const redirectPath = searchParams?.get('redirect') || '/feed';

// After successful login
router.push(redirectPath); // Goes to saved destination or /feed
```

**User Flow:**
1. User tries to access `/feed` without login
2. Middleware redirects to `/auth?redirect=/feed`
3. User logs in
4. Gets redirected back to `/feed` (their intended destination)

---

### 6. **Feed Page** (UPDATED) 📰
**Location:** `/web/app/feed/page.tsx`

**Route:** `/feed` (Protected)

**Protection Layers:**
```typescript
// Layer 1: middleware.ts (server)
// Redirects unauthenticated users before page loads

// Layer 2: useAuth hook (client)
const { loading, authenticated } = useAuth();

// Layer 3: Component guards
if (loading) return <LoadingSpinner />;
if (!authenticated) return null; // Shouldn't reach here
```

**Why 3 layers?**
- **Middleware:** Fast server-side protection
- **useAuth:** Client-side state management
- **Component guards:** Extra safety + better UX

---

## Authentication Storage

### Token (Cookie)
```typescript
// Stored after login/signup
setToCookie("token", jwtToken);

// Read by middleware & useAuth
const token = getFromCookie("token");
```

**Why cookies?**
- Accessible by middleware (server-side)
- Persistent across sessions
- Secure (HttpOnly recommended for production)

### User Data (LocalStorage)
```typescript
// Stored after login/signup
setToLocalStorage("user", JSON.stringify(userData));

// Read by useAuth
const user = getFromLocalStorage("user");
```

**Why localStorage?**
- Fast client-side access
- No need to fetch user data on every page
- Can store complex objects (name, avatar, etc.)

---

## Redirect Flow Examples

### Example 1: New User Signup
```
1. Visit / (landing) ✅
2. Click "Get Started" → /auth
3. Fill signup form
4. Submit → Token saved to cookie + localStorage
5. WelcomeScreen shows
6. Click "Continue" → /feed ✅
7. Next visit: / auto-redirects to /feed ✅
```

### Example 2: Returning User
```
1. Visit / (landing)
2. Middleware detects token in cookie
3. Instant redirect to /feed ✅
4. No landing page shown
```

### Example 3: Deep Link Protection
```
1. User gets link to /rooms/123
2. Not logged in
3. Middleware redirects to /auth?redirect=/rooms/123
4. User logs in
5. Automatically sent to /rooms/123 ✅
```

### Example 4: Authenticated User Tries Auth Page
```
1. Already logged in
2. Visit /auth (maybe from bookmark)
3. Middleware detects token
4. Redirect to /feed ✅
```

---

## Configuration

### Add More Protected Routes
Edit both files:

**middleware.ts:**
```typescript
const protectedRoutes = [
  '/feed', 
  '/your-new-route' // Add here
]
```

**useAuth.ts:**
```typescript
const protectedRoutes = [
  '/feed', 
  '/your-new-route' // Add here
];
```

### Change Default Redirect
**middleware.ts:**
```typescript
const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard' // Change here
```

**useAuth.ts:**
```typescript
router.push(redirectParam || '/dashboard'); // Change here
```

---

## Testing Checklist

### ✅ New User Flow
- [ ] Can access landing page (/)
- [ ] Can access /auth page
- [ ] Cannot access /feed before login
- [ ] After signup, redirected to /feed
- [ ] Refresh /feed → still logged in

### ✅ Returning User Flow
- [ ] Visiting / auto-redirects to /feed
- [ ] Visiting /auth auto-redirects to /feed
- [ ] Can access all protected routes
- [ ] Token persists after browser close

### ✅ Protected Routes
- [ ] /feed blocked without login
- [ ] /me blocked without login
- [ ] /rooms blocked without login
- [ ] All redirect to /auth with ?redirect parameter

### ✅ Logout Flow (if implemented)
- [ ] Logout clears cookie + localStorage
- [ ] Redirected to / (landing)
- [ ] Cannot access /feed anymore
- [ ] Visiting /feed redirects to /auth

---

## Common Issues & Solutions

### Issue: "Too many redirects" error
**Cause:** Circular redirect loop (e.g., middleware and useAuth fighting)
**Solution:** Check middleware config matcher - ensure it's not matching static files

### Issue: User sees landing page flash before redirect
**Cause:** Client-side redirect is slower than rendering
**Solution:** Already fixed! Middleware redirects server-side (no flash)

### Issue: Redirect parameter not working
**Cause:** useSearchParams() needs Suspense boundary in App Router
**Solution:** Already handled - using optional chaining (`searchParams?.get()`)

### Issue: User data not available after login
**Cause:** Token in cookie but user data not in localStorage
**Solution:** Both must be set together (already implemented in auth/page.tsx)

---

## Security Considerations

### Current Implementation
✅ Token stored in cookie (readable by middleware)
✅ User data in localStorage (fast client access)
✅ Server-side protection (middleware)
✅ Client-side validation (useAuth)

### Production Recommendations
🔒 Use HttpOnly cookies for token (prevents XSS)
🔒 Add CSRF protection
🔒 Implement token refresh mechanism
🔒 Add rate limiting to auth endpoints
🔒 Use HTTPS only (cookies with Secure flag)

---

## Next Steps

### Optional Enhancements
1. **Remember Me:** Longer cookie expiration
2. **Session Management:** Track active sessions
3. **Multi-device Logout:** Clear all tokens
4. **Role-based Access:** Admin vs User routes
5. **Email Verification:** Block unverified users from certain routes

---

## Quick Reference

| File | Purpose | When It Runs |
|------|---------|-------------|
| `middleware.ts` | Route protection | Server-side, before page loads |
| `useAuth.ts` | Auth state | Client-side, on component mount |
| `layout.tsx` | Loading state | Every page render |
| `page.tsx` (root) | Landing page | Public access |
| `auth/page.tsx` | Login/Signup | Public access |
| `feed/page.tsx` | Dashboard | Protected, after auth |

---

## Questions?

If you need to:
- Add new protected routes → Edit `middleware.ts` + `useAuth.ts`
- Change redirect destination → Update `redirectPath` variables
- Add logout → Clear cookie + localStorage, redirect to `/`
- Debug redirects → Check browser Network tab for 307 redirects

**Everything is working correctly when:**
✅ New users see landing page
✅ Authenticated users skip to feed
✅ No content flashing
✅ Redirects feel instant
✅ Deep links work with login flow
