import Image from "next/image";
import ArrowIcon from "../../public/images/arrow.svg";
import AboutImage from "../../public/images/about-us.svg";

const About = () => {
  return (
    <div className="flex flex-row justify-center gap-5 mt-16 w-full ">
      <div className="flex flex-col md:w-[700px] lg:w-[500px] gap-2 px-8">
        <h2 className="font-medium text-4xl md:text-3xl lg:text-[64px] leading-[100%] text:[#121418] md:text-[#121418]">
          About Us
        </h2>
        <p className="font-normal font-baloo_2 text-base leading-[30px] text-[#A3A9A6]">
          Whisper is not just another Web3 chat app. It’s where gossip meets
          tokens, secrets meet collectibles, and every message pushes you closer
          to leveling up. We’re turning social interaction into a game — fun,
          chaotic, and rewarding, with no gas fees slowing you down.
        </p>
        <div className="flex justify-end md:justify-start">
          <button className="bg-[#121418] mt-4 text-[#F1F7F6] w-[173px] md:w-fit h-[51] opacity-100 px-6 py-4 rounded-[32px] hover:bg-[#0F5951] shadow-[6px_6px_10px_0px_#24FFE7CC_inset]] flex items-center justify-center gap-4 ">
            <span className="font-medium text-sm text-center ">
              Get Started
            </span>
            <Image src={ArrowIcon} alt="Arrow icon" width={24} height={24} />
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex flex-col justify-center items-center">
          <Image src={AboutImage} alt="about-image" width={981} height={296} />
        </div>
      </div>
    </div>
  );
};

export default About;
