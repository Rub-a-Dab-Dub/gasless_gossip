'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Image, Gift } from 'lucide-react'
import React, { useState } from 'react';
import Avatar from "@/components/ui/Avatar";
import { usePathname } from "next/navigation";

import PostSuccessDialog from "@/components/PostSuccessDialog";
import {ArrowRight} from "@/components/icons";

export default function CreatePostDialog() {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPosted, setIsPosted] = useState(false);

  const pathname = usePathname();

  const handlePost = async () => {
    if (!content.trim()) return

    setIsPosted(true)

    setIsPosting(true)
    try {
      setContent('')
      setIsOpen(false);
    } catch (error) {
      console.error('Error posting:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePost()
    }
  }

  return (
    <>
      {pathname === "/me" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 font-semibold bg-light-teal glass-effect__lighter text-light-teal rounded-full hover:bg-emerald-500/10 transition-colors flex items-center gap-2 font-medium">
          <span>Create New Posts</span>
          <ArrowRight/>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 drop-shadow-lg bg-darker-grey border-1 border-teal-border text-white text-black px-6 py-3 rounded-full hover:bg-grey-800 transition-colors font-semibold">
          <span className="w-12 h-12 bg-light-teal text-black rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </span>
          <span className="text-sm">Create Post</span>
        </button>
      )}

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="w-full max-w-5xl bg-[#0f1419] border border-[#14F1D9]/30 rounded-3xl shadow-2xl shadow-[#14F1D9]/10">
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar/>
                </div>

                <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What's Happening?"
                  className="w-full bg-transparent text-white text-xl placeholder:text-gray-500 resize-none focus:outline-none min-h-[200px]"
                  autoFocus
                />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="p-2 text-[#14F1D9] hover:bg-[#14F1D9]/10 rounded-lg transition-colors"
                    title="Add image"
                  >
                    <Image size={24}/>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-[#14F1D9] hover:bg-[#14F1D9]/10 rounded-lg transition-colors"
                    title="Add gift"
                  >
                    <Gift size={24}/>
                  </button>
                </div>

                <button
                  onClick={handlePost}
                  disabled={!content.trim() || isPosting}
                  className="flex items-center gap-3 bg-dark border border-teal text-white text-black px-6 py-3 rounded-full hover:bg-grey-800 transition-colors font-semibold">
                    <span className="w-12 h-12 bg-light-teal text-black rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </span>
                  <span className="text-sm font-bold">Post</span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <PostSuccessDialog isOpen={isPosted} onClose={() => setIsPosted(false)} />
    </>
  )
}
