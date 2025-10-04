import Image from "next/image";
import Link from "next/link";
import Twitter from "../../public/images/twitter_logo.svg";
import Telegram from "../../public/images/TelegramLogo.svg";
import Github from "../../public/images/githun_logo.svg";

const Footer = () => {
  return (
    <footer className="bg-[url(/images/mobile_footer_bg.svg)] md:bg-[url(/images/footer_bg.svg)] bg-cover bg-no-repeat w-full min-h-[423px] md:bg-cover px-[10px] md:px-16 flex flex-cols items-center">
      <div className="max-w-[1440px] mx-auto flex flex-col justify-center 2xl:mt-24 gap-16 w-full">
        <div className="text-[#FFFFFF] flex justify-between md:justify-center md:gap-16 items-center">
          <Link
            href=""
            aria-label="Gasless Gossips page"
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-[#171A1A] rounded-full flex items-center justify-center">
              <Image
                src={Twitter}
                alt="Gasless Gossip Logo"
                width={20}
                height={20}
              />
            </div>
            <span className="font-medium text-sm text-center ">TWITTER</span>
          </Link>
          <div className="h-16 w-[3px] bg-[#171A1A]"></div>
          <Link
            href=""
            aria-label="Gasless Gossips page"
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-[#171A1A] rounded-full flex items-center justify-center">
              <Image
                src={Telegram}
                alt="Gasless Gossip Logo"
                width={20}
                height={20}
              />
            </div>
            <span className="font-medium text-sm text-center ">TELEGRAM</span>
          </Link>
          <div className="h-16 w-[3px] bg-[#171A1A]"></div>
          <Link
            href=""
            aria-label="Gasless Gossips page"
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-[#171A1A] rounded-full flex items-center justify-center">
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
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#3C4A47]">
            &copy; copyright gaslessgossip{new Date().getFullYear()}
          </span>
          <div className="text-[#A3A9A6] flex items-center gap-1">
            <span>Privacy policy</span>
            <span className="text-lg leading-none ">•</span>
            <span>terms & conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
