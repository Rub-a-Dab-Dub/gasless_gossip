"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/public/logo flsah screen4.json";
import { Fredoka, Baloo_2 } from "next/font/google";
import WelcomeScreen from "@/components/WelcomeScreen";
import { ILogin, ISignup } from "@/types/auth";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import { setToCookie } from "@/lib/cookies";
import { setToLocalStorage } from "@/lib/local-storage";
import { useRouter } from "next/navigation";

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
        <span>Get Started</span>
        <ArrowRight />
      </button>
    </nav>
  );
}

export default function Auth() {
  const router = useRouter();
  const [page, setPage] = useState<string>("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setPage("login");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (username === "" || password === "") {
        toast.error("All fields are required");
        return;
      }
      if (page !== "login" && password !== confirmPassword) {
        toast.error("Password confirmation failed");
        return;
      }
      const url = page === "login" ? "auth/login" : "auth/signup";
      let body: ISignup | ILogin = { username, password };
      if (page !== "login") body = { ...body, email, address };
      const res = await api.post<ApiResponse<{ token: string; user: IUser }>>(
        url,
        body
      );
      if (res.data.error) {
        toast.error(res.data.message);
        return;
      }
      setToCookie("token", res.data.data.token);
      setToLocalStorage("user", JSON.stringify(res.data.data.user));
      if (page === "login") {
        router.push("/");
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while creating account, please try again...");
    } finally {
      setSubmitting(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="">
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow">
          <WelcomeScreen username={username} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-xl w-full space-y-6 rounded-b-4xl pb-30 shadow-[inset_0_0_32px_1px_#0F59513D] flex flex-col items-center">
          <div className="w-64 h-80 relative -top-30">
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
            <div className="w-full flex flex-col space-y-2">
              <h2
                className={`${fredoka.className} text-[#7AF8EB] text-center relative -top-20 font-medium text-4xl`}
              >
                {page === "login" ? "Log In" : "Sign Up"}
              </h2>
              <div className="w-full relative -top-16">
                {page === "login" ? (
                  <>
                    <div className="w-full flex items-center font-normal text-zinc-300">
                      Don't have an account?
                      <span
                        onClick={() => setPage("register")}
                        className="pl-2 cursor-pointer font-bold text-[#7AF8EB]"
                      >
                        Sign up
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full flex items-center font-normal text-zinc-300">
                      Already have an account?
                      <span
                        onClick={() => setPage("login")}
                        className="pl-2 cursor-pointer font-bold text-[#7AF8EB]"
                      >
                        Log in
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <form method="POST" onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="e.g. MaskedParrot85"
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7AF8EB] transition-colors"
              />
            </div>

            {page !== "login" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#7AF8EB] text-sm font-medium mb-2"
                >
                  email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maskedparrot@gmail.com"
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7AF8EB] transition-colors"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-[#7AF8EB] text-sm font-medium mb-2"
              >
                password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
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

            {page !== "login" && (
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
                    placeholder="********"
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
            )}

            <div className="flex justify-end pt-4 mb-10">
              <button
                type="submit"
                disabled={submitting}
                className="flex shadow-[inset_0_0_12px_1px_#2F2F2F] items-center space-x-2 px-6 py-4 rounded-full hover:opacity-80 cursor-pointer transition-colors text-white"
              >
                {submitting ? (
                  <span>Please wait..</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
