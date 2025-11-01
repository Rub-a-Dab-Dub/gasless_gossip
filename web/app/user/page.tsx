"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { X } from "lucide-react";

import Header from "@/components/ui/Header";
import Avatar from "@/images/photos/avatar.png";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { IUser, ViewUser } from "@/types/user";
import { IPostList } from "@/types/post";
import RoomsTab from "@/components/tabs/Rooms";
import SimplePostCard from "@/components/cards/SimplePostCard";
import MyRooms from "@/components/room/MyRooms";
import { ArrowRight } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function User() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const username = searchParams.get("u");
  const [profile, setProfile] = useState<ViewUser | null>(null);

  const getUser = async (username: string) => {
    try {
      const res = await api.get<ApiResponse>(`/users/profile/${username}`)
      if (!res.data.error) setProfile(res.data.data)
    } catch {
      toast.error("Failed to fetch user")
    }
  }
  // Get a single user
  useEffect(() => {
    if (!username) {
      setProfile(null)
      return;
    };
    getUser(username);
  }, [username]);

  const handleFollowAction = async (username: string, id: number, is_following: boolean) => {
    try {
      let url = '';
      if (is_following) {
        url = `/users/${id}/unfollow`
      }
      else {
        url = `/users/${id}/follow`
      }
      const res = await api.get<ApiResponse>(url)
      if (!res.data.error) {
        getUser(username)
        toast.success(res.data.data.message)
      }
    } catch {
      toast.error("Failed to perform action")
    }
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-32 text-white">
        {user && profile ?
          <>
            <div style={{
              boxShadow: '0px 12px 13px -6px #14E3CD14'
            }} className="p-3 rounded-bl-3xl rounded-br-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
              <div className="flex items-center gap-6">
                <div>
                  <Image
                    src={profile?.user?.photo ?? Avatar}
                    alt=""
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div className="text-sm text-center mt-2 text-dark-white">
                    {profile?.user?.username ?? "stranger"}
                  </div>
                </div>

                <div>
                  <div className="flex gap-6 mb-3">
                    <div>
                      <div className="text-sm text-tertiary uppercase mb-1">
                        Posts
                      </div>
                      <div className="text-2xl font-fredoka font-semibold">{profile?.stats?.posts}</div>
                    </div>
                    <Link href={`/user/followers?u=${profile?.user?.username}`}>
                      <div className="text-sm text-tertiary uppercase mb-1">
                        Followers
                      </div>
                      <div className="text-2xl font-fredoka font-semibold">{profile?.stats?.followers}</div>
                    </Link>
                    <Link href={`/user/following?u=${profile?.user?.username}`}>
                      <div className="text-sm text-tertiary uppercase mb-1">
                        Followings
                      </div>
                      <div className="text-2xl font-fredoka font-semibold">{profile?.stats?.following}</div>
                    </Link>
                  </div>
                  <div className="text-grey-100 text-sm space-y-0.5">
                    <div>{profile?.user?.title ?? "--"}</div>
                    {profile?.user?.about && <div>{profile?.user.about}</div>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-64">
                <Link
                  href={`/chat?${profile?.chat ? `cid=${profile.chat}` : `u=${username}`}`}
                  className="flex items-center justify-center px-6 py-3 space-x-2 text-white rounded-full shadow-[inset_0_0_12px_1px_#2F2F2F] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <span>Send Message</span>
                </Link>

                <button type="button" onClick={() => handleFollowAction(profile?.user?.username, profile?.user?.id, profile?.isFollowing)}
                  className="px-6 py-3 bg-[#1A1D22] text-gray-300 rounded-full hover:bg-[#1A1D22]/70 font-medium"
                >
                  {profile?.isFollowing && 'Unfollow'}
                  {!profile?.isFollowing && 'Follow'}
                </button>
              </div>
            </div>

            <TabGroup>
              <TabList className="flex justify-center text-center gap-8 mb-6 border-b border-dark-teal">
                {["Posts", "Rooms"].map((label) => (
                  <Tab
                    key={label}
                    className="pb-2 w-full outline-none flex justify-center data-selected:text-dark-white text-light-grey data-selected:border-b-4 data-selected:border-teal-300"
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                <TabPanel>
                  {profile?.posts && profile.posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-teal-border rounded-xl">
                      <h3 className="text-base font-semibold mb-2 text-dark-white">No post has been made yet</h3>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-6">
                      {profile?.posts.map((post: IPostList) => (
                        <SimplePostCard
                          key={post.id}
                          post={post}
                          user={profile.user}
                        />
                      ))}
                    </div>
                  )}
                </TabPanel>

                <TabPanel>
                  <MyRooms />
                </TabPanel>

              </TabPanels>
            </TabGroup>
          </> : <></>
        }
      </div>
    </>
  );
}

