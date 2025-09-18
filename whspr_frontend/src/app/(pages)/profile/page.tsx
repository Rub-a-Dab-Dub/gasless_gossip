"use client";

import React, { useEffect, useState } from "react";
// import { getMe } from "@/app/lib/api";
import { getCurrentUser } from "@/app/lib/api";
// instead of "@/app/lib/api"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        console.log(data);
        setUser(data);
      })
      .catch(() => setError("Failed to load user"));
  }, []);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user.name} 🎉</h1>
      <p>Email: {user.id}</p>
    </div>
  );
}
