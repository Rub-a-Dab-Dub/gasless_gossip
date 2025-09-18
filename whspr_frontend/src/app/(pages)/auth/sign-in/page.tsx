"use client";
import React, { useState } from "react";
import { connectWallet, getCurrentNetwork } from "@/app/lib/stellar";

export default function StellarWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);

      const net = await getCurrentNetwork();
      if (net) setNetwork(net.network);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect wallet");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={handleConnect}>🔗 Connect Freighter</button>
        {address && <p>Wallet: {address}</p>}
        {network && <p>Network: {network}</p>}
      </div>
    </div>
  );
}
