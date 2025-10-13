"use client";

import Image from "next/image";

import LikeLogo from "@/images/logos/like.svg";
import HoursLeftLogo from "@/images/logos/hours.svg";
import NFTOne from "@/images/photos/nft-1.png";

interface ParrotPerchProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  reactions?: Array<{ emoji: string; count?: number }>;
  upvotes?: number;
  timeLeft?: string;
}

export default function Rooms({
  title = "Parrot's Perch",
  description = "I heard someone’s wallet got drained last night....",
  imageUrl = "/api/placeholder/300/280",
  reactions = [
    { emoji: "😱" },
    { emoji: "😂" },
    { emoji: "😎", count: 24 }
  ],
  upvotes = 240,
  timeLeft = "1 hour left"
}: ParrotPerchProps) {
  return (
    <div className="bg-[#1a1d24] rounded-2xl flex items-center gap-8 w-full md:0 mb-22">
      <div className="relative flex-shrink-0">
        <div className="w-[250px] h-[200px] rounded-tl-2xl rounded-bl-2xl overflow-hidden">
          <Image
            src={NFTOne}
            alt={title}
            className="w-full h-full object-center"
          />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-dark-white text-2xl font-bold font-fredoka mb-3">{title}</h2>
          <p className="text-tertiary text-sm">{description}</p>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1">
            <div className="isolate flex -space-x-1 overflow-hidden">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="relative z-10 inline-block size-6 rounded-full ring-2 ring-white outline -outline-offset-1 outline-black/5 dark:ring-gray-900 dark:outline-white/10"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="relative z-20 inline-block size-6 rounded-full ring-2 ring-white outline -outline-offset-1 outline-black/5 dark:ring-gray-900 dark:outline-white/10"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                className="relative z-20 inline-block size-6 rounded-full ring-2 ring-white outline -outline-offset-1 outline-black/5 dark:ring-gray-900 dark:outline-white/10"
              />
            </div>
            {/*{reactions.map((reaction, index) => (*/}
            {/*  <div*/}
            {/*    key={index}*/}
            {/*    className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl -ml-2 first:ml-0 border-2 border-[#1a1d24] relative"*/}
            {/*  >*/}
            {/*    {reaction.emoji}*/}
            {/*    {reaction.count && (*/}
            {/*      <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[24px] text-center">*/}
            {/*        +{reaction.count}*/}
            {/*      </span>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*))}*/}
          </div>

          <div className="h-8 w-px bg-gray-700"></div>

          <div className="flex items-center text-red-500">
            <Image
              src={LikeLogo}
              alt=""
              className="w-auto"
            />
            <span className="text-grey-500 text-sm font-semibold">{upvotes}</span>
          </div>

          <div className="h-8 w-px bg-gray-700"></div>

          <div className="flex items-center gap-2 text-cyan-400">
            <Image
              alt=""
              src={HoursLeftLogo}
              className="w-auto"
            />
            <span className="text-grey-500 text-sm">{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
