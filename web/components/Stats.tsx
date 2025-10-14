"use client";

import { Zap } from "lucide-react";

interface ProfileCardProps {
  xp?: number;
  level?: number;
  currentLevelXp?: number;
  nextLevelXp?: number;
  balance?: string;
  avatarUrl?: string;
}

import ChickEggShell from "@/images/photos/chick-shell.png";
import Image from "next/image";

export default function Stats({
  xp = 120,
  level = 2,
  currentLevelXp = 2,
  nextLevelXp = 3,
  balance = "2.12M",
}: // avatarUrl = '/images/avatar-chick.png'
ProfileCardProps) {
  const progress = (currentLevelXp / nextLevelXp) * 100;

  return (
    <div className="rounded-3xl relative overflow-hidden min-h-[600px] flex flex-col">
      {/* Top Section - Stats and Level */}
      <div className="relative pb-4">
        {/* Background bars */}
        <div className="absolute top-0 left-0 right-0">
          <div className="absolute top-0 left-0 h-32 w-full bg-[#0A2321]" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          {/* XP */}
          <div className="px-4 py-4">
            <div className="text-xs text-[#14F1D9] uppercase tracking-wider mb-2">
              XP
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0d4d45] rounded-lg flex items-center justify-center border border-[#14F1D9]/30">
                <Zap size={18} className="text-[#14F1D9] fill-[#14F1D9]" />
              </div>
              <span className="font-bold text-white">{xp}</span>
            </div>
          </div>

          {/* Level Circle */}
          <div className="relative flex flex-col items-center">
            {/* Progress Ring */}
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              {/* Background segments */}
              {[0, 1, 2, 3].map((segment) => {
                const circumference = 2 * Math.PI * 70;
                const gapSize = 8;
                const segmentLength = (circumference - gapSize * 4) / 4;
                const offset = segment * (segmentLength + gapSize);

                return (
                  <circle
                    key={`bg-${segment}`}
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#1a2f2c"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${segmentLength} ${gapSize}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Progress segments */}
              {[0, 1, 2, 3].map((segment) => {
                const circumference = 2 * Math.PI * 70;
                const gapSize = 8;
                const segmentLength = (circumference - gapSize * 4) / 4;
                const offset = segment * (segmentLength + gapSize);

                const segmentProgress = Math.max(
                  0,
                  Math.min(25, progress - segment * 25)
                );
                const progressLength = (segmentLength * segmentProgress) / 25;

                return (
                  <circle
                    key={`progress-${segment}`}
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#14F1D9"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progressLength} ${circumference}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Level Content */}
            <div className="absolute inset-0 text-white flex flex-col items-center justify-center">
              <div className="font-bold">lvl</div>
              <div className="text-5xl font-bold leading-none">{level}</div>
            </div>

            {/* Progress Text */}
            <div className="absolute bottom-0 bg-teal-800 backdrop-blur-sm px-4 py-1 rounded-full border border-[#14F1D9]/20">
              <span className="text-sm text-[#14F1D9] font-medium">
                {currentLevelXp}/{nextLevelXp}
              </span>
            </div>
          </div>

          {/* Balance */}
          <div className="px-4 py-4 text-right">
            <div className="text-xs text-[#14F1D9] uppercase tracking-wider mb-2">
              Balance
            </div>
            <div className="text-2xl font-bold text-white">{balance}</div>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="relative">
          {/* Glow effect behind avatar */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-yellow-600/10 to-transparent blur-2xl scale-150" />

          <Image
            src={ChickEggShell}
            alt="Profile Avatar"
            className="z-10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="md:px-8 pb-8">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <button
              key={page}
              className={`h-12 flex items-center px-6 drop-shadow-xl justify-center transition-all ${
                page === 1
                  ? "bg-white clip-path text-black font-bold px-6 shadow-lg"
                  : "bg-[#1a2f2c] text-gray-600 hover:bg-[#243937] hover:text-gray-400 px-5 rounded-xl"
              }`}
            >
              <span className={page === 1 ? "text-xl" : "text-lg"}>{page}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
