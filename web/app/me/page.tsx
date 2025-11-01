"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { X } from "lucide-react";

import Header from "@/components/ui/Header";
import Avatar from "@/images/photos/avatar.png";
import ArrowRightIcon from "@/images/logos/arrow-right.svg";

import { useAuth } from "@/hooks/useAuth";
import { useProfileData } from "@/hooks/useProfileData";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import { IPostList } from "@/types/post";

import Quest from "@/components/Quest";
import RoomsTab from "@/components/tabs/Rooms";
import NftsTab from "@/components/tabs/Nfts";
import PostCard from "@/components/cards/PostCard";
import CreatePostButtons from "@/components/post/CreatePostButtons";
import FloatingCreatePostButton from "@/components/post/FloatingCreatePostButton";
import DeletePostDialog from "@/components/post/DeletePostDialog";
import { setToLocalStorage } from "@/lib/local-storage";
import EditPostDialog from "@/components/post/EditPostDialog";
import MyRooms from "@/components/room/MyRooms";
import { ArrowRight } from "@/components/icons";

export default function Me() {
  const { profile, profileStats, myPosts, postsLoading } = useProfileData();
  const { user } = useAuth();

  const [form, setForm] = useState<Partial<IUser>>({});
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [post, setPost] = useState<IPostList | null>(null);
  const [postId, setPostId] = useState<number | null>(null);
  const [showPostEdit, setShowPostEdit] = useState(false);
  const [showPostDelete, setShowPostDelete] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!form.username) return toast.error("Username must not be empty");
    setShowPostDelete;

    try {
      setSaving(true);
      const payload = { ...form };
      delete payload.id;
      delete payload.xp;

      const res = await api.put<ApiResponse>("users/profile", payload);
      if (res.data.error) {
        toast.error(res.data.message ?? "Failed to update profile");
        return;
      }

      setToLocalStorage("user", JSON.stringify(res.data.data));
      setShowEdit(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while updating profile");
    } finally {
      setShowPostDelete;
      setSaving(false);
    }
  }, [form]);

  const handlePostEdit = (post: IPostList) => {
    setPost(post);
    setShowPostEdit(true);
  };

  const handlePostDelete = (id: number) => {
    setPostId(id);
    setShowPostDelete(true);
  };

  return (
    <>
      <Header />

      {user ? (
        <>
          <div className="max-w-7xl mx-auto px-4 py-32 text-white">
            <ProfileHeader
              profile={profile}
              stats={profileStats}
              onEditClick={() => setShowEdit(true)}
            />

            <QuestsSection />

            <TabGroup>
              <TabList className="flex justify-center text-center gap-8 mb-6 border-b border-dark-teal">
                {["Posts", "Rooms", "NFTs"].map((label) => (
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
                  {postsLoading ? (
                    <p className="py-16 text-center text-sm text-white">
                      Loading posts...
                    </p>
                  ) : myPosts.length === 0 ? (
                    <EmptyPostsState />
                  ) : (
                    <div className="flex flex-col space-y-6">
                      {myPosts.map((post: IPostList) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onEdit={handlePostEdit}
                          onDelete={handlePostDelete}
                        />
                      ))}
                    </div>
                  )}
                </TabPanel>

                <TabPanel>
                  <MyRooms />
                </TabPanel>

                <TabPanel>
                  <NftsTab />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          {postId && (
            <DeletePostDialog
              id={postId}
              show={showPostDelete}
              onClose={() => setShowPostDelete(false)}
            />
          )}
          {post && (
            <EditPostDialog
              post={post}
              show={showPostEdit}
              onClose={() => setShowPostEdit(false)}
            />
          )}

          <FloatingCreatePostButton />

          {showEdit && (
            <EditProfileModal
              form={form}
              onChange={handleChange}
              onClose={() => setShowEdit(false)}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

/* ------------------------- Sub Components ------------------------- */

function ProfileHeader({
  profile,
  stats,
  onEditClick,
}: {
  profile: IUser | null;
  stats: any;
  onEditClick: () => void;
}) {
  return (
    <div
      style={{
        boxShadow: "0px 12px 13px -6px #14E3CD14",
      }}
      className="p-3 rounded-bl-3xl rounded-br-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8"
    >
      <div className="flex items-center gap-6">
        <div>
          <Image
            src={profile?.photo ?? Avatar}
            alt=""
            width={120}
            height={120}
            className="rounded-full object-cover border-2 border-emerald-500"
          />
          <div className="text-sm text-center mt-2 text-dark-white">
            {profile?.username ?? "stranger"}
          </div>
        </div>

        <div>
          <div className="flex gap-6 mb-3">
            {[
              { id: "posts", name: "Posts", link: "" },
              {
                id: "followers",
                name: "Followers",
                link: `/user/followers?u=${profile?.username}`,
              },
              {
                id: "following",
                name: "Following",
                link: `/user/following?u=${profile?.username}`,
              },
            ].map((row) =>
              !row.link ? (
                <div key={row.id}>
                  <div className="text-sm text-tertiary uppercase mb-1">
                    {row.name}
                  </div>
                  <div className="text-2xl font-fredoka font-semibold">
                    {stats?.[row.id] ?? 0}
                  </div>
                </div>
              ) : (
                <Link key={row.id} href={row.link}>
                  <div className="text-sm text-tertiary uppercase mb-1">
                    {row.name}
                  </div>
                  <div className="text-2xl font-fredoka font-semibold">
                    {stats?.[row.id] ?? 0}
                  </div>
                </Link>
              )
            )}
          </div>
          <div className="text-grey-100 text-sm space-y-0.5">
            <div>{profile?.title ?? "--"}</div>
            {profile?.about && <div>{profile.about}</div>}
            <div>XP: {profile?.xp ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-64">
        <Link
          href="/wallet"
          className="text-white flex justify-center space-x-2 shadow-[inset_0_0_12px_1px_#2F2F2F]  items-center space-x-2 px-6 py-3 rounded-full hover:opacity-80 cursor-pointer transition-colors"
        >
          <span>View Wallet</span>
        </Link>
        <button
          onClick={onEditClick}
          className="px-6 py-3 bg-[#1A1D22] text-gray-300 rounded-full hover:bg-[#1A1D22]/70 font-medium"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function QuestsSection() {
  return (
    <div className="rounded-2xl px-10 py-8 glass-effect__light mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-grey-500 font-fredoka">
          Quests
        </h2>
        <button className="text-sm text-teal-300 hover:underline">
          View All
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-4">
        <Quest />
      </ul>
    </div>
  );
}

function EmptyPostsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-teal-border rounded-xl">
      <h3 className="text-base font-semibold mb-2 text-dark-white">
        No post has been made yet
      </h3>
      <p className="text-light-grey mb-8">
        Create your first post to get started
      </p>
      <CreatePostButtons />
    </div>
  );
}
const safeValue = (val: any) =>
  typeof val === "string" || typeof val === "number" ? val : "";

function EditProfileModal({
  form,
  onChange,
  onClose,
  onSave,
  saving,
}: {
  form: Partial<IUser>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-teal-800/75 w-full max-w-lg border border-teal-300 rounded-4xl p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300 hover:text-emerald-400"
        >
          <X size={32} />
        </button>

        <h2 className="text-2xl font-normal pt-4 pb-2 text-left text-zinc-300/80">
          Edit Profile
        </h2>
        <div className="text-sm font-normal text-emerald-200 mb-4">
          Update your account info
        </div>

        {["email", "username", "title"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm text-zinc-300/80 mb-1 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={safeValue(form[field as keyof IUser])}
              onChange={onChange}
              className="w-full px-4 py-2 bg-white/5 text-zinc-200 rounded-md border border-emerald-400/10 outline-none"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm text-zinc-300/80 mb-1">About</label>
          <textarea
            name="about"
            value={form.about || ""}
            onChange={onChange}
            rows={2}
            className="w-full px-4 py-2 bg-white/5 text-zinc-200 rounded-md border border-emerald-400/10 outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-zinc-100 text-zinc-100 hover:bg-zinc-600 bg-zinc-500 transition"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={onSave}
            className="px-6 py-2 rounded-full bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
