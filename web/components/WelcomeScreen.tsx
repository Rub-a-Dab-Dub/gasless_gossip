import { ArrowRight, CircleCheck, Share } from "lucide-react";
import Image from "next/image";
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

interface WelcomeScreenProps {
  username: string;
}

export default function WelcomeScreen({ username }: WelcomeScreenProps) {
  const router = useRouter();
  return (
    <div className="w-222 bg-gradient-to-r from-[#121A19] to-[#121A19] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Success Message */}
      <div className="flex justify-center items-center w-222 h-15 gap-2 bg-[#121A19] shadow-[0_8px_24px_0_#14F1D914] rounded-b-xl px-4 py-2">
        <CircleCheck className="w-5 h-5 fill-[#14F1D9] border-none" />
        <span className="text-white text-sm">
          You&apos;ve successfully created an account
        </span>
      </div>

      <div className="flex flex-col items-center max-w-xl w-222 py-15 px-6">
        <div className="relative mb-8">
          <Image
            src={"/chick.svg"}
            width={150}
            height={150}
            alt="Chick"
            className="relative w-75 h-54 object-contain"
          />
        </div>

        <p
          className={`${fredoka.className} text-2xl font-medium text-[#F1F7F6] mb-2 text-center`}
        >
          Welcome, {username}
        </p>

        <p
          className={`${baloo_2.className} text-sm text-[#A3A9A6] mb-12 text-center max-w-sm`}
        >
          Complete task and earn points (XP)
          <br />
          to grow your pet
        </p>

        <div className="flex items-center gap-4">
          <button className="w-12 h-12 bg-[#121418] hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors shadow-[inset_0_0_12px_1px_#0F5951]">
            <Share className="w-5 h-5 text-white" />
          </button>

          {/* Continue Button */}
          <button
            onClick={() => router.push("/feed")}
            className="w-73 justify-center bg-[linear-gradient(135deg,_#15FDE4_100%,_#13E5CE_0%)]
  shadow-[inset_-6px_-6px_12px_#1E9E90,_inset_6px_6px_10px_#24FFE7] cursor-pointer hover:bg-cyan-500 text-black font-semibold px-12 py-3 rounded-full inline-flex items-center gap-2 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
