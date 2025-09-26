"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ["websocket"],
    });
  }
  return socket;
}

export function useChatSocket() {
  const [messages, setMessages] = useState<{ text: string }[]>([]);

  useEffect(() => {
    const s = initSocket();

    s.on("connect", () => {
      console.log("✅ Connected to WebSocket:", s.id);
    });

    s.on("message", (msg) => {
      console.log("📨 Message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = (text: string, room = "general") => {
    initSocket().emit("message", { room, message: { text } });
  };

  return { messages, sendMessage };
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
