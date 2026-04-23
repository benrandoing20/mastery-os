import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { useStatsStore } from '../../stores/statsStore'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⬡', end: true },
  { to: '/journal', label: 'Journal', icon: '✎', end: false },
  { to: '/graph', label: 'Graph', icon: '◈', end: false },
  { to: '/challenge', label: 'Challenge', icon: '⚡', end: false },
  { to: '/stats', label: 'Stats', icon: '◎', end: false },
]

export function Sidebar() {
  const stats = useStatsStore((s) => s.stats)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 h-screen bg-gray-900 border-r border-gray-800 fixed left-0 top-0 z-20">
        <div className="px-4 py-5 border-b border-gray-800">
          <div className="text-sm font-bold text-white tracking-wide">MASTERY OS</div>
          {stats && (
            <div className="text-xs text-gray-500 mt-1">
              {stats.streak} day streak
            </div>
          )}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                )
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-600">
          v0.1.0
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-gray-900 border-t border-gray-800 flex">
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center py-2 text-xs transition-colors',
                isActive ? 'text-blue-400' : 'text-gray-500'
              )
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
