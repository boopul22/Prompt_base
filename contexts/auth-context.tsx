"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type {
  User,
} from 'firebase/auth'
import { getAuthInstance, getFirestoreInstance } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  isAdmin?: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth')
        const { doc, getDoc, setDoc } = await import('firebase/firestore')
        const auth = getAuthInstance()
        const db = getFirestoreInstance()

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user)

          if (user) {
            try {
              // Get user profile from Firestore
              const userDoc = await getDoc(doc(db, 'users', user.uid))
              if (userDoc.exists()) {
                const data = userDoc.data()
                setUserProfile({
                  uid: user.uid,
                  email: user.email!,
                  displayName: data.displayName || user.displayName,
                  bio: data.bio,
                  avatar: data.avatar || user.photoURL, // Use Google avatar as fallback
                  socialMedia: data.socialMedia,
                  isAdmin: data.isAdmin || false,
                  createdAt: data.createdAt?.toDate() || new Date()
                })
              } else {
                // Create user profile if it doesn't exist
                const newProfile: UserProfile = {
                  uid: user.uid,
                  email: user.email!,
                  displayName: user.displayName || undefined,
                  avatar: user.photoURL || undefined, // Automatically get Google avatar
                  isAdmin: false,
                  createdAt: new Date()
                }
                console.log('Creating user profile:', newProfile)
                await setDoc(doc(db, 'users', user.uid), newProfile)
                console.log('User profile created successfully')
                setUserProfile(newProfile)
              }
            } catch (error) {
              console.error('Error handling user profile:', error)
              // Still set a basic profile even if Firestore fails
              setUserProfile({
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || undefined,
                avatar: user.photoURL || undefined, // Include Google avatar in fallback too
                isAdmin: false,
                createdAt: new Date()
              })
            }
          } else {
            setUserProfile(null)
          }

          setLoading(false)
        })
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const auth = getAuthInstance()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const { doc, setDoc } = await import('firebase/firestore')
    const auth = getAuthInstance()
    const db = getFirestoreInstance()

    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName,
      avatar: result.user.photoURL || undefined, // Include Google avatar if available
      isAdmin: false,
      createdAt: new Date()
    }

    await setDoc(doc(db, 'users', result.user.uid), userProfile)
  }

  const signInWithGoogle = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const auth = getAuthInstance()

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      // Handle popup blocked or user cancelled
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.')
      }
      throw error
    }
  }

  const logout = async () => {
    const { signOut } = await import('firebase/auth')
    const auth = getAuthInstance()
    await signOut(auth)
  }

  const refreshUserProfile = async () => {
    if (!user) return

    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const db = getFirestoreInstance()

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: data.displayName,
          bio: data.bio,
          avatar: data.avatar || user.photoURL, // Use Google avatar as fallback
          socialMedia: data.socialMedia,
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt?.toDate() || new Date()
        }
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    refreshUserProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}