import React from "react";
import Image from "next/image";

const HowItWorksSection = () => {
  return (
    <div
      className="relative w-full py-20 px-6 overflow-hidden bg-cover  bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/landingpage/bg2.png')",
      }}
    >
      <div className=" px-10 sm:px-0 lg:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="space-y-12">
            <div
              className="flex flex-col justify-between bg-white shadow-xl rounded-3xl p-8 h-[450px]"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(34, 197, 94, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div className="flex gap-x-10 items-start ">
                <div className=" flex items-center justify-center border-[1.47px] w-[49px] h-[49px] rounded-b-lg rounded-t-4xl">
                  <p className="text-4xl font-bold text-primary-green">1</p>
                </div>

                <div className="w-[190px] h-[189px] relative">
                  <Image
                    src="/landingpage/wallet-icon.png"
                    alt="Wallet icon"
                    fill
                    className="text-white"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold  text-primary-green mb-6">
                  Connect Your Wallet
                </h3>

                <p className="text-primary-green">
                  Connect your crypto wallet (Argent, Braavos, MetaMask) and
                  we'll cover the network fees. No more worrying about gas costs
                  for your messages.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col justify-between bg-white shadow-xl rounded-3xl p-8 h-[450px]"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(34, 197, 94, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div className="flex gap-x-10 items-start ">
                <div className=" flex items-center justify-center border-[1.47px] w-[49px] h-[49px] rounded-b-lg rounded-t-4xl">
                  <p className="text-4xl font-bold text-primary-green">2</p>
                </div>

                <div className="w-[190px] h-[189px] relative">
                  <Image
                    src="/landingpage/wallet-icon.png"
                    alt="Wallet icon"
                    fill
                    className="text-white"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold  text-primary-green mb-6">
                  Start Chatting Instantly{" "}
                </h3>

                <p className="text-primary-green">
                  Connect your crypto wallet (Argent, Braavos, MetaMask) and
                  we'll cover the network fees. No more worrying about gas costs
                  for your messages.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col justify-between bg-white shadow-xl rounded-3xl p-8 h-[450px]"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(34, 197, 94, 0.6), 0 0 0 1px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div className="flex gap-x-10 items-start ">
                <div className=" flex items-center justify-center border-[1.47px] w-[49px] h-[49px] rounded-b-lg rounded-t-4xl">
                  <p className="text-4xl font-bold text-primary-green">3</p>
                </div>

                <div className="w-[190px] h-[189px] relative">
                  <Image
                    src="/landingpage/wallet-icon.png"
                    alt="Wallet icon"
                    fill
                    className="text-white"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold  text-primary-green mb-6">
                  Tip Friends & Gossip Freely{" "}
                </h3>

                <p className="text-primary-green">
                  Connect your crypto wallet (Argent, Braavos, MetaMask) and
                  we'll cover the network fees. No more worrying about gas costs
                  for your messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
