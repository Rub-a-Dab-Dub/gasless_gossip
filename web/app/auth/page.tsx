"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/public/logo flsah screen4.json";
import { Fredoka, Baloo_2 } from "next/font/google";
import WelcomeScreen from "@/components/WelcomeScreen";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baloo_2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function Header() {
  return (
    <nav className="flex bg-[#121418] items-center justify-between p-5">
      <div className="flex items-center space-x-2 gap-70">
        <div className="flex items-center">
          <Image
            src={"/gg.svg"}
            width={64}
            height={48}
            alt="Logo"
            className="w-16 h-12"
          />
        </div>
        <div className="flex space-x-6 text-sm text-white">
          <a href="#" className="hover:text-[#7AF8EB] transition-colors">
            home
          </a>
          <a href="#" className="hover:text-[#7AF8EB] transition-colors">
            about
          </a>
          <a href="#" className="hover:text-[#7AF8EB] transition-colors">
            home
          </a>
        </div>
      </div>

      <button className=" text-white flex shadow-[inset_0_0_12px_1px_#2F2F2F]  items-center space-x-2 px-6 py-4 rounded-full hover:opacity-80 cursor-pointer transition-colors">
        <span>Connect Wallet</span>
        <ArrowRight />
      </button>
    </nav>
  );
}

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="">
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow">
          <WelcomeScreen username={"username"} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-xl w-full space-y-6 rounded-b-4xl pb-30 shadow-[inset_0_0_32px_1px_#0F59513D] flex flex-col items-center">
          <div className="w-64 h-64 relative -top-30">
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-full"
            />
            <Image
              src={"/Ellipse 1.svg"}
              width={24}
              height={24}
              alt=""
              className="relative -top-30 left-18 w-24 object-cover"
            />
            <p
              className={`relative -top-28 text-center text-[#F1F7F6] ${baloo_2.className} max-w-md`}
            >
              Ready to spill the tea?
            </p>

            <h2
              className={`${fredoka.className} text-[#7AF8EB] text-center relative -top-20 font-medium text-4xl`}
            >
              Sign Up
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-[#7AF8EB] text-sm font-medium mb-2"
              >
                username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='e.g. "MaskedParrot85"'
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7AF8EB] transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[#7AF8EB] text-sm font-medium mb-2"
              >
                create password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. asjdkskajn"
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7AF8EB] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[#7AF8EB] text-sm font-medium mb-2"
              >
                confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="e.g. asjdkskajn"
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7AF8EB] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeClosed className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 mb-10">
              <button
                onClick={handleSubmit}
                className="flex shadow-[inset_0_0_12px_1px_#2F2F2F] items-center space-x-2 px-6 py-4 rounded-full hover:opacity-80 cursor-pointer transition-colors text-white"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
