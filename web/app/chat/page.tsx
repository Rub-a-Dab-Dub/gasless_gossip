"use client"

import { useEffect, useState } from "react"
import {
  Search,
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  StopCircleIcon,
  MessageCircleWarningIcon
} from "lucide-react"
import Header from "@/components/ui/Header";

import Image from "next/image";
import ChatAvatarImage from "@/images/photos/chat-pic.png"
import SendTokenDialog from "@/components/SendTokenDialog";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";

interface Message {
  id: number
  sender: string
  content: string
  time: string
  hasCheck?: boolean
  unread?: boolean
}

interface ChatMessage {
  id: number
  content: string
  time: string
  isUser: boolean
}

const sidebarMessages: Message[] = [
  { id: 1, sender: "Sir Emmy", content: "hey, what's good?", time: "2:24 PM", unread: true },
  { id: 2, sender: "Sir Emmy", content: "hey, what's good?", time: "2:26 PM", unread: true },
  { id: 3, sender: "Sir Emmy", content: "how's work going?", time: "2:54 PM", hasCheck: true },
  { id: 4, sender: "Sir Emmy", content: "how's work going?", time: "2:24 PM", hasCheck: true },
  { id: 5, sender: "John Doe", content: "Let's catch up later", time: "1:15 PM", hasCheck: true },
  { id: 6, sender: "Jane Smith", content: "Thanks for the help!", time: "12:30 PM", hasCheck: true },
]

const chatMessages: ChatMessage[] = [
  {
    id: 0,
    content:
      'YO!!',
    time: "2m ago",
    isUser: true,
  },
  {
    id: 1,
    content:
      'When is the next "Tattle tale room going to be opened? some people are really pumped to join the next one 🤔',
    time: "2m ago",
    isUser: true,
  },
  { id: 2, content: "guyyyyy!! the thing was actually better than i had expected.", time: "7:38 PM", isUser: false },
  { id: 3, content: "I'll open the room again in a few days.", time: "7:38 PM", isUser: false },
  {
    id: 4,
    content: "tell them we'll open the room again soon. Just need to get some things in order first.",
    time: "7:38 PM",
    isUser: false,
  },
]

interface UserSearchResult {
  id: string;
  username: string;
  photo: string;
  title: string;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isSendTokenOpen, setIsSendTokenOpen] = useState(false)
  const [chats, setChats] = useState([]);
  const [userSearch, setUserSearch] = useState<string>("")
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);

  useEffect(() => {
    const getAllChats = async () => {
      const res = await api.get<ApiResponse>("/chats/me");
      if (!res.data.error) {
        setChats(res.data.data)
      }
    }
    getAllChats();
  }, [])
  useEffect(() => {
    if (userSearch.length > 4) {
      const searchUser = async () => {
        const res = await api.get<ApiResponse>(`/users/search?username=${userSearch}`);
        if (!res.data.error) {
          setUserSearchResults(res.data.data)
        }
      }
      searchUser();
    }
  }, [userSearch])
  return (
    <>
      <Header />
      <div className="flex h-screen bg-black mt-28 mb-28 md:mb-0">
        {/* Sidebar - Shows on desktop always, on mobile only when no chat selected */}
        <aside
          className={`${selectedChat === null ? "flex" : "hidden"
            } md:flex w-full md:w-80 h-full bg-black text-white border-r border-teal-500 flex-col`}
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-teal-500/30">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full border-1 border-teal-400 rounded-full bg-teal-900/30 py-3 pr-10 pl-4 text-sm text-light-grey placeholder:text-light-grey outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search
                  size={24}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-light-grey"
                />
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {sidebarMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedChat(msg.id)}
                className="flex items-center gap-3 p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-800/50"
              >
                <span
                  className="inline-block size-10 overflow-hidden rounded-full bg-gray-100 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="size-full text-gray-300 dark:text-gray-600">
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center font-fredoka justify-between">
                    <span className="font-medium text-sm text-white">{msg.sender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.hasCheck && <Check className="w-3 h-3 text-[#7AF8EB] flex-shrink-0" />}
                    <p className="text-sm font-fredoka text-light-grey truncate">{msg.content}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-[#7C837F] ml-auto">{msg.time}</span>
                  {msg.unread && (
                    <span
                      className="inline-flex items-center justify-center self-end rounded-full bg-light-teal text-black w-4 h-4 text-xs font-medium flex-shrink-0">
                      1
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat Section - Shows on desktop always, on mobile only when chat selected */}
        <section
          className={`${selectedChat !== null ? "flex" : "hidden"
            } md:flex flex-1 flex-col min-w-0`}
        >
          {selectedChat ? (<>
            {/* Chat Header */}
            <header className="flex items-center justify-between text-white p-4 border-b border-teal-500 bg-black">
              <div className="flex items-center gap-3">
                <button className="md:hidden" onClick={() => setSelectedChat(null)}>
                  <ArrowLeft className="text-gray-400 w-6 h-6" />
                </button>
                <span
                  className="inline-block size-10 overflow-hidden rounded-full bg-gray-100 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="size-full text-gray-300 dark:text-gray-600">
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-semibold text-sm text-dark-white">AnOsasBabe</h2>
                  <p className="text-xs text-teal-300">online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button>
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
                <button>
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-black">
              <div className="space-y-4">
                {/* Shared Image */}
                <div className="flex justify-end mb-6">
                  <div className="relative group">
                    <div
                      className="w-full max-w-md aspect-video flex items-center justify-center">
                      <Image
                        src={ChatAvatarImage}
                        alt=""
                        className="rounded-lg"
                      />
                    </div>
                    <div className="absolute top-2 -left-10 top-40 transition-opacity">
                      <button
                        type="button"
                        className="rounded-full bg-[#1A2221] p-2 text-white shadow-xs hover:bg-dark-teal"
                      >
                        <svg width="18" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M15.8331 6.76533L10.1187 0.678519C10.0388 0.593342 9.93705 0.535309 9.82621 0.511759C9.71537 0.488209 9.60046 0.5002 9.49602 0.546215C9.39157 0.59223 9.30229 0.670202 9.23945 0.77027C9.17661 0.870339 9.14304 0.988009 9.14299 1.1084V4.17844C7.2901 4.34735 5.24363 5.31363 3.56002 6.83457C1.53284 8.6667 0.270676 11.0276 0.00567097 13.4821C-0.0150382 13.673 0.0212866 13.8659 0.109476 14.0334C0.197665 14.201 0.333225 14.3347 0.496864 14.4154C0.660503 14.4962 0.843883 14.5199 1.02091 14.4832C1.19793 14.4465 1.35958 14.3513 1.48284 14.211C2.26857 13.3201 5.06434 10.5026 9.14299 10.2546V13.282C9.14304 13.4024 9.17661 13.5201 9.23945 13.6202C9.30229 13.7202 9.39157 13.7982 9.49602 13.8442C9.60046 13.8902 9.71537 13.9022 9.82621 13.8787C9.93705 13.8551 10.0388 13.7971 10.1187 13.7119L15.8331 7.6251C15.94 7.51099 16 7.35639 16 7.19521C16 7.03404 15.94 6.87944 15.8331 6.76533ZM10.2859 11.8128V9.62994C10.2859 9.46851 10.2257 9.31369 10.1185 9.19954C10.0113 9.08539 9.86598 9.02126 9.71443 9.02126C7.70868 9.02126 5.75507 9.57896 3.90789 10.6799C2.96712 11.2431 2.09058 11.9202 1.2957 12.6977C1.70999 10.8838 2.7543 9.15897 4.29933 7.76281C5.95793 6.26469 7.98225 5.36917 9.71443 5.36917C9.86598 5.36917 10.0113 5.30504 10.1185 5.19089C10.2257 5.07674 10.2859 4.92192 10.2859 4.76049V2.57837L14.621 7.19521L10.2859 11.8128Z"
                            fill="#D6D8D3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transfer Notification */}
                <div className="flex justify-end items-center space-x-4">
                  <div className="bg-teal-800 text-light-grey border border-dark-teal rounded-2xl px-4 py-2 gap-2">
                    <span className="block flex items-center justify-center text-light-grey gap-2">
                      You transferred <span className="text-teal-300">2</span>
                      <svg width="20" height="20" viewBox="0 0 14 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink">
                        <circle cx="7" cy="7" r="7" fill="url(#pattern0_679_14072)" />
                        <defs>
                          <pattern id="pattern0_679_14072" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlinkHref="#image0_679_14072" transform="scale(0.004)" />
                          </pattern>
                          <image id="image0_679_14072" width="250" height="250" preserveAspectRatio="none"
                            xlinkHref="data:image/png;base64,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" />
                        </defs>
                      </svg>

                      <span className="text-teal-300">BaseEth</span> to Dv_nmd
                    </span>
                    <span className="text-sm text-secondary">2m ago</span>
                  </div>
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 0.25C8.07164 0.25 6.18657 0.821828 4.58319 1.89317C2.97982 2.96451 1.73013 4.48726 0.992179 6.26884C0.254225 8.05042 0.061142 10.0108 0.437348 11.9021C0.813554 13.7934 1.74215 15.5307 3.10571 16.8943C4.46928 18.2579 6.20656 19.1865 8.09787 19.5627C9.98919 19.9389 11.9496 19.7458 13.7312 19.0078C15.5127 18.2699 17.0355 17.0202 18.1068 15.4168C19.1782 13.8134 19.75 11.9284 19.75 10C19.7473 7.41498 18.7192 4.93661 16.8913 3.10872C15.0634 1.28084 12.585 0.25273 10 0.25ZM9.625 4.75C9.84751 4.75 10.065 4.81598 10.25 4.9396C10.435 5.06321 10.5792 5.23891 10.6644 5.44448C10.7495 5.65005 10.7718 5.87625 10.7284 6.09448C10.685 6.31271 10.5778 6.51316 10.4205 6.6705C10.2632 6.82783 10.0627 6.93498 9.84448 6.97838C9.62625 7.02179 9.40005 6.99951 9.19449 6.91436C8.98892 6.82922 8.81322 6.68502 8.6896 6.50002C8.56598 6.31501 8.5 6.0975 8.5 5.875C8.5 5.57663 8.61853 5.29048 8.82951 5.0795C9.04049 4.86853 9.32664 4.75 9.625 4.75ZM10.75 15.25C10.3522 15.25 9.97065 15.092 9.68934 14.8107C9.40804 14.5294 9.25 14.1478 9.25 13.75V10C9.05109 10 8.86033 9.92098 8.71967 9.78033C8.57902 9.63968 8.5 9.44891 8.5 9.25C8.5 9.05109 8.57902 8.86032 8.71967 8.71967C8.86033 8.57902 9.05109 8.5 9.25 8.5C9.64783 8.5 10.0294 8.65804 10.3107 8.93934C10.592 9.22064 10.75 9.60218 10.75 10V13.75C10.9489 13.75 11.1397 13.829 11.2803 13.9697C11.421 14.1103 11.5 14.3011 11.5 14.5C11.5 14.6989 11.421 14.8897 11.2803 15.0303C11.1397 15.171 10.9489 15.25 10.75 15.25Z"
                      fill="#14F1D9" />
                  </svg>
                </div>

                {/* Chat Messages */}
                {chatMessages.map((msg, index) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] ${msg.isUser ? "text-right" : "text-left"}`}>
                      <div
                        className={`px-4 py-3.5 ${msg.isUser ? "bg-teal-800 rounded-tl-2xl rounded-bl-2xl" : "rounded-tr-2xl rounded-br-2xl bg-[#16191E]"
                          }`}
                      >
                        <p className="text-sm text-dark-white">{msg.content}</p>
                        {index > 2 && (
                          <span className="text-xs text-gray-500 mt-1 inline-block">{msg.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800 bg-black">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    placeholder="Whisper..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text-white placeholder:text-white bg-[#16191E] w-full py-2.5 rounded-full pl-4 pr-10 outline-none focus:ring-0"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <button
                  onClick={() => setIsSendTokenOpen(true)}
                  className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-emerald-500" />
                </button>
              </div>
            </div>
          </>) : (<>
            <div className="w-full flex items-center h-[75vh] flex-col justify-center gap-4">
              <MessageCircleWarningIcon size={72} className="text-stone-800" />
              <h3 className="text-xl font-medium text-stone-800">No chat found</h3>
            </div>
          </>)
          }
        </section>
      </div>
      <SendTokenDialog isOpen={isSendTokenOpen} onClose={() => setIsSendTokenOpen(false)} />
    </>
  )
}
