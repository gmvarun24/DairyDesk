import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

const Navbar = ({ title, rightAction }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border no-print">
      <div className="flex items-center justify-between h-14 px-4 max-w-desktop mx-auto">
        <h1 className="font-heading font-semibold text-lg text-text">{title}</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full">
              <WifiOff className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">Offline</span>
            </div>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}

export default Navbar
