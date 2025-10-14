"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckCircle2, ArrowRight, Rocket, Share } from "lucide-react";

import Image from "next/image";
import SuccessPost from "@/images/logos/success-post.svg";

interface PostSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned?: number;
}

export default function PostSuccessDialog({
  isOpen,
  onClose,
  xpEarned = 30,
}: PostSuccessDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-100">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl bg-linear-to-b bg-[#121A19]/60  rounded-3xl shadow-2xl overflow-hidden border border-[#14F1D9]/20">
          <div className="">
            {/* Success Banner */}
            <div className="flex items-center justify-center gap-3 mb-12 bg-teal-800 shadow-xl rounded-2xl py-4 px-6">
              <CheckCircle2 size={24} className="text-[#14F1D9]" />
              <p className="text-white text-lg">
                Your post was successfully uploaded
              </p>
            </div>

            {/* Character and XP Display */}
            <div className="flex flex-col items-center my-14">
              <div className="relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Character Placeholder - Using emoji as placeholder for the yellow bird */}
                  <Image src={SuccessPost} alt="" />
                </div>
                {/* XP Amount */}
                <div className="absolute top-28 left-18 text-4xl font-bold text-white">
                  {xpEarned}
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl text-white font-semibold mb-2">
                You&apos;ve earned some XP!
              </h2>

              {/* Rocket Icon */}
              <div className="text-[#14F1D9] mb-8">
                <Rocket size={22} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pb-10">
              {/* Share Button */}
              <div className="flex justify-center w-full space-x-4">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-14 h-14 glass-effect rounded-xl transition-all"
                >
                  <Share size={20} className="text-[#14F1D9]" />
                </button>

                {/* Continue Button */}
                <button
                  onClick={onClose}
                  className=" flex items-center px-28 justify-center gap-3 bg-[#14F1D9] text-black py-4 rounded-full hover:bg-[#12d9c4] transition-colors font-semibold text-lg"
                >
                  <span>Continue</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
