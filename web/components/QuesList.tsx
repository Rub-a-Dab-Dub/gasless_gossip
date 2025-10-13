'use client'

import Quest from "@/components/Quest";
import {CopyIcon} from "@/components/icons";

interface Quest {
  id: string
  title: string
  current: number
  total: number
  reward: number
}

interface QuestsListProps {
  quests?: Quest[]
}

export default function QuestsList({ quests = [] }: QuestsListProps) {
  return (
    <div>
      <div className="rounded-tl-3xl rounded-tr-3xl rounded-bl-md rounded-br-md px-8 py-6 glass-effect__light">
        <h2 className="text-4xl font-bold text-center text-[#14F1D9] mb-8">Quests</h2>
        <Quest/>
      </div>
      <div className="p-5 mt-3 grid grid-cols-2 gap-2 rounded-bl-3xl rounded-br-3xl glass-effect__light">

        <div className="space-y-1">
          <div className="flex items-center">
            <span className="text-sm text-dark-white font-semibold">Refer 5 people, earn 20XP</span>
            {/*<button className="text-gray-400 hover:text-white transition-colors">*/}
            {/*  <CopyIcon/>*/}
            {/*</button>*/}
          </div>
          <p className="text-sm text-light-grey tracking-wider mb-2">1/10</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-light-grey tracking-wider mb-2">referral code</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-white font-semibold">gasless3284</span>
            <button className="text-gray-400 hover:text-white transition-colors">
              <CopyIcon/>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
