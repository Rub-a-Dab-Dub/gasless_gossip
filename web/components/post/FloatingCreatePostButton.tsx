"use client";

import { useState } from "react";
import CreatePostDialog from "@/components/post/CreatePostDialog";

export default function FloatingCreatePostButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed z-50 bottom-60 xl:bottom-20 right-4 xl:right-0 overflow-hidden">
        <div className="border-none xl:border xl:border-r-none xl:border-zinc-800 bg-dark px-6 py-4 w-[120px] xl:w-[120px] rounded-l-full rounded-r-none">
          <div className="bg-zinc-800 xl:border xl:border-[#1E2A28] xl:rounded-full xl:w-20 xl:h-20 xl:flex xl:items-center xl:justify-center">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-12 h-12 bg-[#14F1D9]
    shadow-[0_4px_10px_rgba(20,241,217,0.15),inset_0_-4px_4px_#009282,inset_0_6px_4px_#85FFF2] rounded-full flex items-center justify-center drop-shadow-md cursor-pointer transition-colors"
            >
              <svg
                className="w-6 h-6 text-zinc-800 font-normal"
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
