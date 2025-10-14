"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, HomeIcon } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/public/logo flsah screen4.json";
import { Fredoka, Baloo_2 } from "next/font/google";
import { useRouter } from "next/navigation";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baloo_2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Onboarding() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading - remove this in production and use your actual loading logic
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Image
          src={"/Vector 4.svg"}
          width={24}
          height={24}
          alt=""
          className="absolute inset-0 w-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 text-white">
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
            <nav className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                home
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                about
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                home
              </a>
            </nav>
          </div>

          <button className="flex shadow-[inset_0_0_12px_1px_#2F2F2F] items-center space-x-2 px-6 py-4 rounded-full hover:opacity-80 cursor-pointer transition-colors">
            <span>Connect Wallet</span>
            <ArrowRight />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6 absolute top-30">
          <div className="w-64 h-64">
            <Lottie animationData={animationData} loop={true} />
            <Image
              src={"/Ellipse 1.svg"}
              width={24}
              height={24}
              alt=""
              className="relative -top-30 left-14 w-24 object-cover"
            />
            <h2
              className={`${fredoka.className} relative -top-20 font-medium text-4xl`}
            >
              gasless gossip
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen">
      <nav className="flex bg-[#121418] rounded-b-4xl items-center justify-between p-5">
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
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="w-64 h-64 relative -top-30">
          <Lottie animationData={animationData} loop={true} />
          <Image
            src={"/Ellipse 1.svg"}
            width={24}
            height={24}
            alt=""
            className="relative -top-30 left-14 w-24 object-cover"
          />
          <h2
            className={`${fredoka.className} relative -top-30 font-medium text-4xl`}
          >
            gasless gossip
          </h2>
          <p
            className={`relative -top-28 text-center text-[#6B7A77] ${baloo_2.className} max-w-md`}
          >
            Gossip. Tokens. Secrets. Level up.
          </p>
        </div>

        <div className="relative top-40 z-50 space-y-4 max-w-md text-center">
          <button
            onClick={() => router.push("/auth")}
            className={`w-75 inset-0  cursor-pointer bg-[linear-gradient(135deg,_#15FDE4_100%,_#13E5CE_0%)]
  shadow-[inset_-6px_-6px_12px_#1E9E90,_inset_6px_6px_10px_#24FFE7] text-[#121418] px-6 py-3 rounded-full hover:opacity-80 flex justify-between transition-opacity ${fredoka.className} font-medium`}
          >
            Get Started
            <ArrowRight />
          </button>

          <button
            className={`w-75 inset-0 shadow-[inset_0_0_12px_1px_#2F2F2F] cursor-pointer text-white px-6 py-3 rounded-full hover:opacity-80 flex justify-between transition-opacity ${fredoka.className} font-medium`}
          >
            I Already Have An Account
            <HomeIcon />
          </button>
        </div>
      </main>

      <footer className=" text-white w-max text-center">
        <Image
          src={"/footer.svg"}
          width={24}
          height={2}
          alt="Logo"
          className="w-full object-cover absolute top-100"
        />
      </footer>
    </div>
  );
}
