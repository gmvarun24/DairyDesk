import { NavLink, useLocation } from 'react-router-dom'
import { Home, Users, BookOpen, FileText, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/entries', icon: BookOpen, label: 'Entries' },
  { to: '/bills', icon: FileText, label: 'Bills' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const BottomNav = () => {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom z-40 no-print">
      <div className="flex justify-around items-center h-16 max-w-desktop mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
