interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export default function XPBar({ currentXP, maxXP, level }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Level {level}</span>
        <span className="text-sm">
          {currentXP}/{maxXP} XP
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          role="progressbar"
          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-300 glow-effect"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
