import React from "react";
import Image from "next/image";
import Hero from "../../public/images/hero_image.svg";
import ArrowIcon from "../../public/images/black_arrow.svg";

const HeroSection = () => {
  return (
    <div className="flex flex-col-reverse gap-32 md:gap-60 md:flex-row md:mt-16 md:justify-center md:items-center w-full ">
      <div className="flex flex-col md:items-start md:justify-start md:w-[345px] gap-2 px-6">
        <h2 className="font-medium text-[32px] text:[#121418] md:text-[#F1F7F6] leading-9">
          Header Texts
        </h2>
        <p className="font-normal text-base text-[#A3A9A6]">
          Chat, share secrets, send tokens, and level up in the first gamified
          messaging app built on-chain.
        </p>

        <button className="bg-gradient-to-br from-[#13E5CE] to-[#15FDE4] mt-4 text-[#121418] w-full md:w-fit h-[51] opacity-100 px-6 py-4 rounded-[32px] hover:bg-[#0F5951] shadow-[6px_6px_10px_0px_#24FFE7CC_inset]] flex items-center justify-between gap-4 ">
          <span className="font-medium text-sm text-center ">Get Started</span>
          <Image src={ArrowIcon} alt="Arrow icon" width={24} height={24} />
        </button>
      </div>
      <div className="flex flex-row justify-center gap-4">
        <div className="flex flex-col justify-center items-center">
          <Image src={Hero} alt="hero-image" width={245} height={218} />
          <span className="text-[#AEB8B6] text-base">
            Gossip. Tokens. Secrets. Level up.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
