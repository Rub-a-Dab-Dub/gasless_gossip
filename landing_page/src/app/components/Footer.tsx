import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full  py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-8">
          <div className="md:col-span-2">
            <div className="flex flex-col items-center space-x-3 mb-6">
              <div className="relative w-[240px] h-[240px] mb-2">
                <Image src="/landingpage/footer-logo.png" fill alt="logo" />
              </div>
              <p className="font-bold text-xl text-center bg-gradient-to-r from-[#0B501E] to-[#70DD8D] bg-clip-text text-transparent mb-2">
                Gasless Gossip
              </p>
              <p className="text-primary-green text-center  ">
                The mantra for gasless gossip or some  <br />  nice writing like that
              </p>


            <div className="flex space-x-8 col-span-1 pt-10 ">
              <Link
                href="#"
                className="w-8 h-8 relative  rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Image src="/landingpage/x.svg" alt="Discord" fill />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 relative  flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Image src="/landingpage/discord.svg" alt="Twitter" fill />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 relative  rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Image src="/landingpage/telegram.svg" alt="GitHub" fill />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 relative  rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Image src="/landingpage/github.svg" alt="GitHub" fill />
              </Link>
            </div>
            </div>

          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Gasless Messaging
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Token Tipping
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Real Time Communication
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">How it works</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Connect Wallet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Start Chatting Instantly
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" transition-colors"
                >
                  Tip Friends and Gossip Freely
                </a>
              </li>
            </ul>
          </div>

     
        </div>

        <div className="border-t border-primary-green mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-green text-sm">
            © 2023 Gasless Gossip. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-primary-green transition-colors text-sm"
            >
              Terms and Privacy
            </a>
            <a
              href="#"
              className="text-primary-green transition-colors text-sm"
            >
              Security Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
