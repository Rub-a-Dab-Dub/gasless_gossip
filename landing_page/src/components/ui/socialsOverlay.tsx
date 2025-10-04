import Image from "next/image";
import Link from "next/link";
import Twitter from "../../../public/images/twitter_logo.svg";
import Telegram from "../../../public/images/TelegramLogo.svg";
import Github from "../../../public/images/githun_logo.svg";

export default function socialsOverlay() {
  return (
    <div className="hidden text-[#FFFFFF] shadow-[0px_0px_12px_0px_#16F2DA14_inset] backdrop-blur-[20px] w-full max-w-sm mx-auto bg-[#1214187A] border border-[#3C4A47] rounded-[20px] p-4 xl:flex flex-col items-center gap-4">
      <Link
        href=""
        aria-label="Gasless Gossips page"
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 bg-[#171A1A] rounded-md flex items-center justify-center">
          <Image
            src={Twitter}
            alt="Gasless Gossip Logo"
            width={20}
            height={20}
          />
        </div>
        <span className="font-medium text-sm text-center ">TWITTER</span>
      </Link>
      <div className="h-12 w-[3px] bg-[#171A1A]"></div>
      <Link
        href=""
        aria-label="Gasless Gossips page"
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 bg-[#171A1A] rounded-md flex items-center justify-center">
          <Image
            src={Telegram}
            alt="Gasless Gossip Logo"
            width={20}
            height={20}
          />
        </div>
        <span className="font-medium text-sm text-center ">TELEGRAM</span>
      </Link>
      <div className="h-12 w-[3px] bg-[#171A1A]"></div>
      <Link
        href=""
        aria-label="Gasless Gossips page"
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 bg-[#171A1A] rounded-md flex items-center justify-center">
          <Image
            src={Github}
            alt="Gasless Gossip Logo"
            width={16.88}
            height={16.88}
          />
        </div>
        <span className="font-medium text-sm text-center ">GITHUB</span>
      </Link>
    </div>
  );
}
