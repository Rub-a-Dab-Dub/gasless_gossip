"use client";

import { useState } from "react";
import {
  Home,
  MessageCircle,
  ImageIcon,
  Heart,
  Settings,
  Send,
  Mic,
  Paperclip,
  MoreHorizontal,
  Share,
  ThumbsUp,
  X,
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const [showSendFunds, setShowSendFunds] = useState(false);
  const [showRequestFunds, setShowRequestFunds] = useState(false);
  const [showSecretAccess, setShowSecretAccess] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  const topUsers = [
    { name: "Mo", avatar: "/diverse-group.png" },
    { name: "Nami", avatar: "/diverse-group.png" },
    { name: "Celine", avatar: "/diverse-group.png" },
    { name: "Tony", avatar: "/diverse-group.png" },
    { name: "Matthew", avatar: "/diverse-group.png" },
    { name: "Kyedae", avatar: "/diverse-group.png" },
  ];

  const chatMessages = [
    {
      id: 1,
      name: "Sophia Carter",
      message:
        "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "/diverse-woman-portrait.png",
      unread: true,
    },
    {
      id: 2,
      name: "Ethan Parker",
      message: "Can you send me the files? I couldn't find them in the folder.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: true,
    },
    {
      id: 3,
      name: "James Walker",
      message: "Don't forget the deadline is this Friday at 5 PM.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 4,
      name: "Mia Davis",
      message: "It was great catching up earlier! Let's plan something soon.",
      time: "10:24 PM",
      avatar: "/diverse-woman-portrait.png",
      unread: false,
    },
    {
      id: 5,
      name: "Noah Collins",
      message: "I'm on my way now. Should be there in 10 minutes.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 6,
      name: "Johnson Green",
      message:
        "Thanks for the update! I'll review it and get back to you soon.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 7,
      name: "Liam Carter",
      message: "Just sent over the presentation slides. Check your inbox.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 8,
      name: "Benjamin Reed",
      message: "Can you clarify the requirements for the new task?",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 9,
      name: "Oliver Bennett",
      message: "The report is ready. Let me know if any changes are needed.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
    {
      id: 10,
      name: "William Cooper",
      message: "Just sent over the presentation slides. Check your inbox.",
      time: "10:24 PM",
      avatar: "/thoughtful-man.png",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex relative">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0F0F0F] border-r border-[#FFFFFFCC]/30 p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <Image src={"/Layer_1.svg"} alt="logo" width={100} height={100} />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center justify-start bg-[#FF3599] hover:bg-[#FF3599]/80 text-white rounded-full px-4 py-2 border border-[#FFFFFFCC]/50">
            <Home className="mr-3 h-4 w-4" />
            Home
          </button>

          <button className="w-full flex items-center justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-4 py-2">
            <MessageCircle className="mr-3 h-4 w-4" />
            WHSPRs
          </button>

          <button className="w-full flex items-center justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-4 py-2">
            <ImageIcon className="mr-3 h-4 w-4" />
            Meme
          </button>

          <button className="w-full flex items-center justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-4 py-2">
            <Heart className="mr-3 h-4 w-4" />
            Favourites
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          <button className="w-full flex items-center justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-4 py-2">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 p-2">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">X</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Xavoo</p>
              <p className="text-xs text-gray-400 truncate">Owl Reveals</p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top WHSPRs Section */}
        <div className="p-6 border-b border-[#FFFFFFCC]/30">
          <h2 className="text-xl font-semibold mb-4">Top WHSPRs</h2>
          <div className="flex space-x-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xs">{user.name[0]}</span>
                </div>
                <span className="text-xs text-gray-400">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Tabs */}
        <div className="px-6 py-4 border-b border-[#FFFFFFCC]/30">
          <div className="flex space-x-4">
            <button className="bg-[#FF3599] hover:bg-[#FF3599]/80 text-white rounded-full px-6 py-2">
              All Chat
            </button>
            <button className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-6 py-2">
              Unread Chat
            </button>
            <button
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full px-6 py-2"
              onClick={() => setShowSecretAccess(true)}
            >
              Secret Room
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center space-x-4 p-4 hover:bg-gray-800/30 border-b border-[#FFFFFFCC]/10"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xs">{chat.name[0]}</span>
                </div>
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3599] rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-400 truncate mt-1">
                  {chat.message}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {chat.unread && (
                  <div className="w-2 h-2 bg-[#FF3599] rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-[#0F0F0F] border-l border-[#FFFFFFCC]/30 p-4 flex flex-col">
        {/* Featured Post */}
        <div className="mb-6">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src="/Frame_34326.jpg"
              alt="Featured content"
              className="w-full h-32 object-cover"
              width={100}
              height={100}
            />
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">FM</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Created by</p>
              <p className="text-sm font-medium text-white">Floyd Miles</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            Is WHSPR the next best thing
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-400">
              <button className="flex items-center space-x-1 hover:text-white">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-xs">192</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-white">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">192</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-white">
                <Share className="h-4 w-4" />
                <span className="text-xs">192</span>
              </button>
            </div>
            <button className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-1 text-xs">
              Join Room
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 mb-4">
          <div className="bg-[#FF3599] rounded-2xl rounded-bl-sm p-3 ml-8">
            <p className="text-white text-sm">
              Hey! Remember to pay the rent this month!
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">U</span>
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm p-3 max-w-xs">
              <p className="text-white text-sm">Internet money too</p>
              <p className="text-xs text-gray-400 mt-1">Jan 8, 2025, 1:19 AM</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl rounded-bl-sm p-3 ml-8">
            <p className="text-black text-sm">Okay lah!</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 ml-8">
            <div className="w-full h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">U</span>
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">$45.00</span>
              </div>
              <p className="text-xs text-gray-400">Project payment</p>
              <p className="text-xs text-gray-400 mt-1">Jan 8, 2025, 1:19 AM</p>
            </div>
          </div>

          {showFloatingButtons && (
            <div className="space-y-2">
              <button
                className="flex items-center space-x-2 bg-[#FF3599] text-white px-4 py-2 rounded-full text-sm hover:bg-[#FF3599]/80"
                onClick={() => setShowSendFunds(true)}
              >
                <span>🧀</span>
                <span>Send Cheese</span>
              </button>
              <button
                className="flex items-center space-x-2 bg-[#FF3599] text-white px-4 py-2 rounded-full text-sm hover:bg-[#FF3599]/80"
                onClick={() => setShowRequestFunds(true)}
              >
                <span>🧀</span>
                <span>Request Cheese</span>
              </button>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t border-[#FFFFFFCC]/30 pt-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full p-2 border border-[#FFFFFFCC]/30">
            <button
              onClick={() => setShowFloatingButtons(!showFloatingButtons)}
            >
              <Paperclip className="h-5 w-5 text-gray-400 ml-2" />
            </button>
            <input
              placeholder="Type Chat Here..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none px-2"
            />
            <button className="bg-[#FF3599] hover:bg-[#FF3599]/80 rounded-full p-2">
              <Send className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-white rounded-full p-2">
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showSendFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-96 border border-[#FFFFFFCC]/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Send Funds</h2>
              <button onClick={() => setShowSendFunds(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <div className="text-white text-2xl">🪽</div>
              </div>
            </div>

            <p className="text-center text-gray-400 mb-6">
              Transfers are processed instantly
            </p>

            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-4xl text-gray-400">$</span>
                <span className="text-4xl text-white">0.00</span>
              </div>
              <p className="text-center text-gray-400 text-sm">
                Enter the amount you&apos;d like to transfer securely.
              </p>
            </div>

            <div className="mb-6">
              <input
                placeholder="@Xavoo_Doe"
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF3599] pb-2"
              />
            </div>

            <div className="mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-center">Project payment</p>
                <p className="text-gray-500 text-sm text-center mt-1">
                  Add a short message like &apos;Project payment&apos;
                </p>
              </div>
            </div>

            <button className="w-full bg-[#FF3599] hover:bg-[#FF3599]/80 text-white py-3 rounded-full font-medium">
              Send Funds
            </button>
          </div>
        </div>
      )}

      {showRequestFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-96 border border-[#FFFFFFCC]/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Request Funds
              </h2>
              <button onClick={() => setShowRequestFunds(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <div className="text-white text-2xl">🪽</div>
              </div>
            </div>

            <p className="text-center text-gray-400 mb-6">
              Ask for the amount you&apos;d like to receive securely.
            </p>

            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-4xl text-gray-400">$</span>
                <span className="text-4xl text-white">0.00</span>
              </div>
              <p className="text-center text-gray-400 text-sm">
                Enter the amount you&apos;d like to transfer securely.
              </p>
            </div>

            <div className="mb-6">
              <input
                placeholder="@Xavoo_Doe"
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF3599] pb-2"
              />
            </div>

            <div className="mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-center">Project payment</p>
                <p className="text-gray-500 text-sm text-center mt-1">
                  Add a short message like &apos;Project payment&apos;
                </p>
              </div>
            </div>

            <button className="w-full bg-[#FF3599] hover:bg-[#FF3599]/80 text-white py-3 rounded-full font-medium">
              Send Cheese
            </button>
          </div>
        </div>
      )}

      {showSecretAccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 w-96 text-center">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowSecretAccess(false)}>
                <X className="h-6 w-6 text-white hover:text-gray-200" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <div className="text-white text-2xl">🪽</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Not all secrets are for everyone
            </h2>
            <p className="text-white/80 mb-8">
              Request access to unlock this WHSPR.
            </p>

            <button className="w-full bg-white text-purple-600 py-3 rounded-full font-medium hover:bg-gray-100">
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
