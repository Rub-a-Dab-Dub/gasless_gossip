"use client";

import { useState } from "react";
import CreatePostDialog from "@/components/post/CreatePostDialog";

export default function FloatingCreatePostButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed z-50 bottom-60 xl:bottom-48 right-4 xl:right-0 overflow-hidden">
        <div className="border-none xl:border xl:border-r-none xl:border-zinc-800 bg-transparent xl:bg-zinc-900 p-8 w-[120px] xl:w-[200px] rounded-l-full rounded-r-none">
          <div className="xl:bg-zinc-800 xl:border xl:border-emerald-900 xl:rounded-full xl:w-26 xl:h-26 xl:flex xl:items-center xl:justify-center">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-18 h-18 bg-emerald-300 rounded-full flex items-center justify-center drop-shadow-md drop-shadow-emerald-300 hover:bg-emerald-400 transition-colors"
            >
              <svg
                className="w-10 h-10 text-zinc-800 font-normal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <CreatePostDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
