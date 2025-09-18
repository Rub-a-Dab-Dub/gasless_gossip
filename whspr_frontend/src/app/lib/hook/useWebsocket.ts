"use client";
import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../websocket";

export default function useWebsocket() {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    const s = connectSocket();
    s.on("connect", () => console.log("ws connected", s.id));
    s.on("message", (m: any) => {
      setMessages((prev) => [...prev, m]);
    });

    s.on("disconnect", () => console.log("ws disconnected"));
    return () => {
      s.off("message");
      s.disconnect();
    };
  }, []);

  return { messages };
}
