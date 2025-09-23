import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className=" w-full min-h-screen overflow-hidden ">
      <div className="flex flex-col items-center max-w-5xl mx-auto">
        <div className="pt-28 flex flex-col items-center  px-6">
          <div className="mb-8 flex ">
            <div className="inline-flex items-center px-4 py-2 border border-primary-green  rounded-full shadow-sm">
              <span className="text-secondary-green">Powered by Stellar</span>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center space-y-2 ">
          <h1 className="text-6xl text-secondary-green md:text-7xl lg:text-8xl font-bold space-x-2 ">
            <span className="">Chat.</span>
            <span className="italic font-normal font-serif">Gossip.</span>
            <span className="">Tip</span>
          </h1>
          <h1 className="text-6xl text-secondary-green md:text-7xl lg:text-8xl font-bold">
            No Gas Required
          </h1>
        </div>

        <p className="text-lg md:text-xl max-w-2xl font-normal mb-12 text-black text-center">
          A social messaging app built on Starknet, real-time chat and token
          tipping chat and token tipping all — gasless.
        </p>

        <button className="text-white px-12 py-4 rounded-lg text-xl font-semibold transition-colors shadow-lg mb-16 bg-primary-green">
          Join the Gossip
        </button>
      </div>

      <div className="w-full h-[500px] sm:h-[700px] relative">
        <Image src="/landingpage/hero.png" alt="hero-image" className="object-contain sm:object-cover" fill />
      </div>
    </div>
  );
};

export default HeroSection;
