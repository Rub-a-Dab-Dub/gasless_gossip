import Header from "@/components/ui/Header";
import Image from "next/image";
import Avatar from "@/images/photos/avatar.png";
import ArrowRightIcon from "@/images/logos/arrow-right.svg";
import { ArrowRight } from "@/components/icons";

import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import RoomsTab from "@/components/tabs/Rooms";
import NftsTab from "@/components/tabs/Nfts";
import React from "react";
import Quest from "@/components/Quest";
import Link from "next/link";
import CreatePostDialog from "@/components/CreatePostDialog";

export default function Me() {
  return (
    <>
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl pt-32 mx-auto px-4 py-8 text-white">
        {/* Profile Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          {/* Left Side - Profile Info */}
          <div className="flex items-center gap-6">
            <div>
              <Image src={Avatar} alt="" className=""/>
              <div className="text-sm text-center text-dark-white mt-2">username</div>
            </div>

            {/* Stats and Bio */}
            <div>
              <div className="flex gap-6 mb-3">
                <div>
                  <div className="text-sm text-tertiary uppercase tracking-wide mb-1">Posts</div>
                  <div className="text-2xl font-fredoka font-semibold">0</div>
                </div>
                <div>
                  <div className="text-sm text-tertiary uppercase tracking-wide mb-1">Followers</div>
                  <div className="text-2xl font-fredoka font-semibold">0</div>
                </div>
                <div>
                  <div className="text-sm text-tertiary uppercase tracking-wide mb-1">Following</div>
                  <div className="text-2xl font-fredoka font-semibold">0</div>
                </div>
              </div>
              <div className="text-grey-100 text-sm space-y-0.5">
                <div>artist.</div>
                <div>amebo pro</div>
                <div>max</div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-col gap-3 w-full lg:w-64">
            <Link href="/wallet"
                  className="px-6 py-3 bg-transparent border-2 border-light-teal text-light-teal rounded-full hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 font-medium">
              View Wallet
              <Image src={ArrowRightIcon} alt="" className=""/>
            </Link>
            <button
              className="px-6 py-3 bg-[#1A1D22] text-gray-300 rounded-full hover:bg-[#1A1D22]/70 transition-colors font-medium">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quests Section */}
        <div className="rounded-2xl px-10 py-8 glass-effect__light mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-grey-500 font-fredoka">Quests</h2>
            <button className="text-sm text-teal-300 hover:underline">View All</button>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            <Quest/>
          </ul>
        </div>

        {/* Tabs Section */}
        <TabGroup>
          <TabList className="flex justify-center text-center gap-8 mb-6 border-b border-dark-teal">
            <Tab
              className="pb-2 data-selected:text-dark-white text-light-grey data-selected:border-b data-selected:border-teal-300 w-full flex justify-center">
              Posts
            </Tab>
            <Tab
              className="pb-2 data-selected:text-dark-white text-light-grey data-selected:border-b data-selected:border-teal-300 w-full flex justify-center">
              Rooms
            </Tab>
            <Tab
              className="pb-2 data-selected:text-dark-white text-light-grey data-selected:border-b data-selected:border-teal-300 w-full flex justify-center">
              NFTS
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-20 border-1 border-teal-border rounded-xl">
                <h3 className="text-base font-semibold mb-2 text-dark-white">No post has been made yet</h3>
                <p className="text-light-grey mb-8">Create your first post to get started</p>
                <CreatePostDialog />
              </div>
            </TabPanel>
            <TabPanel className="max-w-full">
              <RoomsTab/>
            </TabPanel>
            <TabPanel className="mb-22">
              <NftsTab/>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-500 transition-colors">
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </>
  )
}
