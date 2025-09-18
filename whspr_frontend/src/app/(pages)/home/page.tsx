"use client";
import XPBar from "@/app/components/XPBar";
import GiftAnimation from "@/app/components/GiftAnimation";
import { useEffect, useState } from "react";
import {
  initSocket,
  disconnectSocket,
  useChatSocket,
} from "@/app/lib/websocket";
import api, { getCurrentUser } from "@/app/lib/api";

export default function HomePage() {
  // const [messages, setMessages] = useState<any[]>([]);
  const { messages, sendMessage } = useChatSocket();
  useEffect(() => {
    // const socket = initSocket();
    // socket.on("connect", () => console.log("socket connected", socket.id));
    // socket.on("message", (msg: any) => setMessages((m) => [...m, msg]));
    // socket.emit("join", { room: "general" });
    // fetch user
    getCurrentUser()
      .then((u) => console.log("current user", u))
      .catch(() => {});
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">🏠 Home</h1>
      <XPBar currentXP={40} nextLevelXP={100} />
      <GiftAnimation />
      <div className="bg-gray-800 p-4 rounded-xl">
        <h3 className="font-medium mb-2">Room: #general</h3>
        <div className="space-y-2 max-h-56 overflow-auto">
          <button
            className="px-4 py-2 bg-green-500 rounded"
            onClick={() => sendMessage("Hello from frontend!")}
          >
            Send Test Message
          </button>
          {messages.map((m, i) => (
            <div key={i} className="text-sm text-gray-300">
              {JSON.stringify(m)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
