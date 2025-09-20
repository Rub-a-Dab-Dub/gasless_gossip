"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import {
  Heart,
  MessageCircle,
  Send,
  Plus,
  Settings,
  Home,
  Bookmark,
  Pin,
  Users,
  Share,
  Smile,
  MessageCircleMore,
  Bolt,
  PencilLine,
  Camera,
  Mic,
} from "lucide-react";
import { getUserAddress } from "../../lib/stellar";

const WHSPRApp = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeNav, setActiveNav] = useState("home");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [degenMode, setDegenMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "received",
      content: "Hey! Remember to pay",
      time: "10:24 PM",
      color: "bg-pink-500",
      user: "Sophia Carter",
      level: 5,
      xp: 1200,
    },
    {
      id: 2,
      type: "received",
      content: "Internet money too",
      time: "10:25 PM",
      color: "bg-pink-500",
      user: "Alex Johnson",
      level: 3,
      xp: 800,
    },
    {
      id: 3,
      type: "sent",
      content: "Okay lah!",
      time: "10:26 PM",
      color: "bg-white text-black",
      user: "You",
      level: 4,
      xp: 950,
    },
  ]);

  useEffect(() => {
    // Get user Stellar address
    const fetchUserAddress = async () => {
      const address = await getUserAddress();
      setUserAddress(address);
    };
    fetchUserAddress();

    // Connect to backend WebSocket
    const socketConnection = io("http://localhost:3001");
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to chat server");
      // Join current room
      socketConnection.emit("join", { room: currentRoom });
    });

    socketConnection.on("message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            id: Date.now(),
            type: "received",
            content: msg.content,
            time: new Date().toLocaleTimeString(),
            color: "bg-pink-500",
            user: msg.user || "Anonymous",
            level: msg.level || 1,
            xp: msg.xp || 0,
          },
        ];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Join room when currentRoom changes
  useEffect(() => {
    if (socket && socket.connected) {
      socket.emit("join", { room: currentRoom });
    }
  }, [currentRoom, socket]);

  // Update anonymity based on room
  useEffect(() => {
    setIsAnonymous(currentRoom === "secret");
  }, [currentRoom]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const userIdentity = isAnonymous ? "Anonymous" : (userAddress ? userAddress.slice(0, 8) + "..." : "You");
      const msgData = {
        content: message,
        user: userIdentity,
        level: 4, // TODO: get from user data
        xp: 950, // TODO: get from user data
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("message", { room: currentRoom, message: msgData });

      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            id: Date.now(),
            type: "sent",
            content: message,
            time: new Date().toLocaleTimeString(),
            color: "bg-white text-black",
            user: userIdentity,
            level: 4,
            xp: 950,
          },
        ];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
      setMessage("");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "all") {
      setCurrentRoom("general");
    } else if (tab === "secret") {
      setCurrentRoom("secret");
    }
    // For "unread", maybe keep current room or implement unread logic
  };

  const stories = [
    { name: "Me", color: "bg-amber-300", avatar: "👤" },
    { name: "Nami", color: "bg-purple-300", avatar: "👩" },
    { name: "Celline", color: "bg-yellow-200", avatar: "👱‍♀️" },
    { name: "Tony", color: "bg-pink-300", avatar: "👨" },
    { name: "Matthew", color: "bg-purple-300", avatar: "🧑" },
    { name: "Kyedae", color: "bg-pink-200", avatar: "👩‍🦰" },
  ];

  const chats = [
    {
      id: 1,
      name: "Sophia Carter",
      message: "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "bg-purple-200",
      isOnline: true,
      isPinned: true,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 2,
      name: "Alex Johnson",
      message: "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "bg-orange-200",
      isOnline: false,
      isPinned: true,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 3,
      name: "Emma Wilson",
      message: "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "bg-amber-200",
      isOnline: false,
      isPinned: false,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 4,
      name: "Mike Davis",
      message: "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "bg-gray-200",
      isOnline: true,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 5,
      name: "Sarah Brown",
      message: "I had an amazing idea for the project. Let me know if you're free to discuss!",
      time: "10:24 PM",
      avatar: "bg-orange-300",
      isOnline: false,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 6,
      name: "John Smith",
      message: "Hey, are you available for a quick call?",
      time: "9:45 PM",
      avatar: "bg-blue-200",
      isOnline: true,
      isPinned: false,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 7,
      name: "Lisa Chen",
      message: "Thanks for the update!",
      time: "8:30 PM",
      avatar: "bg-green-200",
      isOnline: false,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 8,
      name: "David Kim",
      message: "Let's schedule that meeting for tomorrow.",
      time: "7:15 PM",
      avatar: "bg-red-200",
      isOnline: true,
      isPinned: true,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 9,
      name: "Maria Garcia",
      message: "I sent you the files you requested.",
      time: "6:20 PM",
      avatar: "bg-yellow-300",
      isOnline: false,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 10,
      name: "Tom Wilson",
      message: "Great work on the presentation!",
      time: "5:10 PM",
      avatar: "bg-indigo-200",
      isOnline: true,
      isPinned: false,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 11,
      name: "Anna Lee",
      message: "Can you review this document?",
      time: "4:05 PM",
      avatar: "bg-pink-300",
      isOnline: false,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 12,
      name: "Robert Taylor",
      message: "I'll be out of office next week.",
      time: "3:30 PM",
      avatar: "bg-teal-200",
      isOnline: true,
      isPinned: false,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 13,
      name: "Jessica Brown",
      message: "Happy birthday! 🎉",
      time: "2:45 PM",
      avatar: "bg-cyan-200",
      isOnline: false,
      isPinned: true,
      hasUnread: false,
      unreadIcon: "✓",
    },
    {
      id: 14,
      name: "Michael Johnson",
      message: "Let's catch up soon!",
      time: "1:20 PM",
      avatar: "bg-lime-200",
      isOnline: true,
      isPinned: false,
      hasUnread: true,
      unreadIcon: "●",
    },
    {
      id: 15,
      name: "Emily Davis",
      message: "Thanks for your help!",
      time: "12:15 PM",
      avatar: "bg-rose-200",
      isOnline: false,
      isPinned: false,
      hasUnread: false,
      unreadIcon: "✓",
    },
  ];


  return (
    <div className="flex flex-col sm:flex-row h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-gray-900 flex flex-col">
        {/* Logo and Navigation */}
        <div className="p-4 border-b border-gray-700/50">
          <img
            src="/Layer_1.svg"
            alt="WHSPR Logo"
            className="w-24 h-12 mb-8" // Adjusted to reasonable size
          />

          <nav className="flex flex-col items-center gap-6">
            <a
              href="#"
              className={`flex items-center space-x-4 w-40 p-2 rounded-full cursor-pointer transition-all duration-300 text-center ${
                activeNav === "home"
                  ? "bg-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav("home");
              }}
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-4 w-40 p-2 rounded-full cursor-pointer transition-all duration-300 text-center ${
                activeNav === "whsprs"
                  ? "bg-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav("whsprs");
              }}
            >
              <MessageCircleMore size={20} />
              <span>WHSPRs</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-4 w-40 p-2 rounded-full cursor-pointer transition-all duration-300 text-center ${
                activeNav === "meme"
                  ? "bg-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav("meme");
              }}
            >
              <Smile size={20} />
              <span>Meme</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-4 w-40 p-2 rounded-full cursor-pointer transition-all duration-300 text-center ${
                activeNav === "favourites"
                  ? "bg-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav("favourites");
              }}
            >
              <Heart size={20} />
              <span>Favourites</span>
            </a>
          </nav>
        </div>

        {/* Settings */}
        <div className="p-4 mt-auto border-t border-gray-900">
          <a
            href="#"
            className="flex items-center space-x-4 p-2 text-gray-400 hover:text-white"
            onClick={(e) => e.preventDefault()}
          >
            <Bolt size={20} />
            <span>Settings</span>
          </a>
        </div>

        {/* Profile */}
        <div className="p-2 md:p-4 border-t border-gray-900">
          <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border border-gray-600 rounded-full cursor-pointer hover:bg-gray-700 transition-colors duration-200"
               onClick={() => console.log('Profile clicked')}>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full border-2 border-green-400 relative flex-shrink-0">
              <span className="text-black text-sm md:text-lg flex items-center justify-center h-full">
                👤
              </span>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm md:text-base truncate">
                {userAddress ? userAddress.slice(0, 8) + "..." : "Anonymous"}
              </div>
              <div className="text-gray-400 text-xs md:text-sm truncate">
                {userAddress ? userAddress : "No Stellar wallet connected"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Stories Section */}
        <div className="p-4">
          <h2 className="text-xl font-normal mb-4 text-gray-200">Top WHSPRs</h2>
          <div className="flex space-x-9 justify-center overflow-x-auto">
            {stories.map((story, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 min-w-[60px] cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200">
                <div
                  className={`w-12 h-12 ${story.color} rounded-full flex items-center justify-center text-lg`}
                >
                  {story.avatar}
                </div>
                <span className="text-xs text-white text-center">{story.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="px-6 py-4">
          <div className="flex space-x-9 justify-center">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeTab === "all"
                  ? "bg-pink-500 text-white"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              All Chat
            </button>
            <button
              onClick={() => handleTabChange("unread")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeTab === "unread"
                  ? "bg-pink-500 text-white"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              Unread Chat
            </button>
            <button
              onClick={() => handleTabChange("secret")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeTab === "secret"
                  ? "bg-pink-500 text-white"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              Secret Room
            </button>
          </div>
        </div>

        {/* Degen Mode Toggle */}
        <div className="px-6 py-2 flex justify-center">
          <button
            onClick={() => setDegenMode(!degenMode)}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-2 ${
              degenMode
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Bolt size={14} />
            <span>Degen Mode {degenMode ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center mt-2 pt-4">
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              className="w-full flex justify-center"
            >
              <div className="max-w-md w-full px-4 py-6 border-b border-gray-800 hover:bg-gray-800 cursor-pointer">
                <div className="flex items-center space-x-5 relative">
                  <div className="relative">
                    <div
                      className={`w-11 h-11 ${chat.avatar} rounded-full flex items-center justify-center text-lg`}
                    >
                      👤
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-sm">{chat.name}</h3>
                        <p
                          className={`text-xs mt-1 ${
                            chat.hasUnread ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {chat.message}
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-gray-500 text-xs">{chat.time}</span>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-sm ${
                              chat.hasUnread ? "text-pink-500" : "text-gray-500"
                            }`}
                          >
                            {chat.unreadIcon}
                          </span>
                          {chat.isPinned && (
                            <div className="bg-purple-200 rounded-full p-1.5">
                              <Pin size={10} className="text-blue-600 rotate-45" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <button className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200">
          <PencilLine size={20} className="text-black" />
        </button>
      </div>

      {/* Right Chat Panel */}
      <div className="hidden md:flex w-220 bg-black border-l border-gray-700/50 flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700/50">
          <img
            src="/Frame 34326.jpg"
            alt="Chat Header"
            className="w-full"
          />

          <div className="mt-4 flex items-center space-x-3">
            <div className="w-11 h-11 bg-orange-200 rounded-full"></div>
            <div>
              <div className="text-gray-400 text-xs">Created by</div>
              <div className="text-white font-semibold">Floyd Miles</div>
            </div>
          </div>

          <h3 className="text-white font-medium mt-3 mb-2">
            Is WHSPR the next best thing
          </h3>
          <p className="text-white text-sm opacity-75">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do urna
            erat mauris ...
          </p>

          <div className="flex justify-between items-center mt-4">
            <button className="text-pink-500 text-sm font-medium flex items-center space-x-1 cursor-pointer">
              <span>Read more→</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span className="text-xs">132</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={16} />
                  <span className="text-xs">132</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share size={16} />
                  <span className="text-xs">13</span>
                </div>
              </div>
              <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold cursor-pointer">
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
          {(() => {
            const getAvatarColor = (user: string) => {
              if (user === "Sophia Carter") return "bg-purple-200";
              if (user === "Alex Johnson") return "bg-orange-200";
              if (user === "You") return "bg-white";
              return "bg-gray-200";
            };

            // Group consecutive messages from same user
            interface MessageGroup {
              user: string;
              type: string;
              messages: typeof messages;
              startIndex: number;
            }

            const groupedMessages: MessageGroup[] = [];
            let currentGroup: MessageGroup | null = null;

            messages.forEach((msg, index) => {
              if (!currentGroup || currentGroup.user !== msg.user || currentGroup.type !== msg.type) {
                currentGroup = {
                  user: msg.user,
                  type: msg.type,
                  messages: [msg],
                  startIndex: index
                };
                groupedMessages.push(currentGroup);
              } else {
                currentGroup.messages.push(msg);
              }
            });

            return groupedMessages.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`flex ${group.type === "sent" ? "justify-end animate-slide-in-right" : "justify-start animate-slide-in-left"}`}
              >
                {group.type === "received" && (
                  <div className={`w-8 h-8 ${getAvatarColor(group.user)} rounded-full mr-3 mt-auto flex items-center justify-center text-xs`}>
                    👤
                  </div>
                )}
                <div className="flex flex-col">
                  {group.messages.map((msg, msgIndex) => (
                    <div key={msg.id}>
                      <div className={`chat-bubble ${msgIndex === group.messages.length - 1 ? (group.type === "received" ? "received" : "sent") : ""} max-w-xs px-4 py-2 rounded-lg ${msg.color} animate-bounce-in ${msgIndex > 0 ? 'mt-1' : ''}`}
                        style={{ animationDelay: `${(group.startIndex + msgIndex) * 150}ms` }}>
                        {msgIndex === 0 && (
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{msg.user}</span>
                            <span className="text-xs text-gray-500">Lv.{msg.level} ({msg.xp} XP)</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      {msgIndex === group.messages.length - 1 && (
                        <span className={`text-xs text-gray-500 mt-1 px-2 ${group.type === "sent" ? "text-right" : "text-left"}`}>
                          {msg.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {group.type === "sent" && (
                  <div className={`w-8 h-8 ${getAvatarColor(group.user)} rounded-full ml-3 mt-auto flex items-center justify-center text-xs border-2 border-gray-600`}>
                    👤
                  </div>
                )}
              </div>
            ));
          })()}

        </div>


        {/* Message Input */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-4">
            <button className="text-white text-xl cursor-pointer">+</button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type Chat Here..."
                className="w-full bg-black border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={sendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="text-white p-2 rounded cursor-pointer">
                <Camera size={20} />
              </button>
              <button className="text-white p-2 rounded cursor-pointer">
                <Mic size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WHSPRApp;