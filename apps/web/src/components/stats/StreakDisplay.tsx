interface StreakDisplayProps {
  streak: number
  bestStreak: number
  totalSessions: number
  totalMinutes: number
}

export function StreakDisplay({ streak, bestStreak, totalSessions, totalMinutes }: StreakDisplayProps) {
  const totalHours = Math.round(totalMinutes / 60)

  return (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <div className="text-5xl font-bold text-white">{streak}</div>
        <div className="text-sm text-gray-500 mt-1">day streak</div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-white">{bestStreak}</div>
          <div className="text-xs text-gray-500 mt-1">best streak</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-white">{totalSessions}</div>
          <div className="text-xs text-gray-500 mt-1">sessions</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-white">{totalHours}</div>
          <div className="text-xs text-gray-500 mt-1">hours logged</div>
        </div>
      </div>
    </div>
  )
}
