"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, Chrome } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'react-hot-toast'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName)
        toast.success('Account created successfully!')
      } else {
        await signInWithEmail(email, password)
        toast.success('Signed in successfully!')
      }
      onOpenChange(false)
      setEmail('')
      setPassword('')
      setDisplayName('')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google!')
      onOpenChange(false)
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      if (error.message.includes('popup')) {
        toast.error('Please allow popups and try again')
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled')
      } else {
        toast.error(error.message || 'Failed to sign in with Google')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md brutalist-border-thick brutalist-shadow bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSignUp
              ? 'Create an account to start contributing prompts'
              : 'Sign in to your account to manage prompts'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="displayName" className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4" />
                DISPLAY NAME
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="brutalist-border bg-background"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-bold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              EMAIL
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="brutalist-border bg-background"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-bold flex items-center gap-2">
              <Lock className="h-4 w-4" />
              PASSWORD
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="brutalist-border bg-background"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full brutalist-border brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            disabled={loading}
          >
            {loading ? 'LOADING...' : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full brutalist-border border-t-4" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-bold">OR</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold py-3 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Chrome className="h-4 w-4 mr-2" />
          CONTINUE WITH GOOGLE
        </Button>

        <div className="text-center text-sm">
          {isSignUp ? (
            <>
              <span className="text-muted-foreground">Already have an account?</span>{' '}
              <Button
                variant="link"
                className="p-0 font-bold text-primary hover:text-primary/80"
                onClick={() => setIsSignUp(false)}
              >
                SIGN IN
              </Button>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">Don't have an account?</span>{' '}
              <Button
                variant="link"
                className="p-0 font-bold text-primary hover:text-primary/80"
                onClick={() => setIsSignUp(true)}
              >
                CREATE ACCOUNT
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}