"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Gift, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import Avatar from "@/components/ui/Avatar"
import { usePathname } from "next/navigation";
import CreateSuccessDialog from "@/components/CreateSuccessDialog";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";

interface CreatePostDialogProps {
  show: boolean;
  onClose: () => void;
}

export default function CreatePostDialog({ show, onClose }: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      setIsPosting(true);
      const res = await api.post<ApiResponse>(`posts`, { content });
      if (res.data.error) {
        toast.error(res.data.message ?? "Failed")
        return;
      }
      toast.success(res.data.data.message)
      setIsPosted(true);
      setContent("");
      onClose();
    } catch (error) {
      toast.error("Unable to create post, an error occurred..")
      console.error("Error posting:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handlePost();
    }
  };

  return (
    <>
      <Dialog open={show} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl bg-[#0f1419] border border-[#14F1D9]/30 rounded-3xl shadow-2xl shadow-[#14F1D9]/10">
            <div className="p-6">
              <div className="flex gap-4">
                <Avatar />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What's happening?"
                  className="w-full bg-transparent text-white text-xl placeholder:text-gray-500 resize-none focus:outline-none min-h-[200px]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <button className="p-2 text-[#14F1D9] hover:bg-[#14F1D9]/10 rounded-lg">
                    <Gift size={24} />
                  </button>
                </div>

                <button
                  onClick={handlePost}
                  disabled={!content.trim() || isPosting}
                  className="flex items-center gap-3 bg-dark border border-teal text-white px-6 py-3 rounded-full hover:bg-grey-800 transition-colors font-semibold"
                >
                  <span className="w-12 h-12 bg-light-teal text-black rounded-full flex items-center justify-center">
                    <ArrowRight size={24} />
                  </span>
                  <span className="text-sm font-bold">Post</span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <CreateSuccessDialog action="post" isOpen={isPosted} onClose={() => setIsPosted(false)} xpEarned={30} />
    </>
  );
}
