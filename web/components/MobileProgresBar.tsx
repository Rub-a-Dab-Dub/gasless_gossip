import Image from "next/image";

import ChickEggShell from "@/images/photos/chick-shell.png";

export default function MobileProgresBar() {
  const progress = (2 / 3) * 100
  return (
    <div className="relative flex flex-col items-center">
      {/* Progress Ring */}
      <svg className="w-15 h-15 -rotate-90" viewBox="0 0 160 160">
        {/* Background segments */}
        {[0, 1, 2, 3].map((segment) => {
          const circumference = 2 * Math.PI * 70
          const gapSize = 8
          const segmentLength = (circumference - gapSize * 4) / 4
          const offset = segment * (segmentLength + gapSize)

          return (
            <circle
              key={`bg-${segment}`}
              cx="80"
              cy="80"
              r="70"
              stroke="#1a2f2c"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${segmentLength} ${gapSize}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          )
        })}
        {/* Progress segments */}
        {[0, 1, 2, 3].map((segment) => {
          const circumference = 2 * Math.PI * 70
          const gapSize = 8
          const segmentLength = (circumference - gapSize * 4) / 4
          const offset = segment * (segmentLength + gapSize)

          const segmentProgress = Math.max(0, Math.min(25, progress - segment * 25))
          const progressLength = (segmentLength * segmentProgress) / 25

          return (
            <circle
              key={`progress-${segment}`}
              cx="80"
              cy="80"
              r="70"
              stroke="#14F1D9"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${progressLength} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )
        })}
      </svg>

      {/* Level Content */}
      <div className="absolute inset-1 flex items-center justify-center">
        <Image
          src={ChickEggShell}
          alt="Profile Avatar"
          className="w-10"
        />
      </div>

      {/* Progress Text */}
      <span
        className="absolute -bottom-3 inline-flex items-center rounded-md bg-[#0A2321] px-2 py-1 text-xs font-medium text-white inset-ring inset-ring-dark-teal">
        120 xp
      </span>
    </div>
  )
}
