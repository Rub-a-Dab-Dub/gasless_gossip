'use client'

import { Star, Trophy } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  avatar?: string
}

export default function LeaderboardPage() {
  const topThree: LeaderboardEntry[] = [
    { rank: 3, username: 'Mikkey', xp: 387 },
    { rank: 1, username: 'Mikkey', xp: 700 },
    { rank: 2, username: 'Mikkey', xp: 562 }
  ]

  const userScore = 20

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-[#14F1D9] to-[#A0F9F1]'
      case 2:
        return 'from-[#9914F1] to-[#C977FF]'
      case 3:
        return 'from-[#F18214] to-[#FFAC5A]'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getBorderColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-[#0E9186]'
      case 2:
        return 'border-[#7511B8]'
      case 3:
        return 'border-[#BB620B]'
      default:
        return 'border-gray-400'
    }
  }

  const getPodiumRotation = (rank: number) => {
    switch (rank) {
      case 2:
        return 'md:rotate-5'
      case 3:
        return 'md:-rotate-5'
      default:
        return 'rotate-0'
    }
  }

  return (
    <div className="md:pb-0 pb-52">
      <div className="grid grid-cols-3 gap-4 mb-8 md:hidden">
        <button
          className="py-4 flex-1 bg-dark-teal text-[#14F1D9] rounded-full font-semibold hover:from-[#0f5f57] hover:to-[#0c4a42] transition-all">
          Today
        </button>
        <button
          className="py-4 border border-dark-teal bg-transparent text-grey-100 rounded-full font-semibold hover:text-white transition-all">
          Week
        </button>
        <button
          className="py-4 border border-dark-teal bg-transparent text-grey-100 rounded-full font-semibold hover:text-white transition-all">
          Month
        </button>
      </div>
      <section className="glass-effect p-6 rounded-3xl w-fit">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-16 text-[#14F1D9]">
          Leaderboard
        </h1>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {topThree.map((entry) => (
            <div key={entry.rank} className={`${getPodiumRotation(entry.rank)} hover:rotate-0 transition-all`}>
              <div className="space-y-1.5 text-center">
                <div className="flex justify-center">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="inline-block size-12 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10"
                  />
                </div>
                <div className="text-sm font-medium mb-3">{entry.username}</div>
              </div>

              {/* Podium Card */}
              <div
                className={`bg-gradient-to-br ${getPodiumColor(entry.rank)} rounded-3xl flex flex-col justify-between relative overflow-hidden`}
                style={{
                  backgroundImage: `url(/checker.png)`,
                }}
              >

                <div className={`h-fit mt-18 bg-gradient-to-br ${getPodiumColor(entry.rank)} rounded-3xl`}>
                  {/* XP Bar */}
                  <div className="relative z-10 px-4 py-6">
                    <div className={`bg-black/30 backdrop-blur-sm rounded-full px-6 border-4 ${getBorderColor(entry.rank)} text-center`}>
                      <span className="font-bold text-white">{entry.xp} XP</span>
                    </div>
                  </div>

                  {/* Trophy Icon (only for #1) */}
                  {entry.rank === 1 && (
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Trophy size={48} className="text-white/20"/>
                    </div>
                  )}

                  {/* Rank */}
                  <div className="relative z-10 text-center pb-5">
                    <div
                      className={`font-bold ${entry.rank === 1 ? 'text-[#0a5f57]' : entry.rank === 2 ? 'text-[#5a1570]' : 'text-[#8b5617]'}`}>
                      #{entry.rank}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Filter Tabs */}
        <div className="md:flex items-center justify-center gap-4 hidden mb-8 px-24">
          <button
            className="px-32 py-4 flex-1 bg-dark-teal text-[#14F1D9] rounded-full font-semibold hover:from-[#0f5f57] hover:to-[#0c4a42] transition-all">
            Today
          </button>
          <button
            className="px-12 py-4 border border-dark-teal bg-transparent text-grey-100 rounded-full font-semibold hover:text-white transition-all">
            Week
          </button>
          <button
            className="px-12 py-4 border border-dark-teal bg-transparent text-grey-100 rounded-full font-semibold hover:text-white transition-all">
            Month
          </button>
        </div>

        {/* User Score Card */}
        <div className="md:relative md:-bottom-0 absolute -bottom-56 border border-[#14F1D9]/20 rounded-3xl p-8 bg-teal-800">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Star size={32} className="text-[#14F1D9] fill-[#14F1D9]"/>
            <h2 className="text-3xl font-bold">
              Your Score: <span className="text-[#14F1D9]">{userScore} XP</span>
            </h2>
          </div>
          <p className="text-center text-gray-300 text-lg">
            A Few more points will get you to the top.
          </p>
          <p className="text-center text-gray-300 text-lg font-semibold">
            KEEP IT UP!
          </p>
        </div>
      </section>
    </div>
  )
}
