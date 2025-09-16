"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

    return unsubscribe
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
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
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const refreshUserProfile = async () => {
    if (!user) return
    
    try {
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