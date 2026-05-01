const StatCard = ({ icon: Icon, label, value, sublabel, color = 'primary', className = '' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
  }

  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
          <p className="font-mono text-xl font-semibold text-text truncate">{value}</p>
          {sublabel && (
            <p className="text-xs text-text-muted mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard
