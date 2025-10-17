'use client'

import {
  Heart,
  MessageCircle,
  Share2,
  EllipsisVertical,
  BoltIcon,
  ZapIcon
} from 'lucide-react';

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react'
import Quest from "@/components/Quest";
import CreatePostDialog from "@/components/post/CreatePostDialog";
import CreateNewRoom from "@/components/CreateNewRoom";
import CreatePostButtons from './post/CreatePostButtons';

export default function HomePage() {
  return (
    <>
      {/* Main Content */}
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        {/* Feed Tabs */}
        <TabGroup>
          <TabList className="flex justify-center text-center gap-8 mb-8 border-b border-dark-teal">
            <Tab className="pb-2 data-selected:text-light-teal fill-white drop-shadow-xl/50 data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">For You</Tab>
            <Tab className="pb-2 data-selected:text-light-teal data-selected:border-b data-selected:border-dark-teal w-full flex justify-center">Following</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Posts Feed */}
              <div className="space-y-6">
                {/* Post 1 */}
                <div className="rounded-3xl p-6 border-1 border-dark-teal-border-color shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-700" />
                      <div>
                        <div className="font-semibold text-dark-white">ChickChatter</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-secondary">
                      <span className="text-xs">2m ago</span>
                      <button className="hover:text-white">
                        <EllipsisVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-light-grey mb-4">
                    Tell me why I just saw SneakyParrot leaving the Secret Room at 3am 😳🔥
                  </p>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-secondary hover:text-red-400">
                      <Heart size={18} />
                      <span className="text-tertiary">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-secondary hover:text-cyan-400">
                      <MessageCircle size={18} />
                      <span className="text-tertiary">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-secondary hover:text-cyan-400">
                      <Share2 size={18} />
                      <span className="text-tertiary">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-secondary hover:text-cyan-400">
                      <ZapIcon size={18} />
                      <span className="text-tertiary">24</span>
                    </button>
                  </div>
                </div>

                {/* Quests Section */}
                <div className="rounded-2xl px-10 py-8 glass-effect__light">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-grey-500 font-fredoka">Quests</h2>
                    <button className="text-sm text-teal-300 hover:underline">View All</button>
                  </div>
                  <ul className="grid grid-cols-2 gap-4">
                    <Quest />
                  </ul>
                </div>
              </div>
            </TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </TabGroup>
      </section>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed md:bg-dark px-16 flex flex-col md:flex-row py-4 rounded-l-full bottom-22 right-0 flex items-center gap-4">
        <CreateNewRoom />
        <CreatePostButtons />
        <button className="hidden md:flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.7806 11.4694C17.8504 11.539 17.9057 11.6217 17.9434 11.7128C17.9812 11.8038 18.0006 11.9014 18.0006 12C18.0006 12.0986 17.9812 12.1962 17.9434 12.2872C17.9057 12.3783 17.8504 12.461 17.7806 12.5306L11.0306 19.2806C10.9609 19.3503 10.8782 19.4056 10.7872 19.4433C10.6961 19.481 10.5985 19.5004 10.5 19.5004C10.4015 19.5004 10.3039 19.481 10.2128 19.4433C10.1218 19.4056 10.0391 19.3503 9.96937 19.2806C9.89969 19.2109 9.84442 19.1282 9.8067 19.0372C9.76899 18.9461 9.74958 18.8485 9.74958 18.75C9.74958 18.6515 9.76899 18.5539 9.8067 18.4628C9.84442 18.3718 9.89969 18.2891 9.96937 18.2194L15.4397 12.75H3C2.80109 12.75 2.61032 12.671 2.46967 12.5303C2.32902 12.3897 2.25 12.1989 2.25 12C2.25 11.8011 2.32902 11.6103 2.46967 11.4697C2.61032 11.329 2.80109 11.25 3 11.25H15.4397L9.96937 5.78062C9.82864 5.63989 9.74958 5.44902 9.74958 5.25C9.74958 5.05098 9.82864 4.86011 9.96937 4.71938C10.1101 4.57864 10.301 4.49958 10.5 4.49958C10.699 4.49958 10.8899 4.57864 11.0306 4.71938L17.7806 11.4694ZM20.25 3C20.0511 3 19.8603 3.07902 19.7197 3.21967C19.579 3.36032 19.5 3.55109 19.5 3.75V20.25C19.5 20.4489 19.579 20.6397 19.7197 20.7803C19.8603 20.921 20.0511 21 20.25 21C20.4489 21 20.6397 20.921 20.7803 20.7803C20.921 20.6397 21 20.4489 21 20.25V3.75C21 3.55109 20.921 3.36032 20.7803 3.21967C20.6397 3.07902 20.4489 3 20.25 3Z"
              fill="#F1F7F6" />
          </svg>
        </button>
      </div>
    </>
  )
}
