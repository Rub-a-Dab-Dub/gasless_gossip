"use client";

import {
  ArrowRight,
  Home,
  ChevronDown,
  ChevronUp,
  Twitter,
  Send,
  Github,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Landing() {
  const [openFaqItems, setOpenFaqItems] = useState<Record<string, boolean>>({});

  const toggleFaqItem = (id: string) => {
    setOpenFaqItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 flex items-center min-h-screen px-6 lg:px-12">
        <div className="flex w-full max-w-7xl mx-auto">
          {/* Left Content Area */}
          <div className="flex-1 pr-8">
            <h1 className="text-5xl lg:text-6xl font-medium text-[#F1F7F6] mb-6 leading-tight font-fredoka">
              Header Texts
            </h1>
            <p className="text-lg lg:text-xl text-[#A3A9A6] mb-8 max-w-[402px] leading-relaxed font-fredoka">
              Chat, share secrets, send tokens, and level up in the first
              gamified messaging app built on-chain.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 text-[#121418] px-8 py-4 font-medium transition-all duration-200 font-fredoka"
              style={{
                borderRadius: "32px",
                background: "linear-gradient(135deg, #15FDE4 100%, #13E5CE 0%)",
                boxShadow:
                  "-6px -6px 12px 0 rgba(30, 158, 144, 0.24) inset, 6px 6px 10px 0 rgba(36, 255, 231, 0.80) inset",
              }}>
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Statistics Sidebar */}
          <div
            className="flex flex-col gap-4"
            style={{
              borderRadius: "60px",
              background: "rgba(18, 20, 24, 0.48)",
              boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
              backdropFilter: "blur(10px)",
              padding: "24px",
            }}>
            {/* 19.4k USERS */}
            <div className="">
              <div className="text-2xl bg-[#1C1E22] rounded-full w-20 h-20 flex items-center justify-center font-medium text-white mb-2">
                19.4k
              </div>
              <div className="text-sm text-[#A3A9A6] uppercase text-center tracking-wide">
                Users
              </div>
            </div>

            {/* Connecting line */}
            <div className="w-px h-9 bg-[#1C1E22] mx-auto"></div>

            {/* 8k ROOMS */}
            <div className="">
              <div className="text-2xl bg-[#1C1E22] rounded-full w-20 h-20 flex items-center justify-center font-medium text-white mb-2">
                8k
              </div>
              <div className="text-sm text-[#A3A9A6] uppercase text-center tracking-wide">
                Rooms
              </div>
            </div>

            {/* Connecting line */}
            <div className="w-px h-9 bg-[#1C1E22] mx-auto"></div>

            {/* 4 CHAINS */}
            <div className="">
              <div className="text-2xl bg-[#1C1E22] rounded-full w-20 h-20 flex items-center justify-center font-medium text-white mb-2">
                4
              </div>
              <div className="text-sm text-[#A3A9A6] uppercase text-center tracking-wide">
                Chains
              </div>
            </div>
          </div>
        </div>
        {/* Background pattern at bottom of hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 ">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none">
            {/* Main wave layer - deeper curve */}
            {/* <path
              d="M0,80 Q200,40 400,80 Q600,120 800,80 Q1000,40 1200,80 L1200,160 L0,160 Z"
              fill="rgba(75, 85, 99, 0.25)"
            /> */}
            {/* Secondary wave layer - more prominent */}
            {/* <path
              d="M0,70 Q150,30 350,70 Q550,110 750,70 Q950,30 1200,70 L1200,160 L0,160 Z"
              fill="rgba(75, 85, 99, 0.35)"
            /> */}
            {/* Top wave layer - most visible */}
            {/* <path
              d="M0,60 Q100,20 300,60 Q500,100 700,60 Q900,20 1200,60 L1200,160 L0,160 Z"
              fill="rgba(75, 85, 99, 0.45)"
            /> */}
            {/* Highlight gradient overlay */}
            <defs>
              <linearGradient
                id="waveHighlight"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.02)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,60 Q100,20 300,60 Q500,100 700,60 Q900,20 1200,60 L1200,80 Q900,40 700,80 Q500,120 300,80 Q100,40 0,80 Z"
              fill="url(#waveHighlight)"
            />
          </svg>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Heading */}
              <h2 className="text-4xl lg:text-[40px] font-medium text-white font-fredoka">
                About Us
              </h2>

              {/* Description */}
              <p className=" text-[#A3A9A6] leading-[30px] font-fredoka">
                Whisper is not just another Web3 chat app. It&apos;s where
                gossip meets tokens, secrets meet collectibles, and every
                message pushes you closer to leveling up. We&apos;re turning
                social interaction into a game — fun, chaotic, and rewarding,
                with no gas fees slowing you down.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 text-[#121418] px-8 py-4 font-medium transition-all duration-200 font-fredoka"
                  style={{
                    borderRadius: "32px",
                    background:
                      "linear-gradient(135deg, #15FDE4 100%, #13E5CE 0%)",
                    boxShadow:
                      "-6px -6px 12px 0 #1E9E90 inset, 6px 6px 10px 0 #24FFE7 inset",
                  }}>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 font-fredoka"
                  style={{
                    borderRadius: "32px",
                    background: "var(--bg, #121418)",
                    boxShadow: "0 1px 12px 0 #2F2F2F inset",
                  }}>
                  Join Our Community
                  <Home className="w-5 h-5" />
                </button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
                <div>
                  <div className="text-3xl lg:text-4xl text-white font-fredoka">
                    15x
                  </div>
                  <div className="text-sm mt-2 lg:text-xl text-[#A3A9A6]">
                    Lower Gas Fees
                  </div>
                </div>

                <div>
                  <div className="text-3xl lg:text-4xl text-white font-fredoka">
                    75%
                  </div>
                  <div className="text-sm mt-2 lg:text-xl text-[#A3A9A6]">
                    Reduction in Operational Costs
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="w-full max-w-lg h-80 lg:h-96 rounded-3xl"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ/Features Section */}
      <section className="py-20 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-[40px] font-medium text-white font-fredoka mb-4">
              Crafting the Decentralized Future of Social-Fi
            </h2>
            <p className="text-lg text-[#A3A9A6] font-fredoka">
              Here are some questions we&apos;ve been asked
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Column - Image Placeholder */}
            <div className="lg:col-span-2">
              <div
                className="w-full h-96 lg:h-[500px] rounded-3xl border border-gray-700"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </div>

            {/* Right Column - Interactive Cards */}
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white font-fredoka">
                    Multi-Chain Integrations
                  </h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white font-fredoka">
                    What Industries Benefit From This?
                  </h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white font-fredoka">
                    Token Launch Infrastructure
                  </h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                  <p className="text-sm text-gray-400">
                    What Industries Benefit From This?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Launch App Button */}
          <div className="flex justify-end mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 text-[#121418] px-8 py-4 font-medium transition-all duration-200 font-fredoka"
              style={{
                borderRadius: "32px",
                background: "linear-gradient(135deg, #15FDE4 100%, #13E5CE 0%)",
                boxShadow:
                  "-6px -6px 12px 0 #1E9E90 inset, 6px 6px 10px 0 #24FFE7 inset",
              }}>
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-20 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-[40px] font-medium text-white font-fredoka mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#A3A9A6] font-fredoka">
              Here are some questions we&apos;ve been asked
            </p>
          </div>

          {/* FAQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq1")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  What Industries Benefit From This?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq1"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq1"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  Whisper is designed for anyone who wants to combine social
                  interaction with blockchain technology. From crypto
                  enthusiasts to casual users looking for a fun, gamified
                  messaging experience, our platform serves a wide range of
                  communities.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq2")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  How do I earn tokens on Whisper?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq2"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq2"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  You can earn tokens by actively participating in chats,
                  completing quests, sharing secrets, and engaging with the
                  community. The more you interact, the more you level up and
                  earn rewards.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq3")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  Is Whisper secure and private?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq3"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq3"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  Yes! Whisper is built on blockchain technology, ensuring
                  transparency and security. Your messages and transactions are
                  encrypted, and we prioritize user privacy while maintaining
                  the benefits of decentralization.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq4")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  What chains does Whisper support?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq4"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq4"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  Whisper currently supports 4 major blockchain networks,
                  providing multi-chain compatibility for seamless token
                  transfers and interactions across different ecosystems.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq5")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  Do I need cryptocurrency to start?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq5"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq5"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  No! You can start using Whisper without any initial
                  investment. As you participate and engage with the platform,
                  you&apos;ll earn tokens naturally through your activities and
                  contributions to the community.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFaqItem("faq6")}>
                <h3 className="text-lg font-semibold text-white font-fredoka">
                  What makes Whisper different from other Web3 apps?
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  {openFaqItems["faq6"] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqItems["faq6"] ? "max-h-96 mt-4" : "max-h-0"
                }`}>
                <p className="text-sm text-gray-400">
                  Whisper combines the best of social messaging with blockchain
                  rewards and gamification. With significantly lower gas fees
                  and a focus on fun, engaging interactions, we&apos;re not just
                  another crypto app – we&apos;re building a community-driven
                  social experience.
                </p>
              </div>
            </div>
          </div>

          {/* Launch App Button - Bottom Left */}
          <div className="flex justify-start">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 text-[#121418] px-8 py-4 font-medium transition-all duration-200 font-fredoka"
              style={{
                borderRadius: "32px",
                background: "linear-gradient(135deg, #15FDE4 100%, #13E5CE 0%)",
                boxShadow:
                  "-6px -6px 12px 0 #1E9E90 inset, 6px 6px 10px 0 #24FFE7 inset",
              }}>
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-20 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl lg:text-[40px] font-medium text-white font-fredoka mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-[#A3A9A6] font-fredoka">
              Got a question or feedback? Reach out to us
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div
              className="flex items-center justify-center p-5 rounded-2xl bg-[#121418] border border-gray-800 shadow-inner"
              style={{
                boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
              }}>
              <div
                className="w-[60px] h-[60px] rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </div>

            <div
              className="flex items-center justify-center p-5 rounded-2xl bg-[#121418] border border-gray-800 shadow-inner"
              style={{
                boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
              }}>
              <div
                className="w-[60px] h-[60px] rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </div>

            <div
              className="flex items-center justify-center p-5 rounded-2xl bg-[#121418] border border-gray-800 shadow-inner"
              style={{
                boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
              }}>
              <div
                className="w-[60px] h-[60px] rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative py-16 px-6 lg:px-12 bg-black">
        {/* curved subtle top wave */}
        <div className="absolute -top-10 left-0 right-0 h-16 pointer-events-none select-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none">
            <defs>
              <linearGradient id="footerWave" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 Q300,20 600,60 Q900,100 1200,60 L1200,160 L0,160 Z"
              fill="url(#footerWave)"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          {/* social icons */}
          <div className="flex items-center gap-10">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-full bg-[#121418] border border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors"
                style={{
                  boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
                }}>
                <Twitter className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-xs tracking-widest text-white/70">
                TWITTER
              </span>
            </a>

            <div className="h-10 w-px bg-white/10" />

            {/* Telegram */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-full bg-[#121418] border border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors"
                style={{
                  boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
                }}>
                <Send className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-xs tracking-widest text-white/70">
                TELEGRAM
              </span>
            </a>

            <div className="h-10 w-px bg-white/10" />

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-full bg-[#121418] border border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors"
                style={{
                  boxShadow: "0 0 12px 0 rgba(241, 247, 246, 0.08) inset",
                }}>
                <Github className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-xs tracking-widest text-white/70">
                GITHUB
              </span>
            </a>
          </div>

          <div className="w-full flex items-center justify-between text-[12px] text-white/40">
            <span>© copyright gaslessgossip2025</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-white/70 transition-colors">
                privacy policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white/70 transition-colors">
                terms &amp; conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
