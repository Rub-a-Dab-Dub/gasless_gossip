"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react";

import Header from "@/components/ui/Header";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { IAllUser } from "@/types/user";
import { ArrowRight } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function User() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const username = searchParams.get("u");
  const [search, setSearch] = useState<string>("")
  const [followers, setFollowers] = useState<IAllUser[] | null>(null);

  const getUserFollowers = async () => {
    try {
      const res = await api.get<ApiResponse>(`/users/${username}/followers?search=${search}`)
      if (!res.data.error) setFollowers(res.data.data)
    } catch {
      toast.error("Failed to fetch user followers")
    }
  }
  // Get a single user
  useEffect(() => {
    if (!username) {
      setFollowers(null)
      return;
    };
    getUserFollowers();
  }, [username]);

  const renderUserAvatar = (photo?: string | null) => (
    photo ? (
      <Image src={photo} alt="photo" width={40} height={40} className="rounded-full object-cover" />
    ) : (
      <span className="inline-block size-10 overflow-hidden rounded-full bg-gray-800 outline outline-white/10">
        <svg fill="currentColor" viewBox="0 0 24 24" className="size-full text-gray-600">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.9 0 9.26 2.35 12 5.99zM16 9a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    )
  )

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-32 text-white">
        {user ?
          <div className="w-full h-full flex-col flex relative bg-transparent text-white">
            {/* Search Header */}
            <div className="w-full flex items-center gap-2 p-4 border-b border-teal-500">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border-1 border-teal-400 rounded-full bg-teal-900/30 py-3 pr-10 pl-4 text-sm text-light-grey placeholder:text-light-grey outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button type="button" className="cursor-pointer bg-transparent border-none" onClick={() => getUserFollowers()}>
                    <Search
                      size={24}
                      className="absolute right-3 top-1/2 -translate-y-1/2  text-light-grey"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Followers List */}
            <div className="w-full h-full flex-1 overflow-y-auto">
              {followers && followers.length > 0 ? (
                followers.map((follower) => (
                  <Link
                    href={`/user?u=${follower.username}`}
                    key={follower.id}
                    className="flex justify-start items-center gap-4 p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-800/50"
                  >
                    {renderUserAvatar(follower.photo)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium text-lg text-white">{follower.username}</span>
                        <p className="text-sm font-fredoka text-light-grey truncate">{follower.title}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <></>
              )}
            </div>
          </div> : <></>
        }
      </div>
    </>
  );
}

