import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const getResolvedTheme = (theme) => {
  if (theme === 'dark') return 'dark'
  if (theme === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')
  const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(localStorage.getItem('theme') || 'system'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        setResolvedTheme(getResolvedTheme('system'))
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  useEffect(() => {
    setResolvedTheme(getResolvedTheme(theme))
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
