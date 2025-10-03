import Card from "./ui/card";
import Icon from "../../public/images/icons.svg";
import Image from "next/image";
import ArrowIcon from "../../public/images/arrow.svg";

export default function whatWeOffer() {
  return (
    <div className="max-w-[1440px] mx-auto p-8 mt-32 flex flex-col gap-6">
      <h2 className="font-medium text-2xl md:text-2xl leading-[100%] text:[#121418]">
        What We Offer
      </h2>
      <p className="font-normal font-baloo_2 text-base leading-[30px] text-[#A3A9A6]">
        Header Texts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          iconAlt="icon"
          iconSrc={Icon}
          title="Secret Rooms"
          description="Join private, timed rooms with fake names & anonymous gossip. 😉"
        />
        <Card
          iconSrc={Icon}
          iconAlt="icon"
          title="Gamified Progression"
          description="Earn XP, unlock badges, and flex your gossip level."
        />
        <Card
          iconSrc={Icon}
          iconAlt="icon"
          title="Token Gifting & Collectibles"
          description="Send tokens, gift rare digital items, and collect bragging rights."
        />
      </div>
      <div className="flex justify-end">
        <button className="bg-[#121418] mt-4 text-[#F1F7F6] w-[173px] md:w-fit h-[51] opacity-100 px-6 py-4 rounded-[32px] hover:bg-[#0F5951] shadow-[6px_6px_10px_0px_#24FFE7CC_inset]] flex items-center justify-center gap-4 ">
          <span className="font-medium text-sm text-center ">Get Started</span>
          <Image src={ArrowIcon} alt="Arrow icon" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
