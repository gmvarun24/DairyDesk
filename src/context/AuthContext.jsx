import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { subscribeToAuth, signInWithGoogle, signOut as firebaseSignOut } from '../firebase/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    let unsubscribed = false

    timeoutRef.current = setTimeout(() => {
      if (!unsubscribed && loading) {
        setLoading(false)
      }
    }, 5000)

    const unsubscribe = subscribeToAuth((user) => {
      if (!unsubscribed) {
        setUser(user)
        setLoading(false)
        clearTimeout(timeoutRef.current)
      }
    })

    return () => {
      unsubscribed = true
      unsubscribe()
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const login = async () => {
    const user = await signInWithGoogle()
    return user
  }

  const logout = async () => {
    await firebaseSignOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
