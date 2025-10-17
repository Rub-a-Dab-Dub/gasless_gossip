"use client";

import Header from "@/components/ui/Header";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import CreateNewRoom from "@/components/CreateNewRoom";
import React from "react";
import AllRooms from "@/components/room/AllRooms";
import CreatedRooms from "@/components/room/CreatedRooms";

export default function RoomsPage() {
  return (
    <>
      <Header />

      <div className="max-w-7xl pt-32 mx-auto px-4 pt-8 pb-32 text-white">
        <TabGroup>
          <TabList className="flex justify-center text-center mb-4 border-b border-dark-teal">
            <Tab className="data-[selected]:rounded-tl-xl outline-none data-[selected]:bg-emerald-900/15 py-3 data-[selected]:text-light-teal data-[selected]:border-b-4 data-[selected]:border-dark-teal w-full flex justify-center">
              All Rooms
            </Tab>
            <Tab className="data-[selected]:rounded-tr-xl outline-none data-[selected]:bg-emerald-900/15 py-3 data-[selected]:text-light-teal data-[selected]:border-b-4 data-[selected]:border-dark-teal w-full flex justify-center">
              My Rooms
            </Tab>
          </TabList>

          <TabPanels>
            {/* All Rooms Tab */}
            <TabPanel>
              <AllRooms />
            </TabPanel>

            {/* My Rooms Tab */}
            <TabPanel>
              <div className="space-y-6">
                <CreatedRooms />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed px-16 flex flex-col md:flex-row py-4 rounded-l-full bottom-22 -right-10 flex items-center gap-4">
          <CreateNewRoom />
        </div>
      </div>
    </>
  );
}
