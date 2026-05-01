import { FileText } from 'lucide-react'

const EmptyState = ({ icon: Icon = FileText, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
        <Icon className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
      </div>
      <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p className="text-sm mb-4 max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      {action}
    </div>
  )
}

export default EmptyState
