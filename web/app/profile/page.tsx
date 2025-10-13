'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from "@/components/ui/Header";

interface ProfileData {
  username: string
  about: string
  email: string
  avatarUrl?: string
}

export default function ProfilePage() {
  const router = useRouter()

  const profileData: ProfileData = {
    username: 'username',
    about: 'basically a certified talker',
    email: 'username@gmail.com',
    avatarUrl: '/images/avatar-boy.png'
  }

  return (
    <div className="mt-18">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="py-6 flex items-center text-white">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={24}/>
          </button>
          <h1 className="">swap token</h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl p-8 wallet-glass-effect__teal">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left - Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center overflow-hidden">
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<span class="text-8xl">👨</span>'
                    }}
                  />
                ) : (
                  <span className="text-8xl">👨</span>
                )}
              </div>
            </div>

            {/* Right - Profile Info */}
            <div className="flex-1 flex flex-col justify-between min-h-96 py-4">
              {/* Edit Profile Button - Top Right */}
              <div className="flex justify-end mb-8">
                <button className="bg-[#1A1D22] py-3 px-5 rounded-full text-light-teal text-lg font-medium hover:underline">
                  Edit Profile
                </button>
              </div>

              {/* Profile Fields */}
              <div className="space-y-10 flex-1">
                {/* Username */}
                <div>
                  <label className="block font-fredoka text-tertiary mb-3">username</label>
                  <div className="text-lg text-dark-white font-normal">{profileData.username}</div>
                </div>

                {/* About */}
                <div>
                  <label className="block font-fredoka text-tertiary mb-3">about</label>
                  <div className="text-lg text-dark-white font-normal">{profileData.about}</div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-fredoka text-tertiary mb-3">email</label>
                  <div className="text-lg text-dark-white font-normal">{profileData.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
