import Header from "@/components/ui/Header";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import RoomsTab from "@/components/tabs/Rooms";
import React from "react";
import CreateNewRoom from "@/components/CreateNewRoom";

export default function Rooms() {
  return (
    <>
      <Header />

      <div className="max-w-7xl pt-32 mx-auto px-4 py-8 text-white">
        {/* Tabs Section */}
        <TabGroup>
          <TabList className="flex justify-center text-center gap-8 mb-8 border-b border-dark-teal">
            <Tab className="pb-2 data-selected:text-light-teal data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">
              All Rooms
            </Tab>
            <Tab className="pb-2 data-selected:text-light-teal data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">
              My Rooms
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ul className="my-6">
                <span className="inline-flex items-center rounded-xl border-2 border-dark-teal py-2 px-4 text-light-grey">
                Sports
              </span>
              </ul>
              <RoomsTab/>
            </TabPanel>
            <TabPanel>
              <RoomsTab/>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed px-16 flex flex-col md:flex-row py-4 rounded-l-full bottom-22 -right-10 flex items-center gap-4">
          <CreateNewRoom />
        </div>
      </div>
    </>
  )
}
