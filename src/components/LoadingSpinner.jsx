const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className={`${sizes[size]} border-2 rounded-full animate-spin`} style={{ borderColor: 'var(--border-light)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div className="flex justify-center py-8">
      <div className={`${sizes[size]} border-2 rounded-full animate-spin`} style={{ borderColor: 'var(--border-light)', borderTopColor: 'var(--color-primary)' }} />
    </div>
  )
}

export default LoadingSpinner
