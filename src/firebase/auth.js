import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from './config'

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export const signOut = async () => {
  await firebaseSignOut(auth)
}

export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export const getCurrentUser = () => auth.currentUser
