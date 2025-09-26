"use client";

import { useState } from "react";

export default function GiftAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="text-center">
      <div
        onClick={handleClick}
        className={`text-4xl cursor-pointer transition-transform duration-300 ${
          isAnimating ? "animate-bounce scale-125" : "hover:scale-110"
        }`}
      >
        🎁
      </div>
      {isAnimating && (
        <div className="text-yellow-400 text-sm mt-2 animate-pulse">
          ✨ Gift opened! ✨
        </div>
      )}
    </div>
  );
}
