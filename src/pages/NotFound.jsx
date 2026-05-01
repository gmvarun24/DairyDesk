import { useNavigate } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
          <SearchX className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
        </div>
        <h1 className="font-heading text-6xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>404</h1>
        <h2 className="font-heading text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Page Not Found</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default NotFound
