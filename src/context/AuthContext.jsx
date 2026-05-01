import { createContext, useContext, useState, useEffect } from 'react'
import { subscribeToAuth, signInWithGoogle, signOut as firebaseSignOut } from '../firebase/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
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
