import React from "react";
import Image from "next/image";

const PreviewSection = () => {
  return (
    <div
      className="w-full py-20 px-6"
      style={{
        background:
          "linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto  ">
        <h2 className="text-4xl lg:text-5xl text-center text-black font-bold mb-34">
          Preview The Experience
        </h2>

        <div className="flex justify-end mb-4">
          <button className="rounded-full px-4 py-3 text-primary-green font-medium transition-colors text-sm bg-transparent border-2 border-primary-green">
            Click Here
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 h-[569px]">
          <div className="relative mb-6 w-full h-full">
            <Image
              src="/landingpage/mock-1.png"
              alt="Chat Securely, Send Instantly"
              fill
              className="mx-auto object-contain"
            />
          </div>

          <div className="relative mb-6 w-full h-full">
            <Image
              src="/landingpage/mock-2.png"
              alt="Send STRK Like You Send Emojis"
              fill
              className="mx-auto object-contain"
            />
          </div>

          <div className="relative mb-6 w-full h-full">
            <Image
              src="/landingpage/mock-3.png"
              alt="NFT Profile Pictures"
              fill
              className="mx-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
