import React from "react";
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <div className="w-full py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-semibold text-center mb-16">
          Key Features{" "}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="bg-light-green rounded-xl h-[453px] p-8 shadow-sm border border-light-green flex flex-col">
              <div className="flex bg-white w-fit rounded-full px-3 py-1 items-center mb-4">
                <p className="text-base text-secondary-green">
                  Gasless messaging
                </p>
              </div>

              <p
                className="mb-6 leading-relaxed flex-grow"
                style={{ color: "var(--primary-green)" }}
              >
                Say goodbye to gas fees. Gasless Gossip uses account abstraction
                and Starknet's L2 scalability to let you send messages without
                ever worrying about transaction costs.
              </p>

              <div className="flex bg-white w-full h-[109.33px] rounded-full px-3 py-1 items-center relative">
                <Image src="/landingpage/progress-bar.png" alt="message" fill />
              </div>
            </div>

            <div className="relative bg-light-green h-[453px] rounded-xl p-8 shadow-sm border border-light-green flex flex-col">
              <div className="flex bg-white w-fit rounded-full px-3 py-1 items-center mb-4">
                <p className="text-base text-secondary-green">
                  Real-Time Communication{" "}
                </p>
              </div>

              <p
                className="mb-6 leading-relaxed flex-grow"
                style={{ color: "var(--primary-green)" }}
              >
                with on-chain confirmations, Gasless Gossip ensures your chats
                are fast, smooth,
              </p>

              <div className="flex w-full h-[109.33px] px-3 items-center relative">
                <Image
                  src="/landingpage/real-time.png"
                  className="object-contain"
                  alt="message"
                  fill
                />
              </div>
            </div>
          </div>

          <div className="bg-light-green rounded-xl shadow-xl border border-light-green flex flex-col h-full overflow-hidden">
            <div className="bg-white rounded-full flex items-center w-fit py-2 px-3 mb-4 mx-8 mt-8">
              <p className="text-base font-bold text-primary-green">
                Real-Time Communication
              </p>
            </div>

            <p
              className="mb-6 leading-relaxed flex-grow mx-8"
              style={{ color: "var(--primary-green)" }}
            >
              Conversations happen live, just like you're used to. Leveraging
              off-chain indexing with on-chain confirmations, Gasless Gossip
              ensures your chats are fast, smooth, and always synced across
              devices.
            </p>
            <div className="flex w-full  h-[310px] items-center relative">
              <Image
                src="/landingpage/stack-wallets.png"
                alt="message"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
