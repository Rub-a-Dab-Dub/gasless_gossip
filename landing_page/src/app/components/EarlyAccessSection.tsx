import React from "react";

const EarlyAccessSection = () => {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6 eounded-xl bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-primary-green">
          Get early access
        </h2>

        <p
          className="text-lg mb-12 leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--primary-green)" }}
        >
          The future of Web3 communication is here. Be part of the first
          community to experience gasless, on-chain conversations powered by
          Starknet. No fees, no friction, just pure connection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white px-8 py-4  font-semibold transition-colors rounded-3xl">
            Email
          </button>
          <button className=" px-8 py-4 text-white  font-semibold transition-colors rounded-3xl bg-primary-green">
            Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarlyAccessSection;
