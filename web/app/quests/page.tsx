import Header from "@/components/ui/Header";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import RoomsTab from "@/components/tabs/Rooms";
import React from "react";

import QuestsList from "@/components/QuesList";
import Stats from "@/components/Stats";
import LeaderboardPage from "@/components/Leaderboard";

export default function Quests() {
  return (
    <>
      <Header />

      <div className="max-w-5xl py-32 mx-auto px-4 py-8 text-white">
        {/* Tabs Section */}
        <TabGroup>
          <TabList className="flex justify-center text-center gap-8 mb-8 border-b border-dark-teal">
            <Tab className="pb-2 data-selected:text-light-teal data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">
              My Stats
            </Tab>
            <Tab className="pb-2 data-selected:text-light-teal data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">
              Leaderboard
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Stats />
                <QuestsList />
              </div>
            </TabPanel>
            <TabPanel>
              <LeaderboardPage />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </>
  )
}
