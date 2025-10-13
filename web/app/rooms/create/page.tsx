'use client'

import { ArrowLeft } from 'lucide-react';
import { ArrowRight } from "@/components/icons";
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Header from "@/components/ui/Header";

export default function CreateRoomPage() {
  const router = useRouter()
  const [roomName, setRoomName] = useState('')
  const [duration, setDuration] = useState<'30min' | '1hour' | '2hours' | '4hours'>('1hour')
  const [accessType, setAccessType] = useState<'open' | 'token-gated' | 'invite-only'>('open')

  const handleNext = () => {
    console.log({ roomName, duration, accessType })
  }

  return (
    <section className="mt-14">
      <Header/>
      <div className="bg-[#0a0f1a] text-white">

        <section className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="py-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeft size={24}/>
            </button>
            <h1 className="text-xl font-normal">create new room</h1>
          </div>
          <div className="space-y-12">
            {/* Room Name */}
            <div>
              <label className="block text-light-teal font-fredoka mb-3">room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='e.g. "MaskedParrot88"'
                className="w-full bg-transparent border border-[#1A2221] rounded-2xl px-6 py-3.5 text-italic text-dark-grey placeholder:text-dark-grey placeholder:italic focus:outline-none focus:border-2 focus:border-[#1A2221] transition-colors"
              />
            </div>

            {/* Open For Duration */}
            <div>
              <label className="block text-light-teal font-fredoka mb-3">open for</label>
              <div className="grid grid-cols-4 gap-4">
                {(['30min', '1hour', '2hours', '4hours'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`py-3.5 rounded-xl border border-[#1A2221] transition-colors ${
                      duration === option
                        ? 'bg-dark-teal text-grey-100'
                        : 'bg-transparent text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {option === '30min' && '30 min'}
                    {option === '1hour' && '1 hour'}
                    {option === '2hours' && '2 hours'}
                    {option === '4hours' && '4 hours'}
                  </button>
                ))}
              </div>
            </div>

            {/* Access Type */}
            <div>
              <label className="block text-light-teal font-fredoka mb-3">access</label>
              <div className="space-y-2">
                {(['open', 'token-gated', 'invite-only'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setAccessType(option)}
                    className={`
                    ${option === accessType ? 'bg-dark-teal' : 'bg-[#1A1D22]'}
                    w-full flex items-center justify-between px-6 py-4 
                    rounded-2xl
                    transition-colors group`
                  }
                  >
                  <span className="text-dark-white capitalize">
                    {option === 'open' && 'Open'}
                    {option === 'token-gated' && 'Token-gated'}
                    {option === 'invite-only' && 'Invite-only'}
                  </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-teal-600 flex items-center justify-center transition-all ${
                        accessType === option
                          ? 'border-teal-300 border-2'
                          : 'border-gray-600 group-hover:border-gray-500'
                      }`}
                    >
                      {accessType === option && (
                        <div className="w-5 h-5 rounded-full bg-[#14F1D9]"/>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-16 mb:pb-0 pb-44">
            <button
              onClick={handleNext}
              className="flex items-center font-fredoka gap-3 px-12 py-4 glass-effect__dark text-[#14F1D9] rounded-full hover:bg-[#14F1D9]/10 transition-colors font-medium"
            >
              <span>Next</span>
              <ArrowRight className="text-dark-white w-7 h-7" />
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
