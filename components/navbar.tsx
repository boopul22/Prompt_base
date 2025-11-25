"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, User, LogOut, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginDialog } from "@/components/auth/login-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "HOME", href: "/" },
  { name: "CATEGORIES", href: "/#categories" },
  { name: "BLOG", href: "/blog" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, userProfile, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="brutalist-border-thick bg-background brutalist-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg md:text-xl">
            <div className="brutalist-border bg-primary text-primary-foreground p-1.5 md:p-2 brutalist-shadow-sm">
              <Zap className="h-4 w-4 md:h-6 md:w-6" />
            </div>
            <span className="hidden sm:block">VIRAL PROMPTS</span>
            <span className="sm:hidden">VIRAL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  px-3 md:px-4 py-2 font-bold brutalist-border brutalist-shadow-sm text-sm md:text-base
                  transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                  ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-muted"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            {mounted && user ? (
              <>
                <Button
                  asChild
                  className="brutalist-border brutalist-shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 font-bold ml-2 md:ml-4 text-sm md:text-base px-3 md:px-4 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Link href="/add-prompt">CONTRIBUTE</Link>
                </Button>
                
                {userProfile?.isAdmin && (
                  <Button
                    asChild
                    className="brutalist-border brutalist-shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold ml-2 text-sm md:text-base px-3 md:px-4 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <Link href="/admin">ADMIN</Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="brutalist-border brutalist-shadow-sm ml-2 p-2 hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="brutalist-border brutalist-shadow-sm">
                    <div className="px-2 py-1.5 text-sm font-medium border-b">
                      {userProfile?.displayName || user.email}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => setLoginDialogOpen(true)}
                className="brutalist-border brutalist-shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 font-bold ml-2 md:ml-4 text-sm md:text-base px-3 md:px-4 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                SIGN IN
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="brutalist-border bg-background hover:bg-muted p-2"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t-4 border-border">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block px-4 py-2.5 font-bold brutalist-border brutalist-shadow-sm text-sm
                    transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                    ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
              {mounted && user ? (
                <>
                  <Button
                    asChild
                    className="w-full brutalist-border brutalist-shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 font-bold mt-3 text-sm transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/add-prompt">CONTRIBUTE</Link>
                  </Button>
                  
                  {userProfile?.isAdmin && (
                    <Button
                      asChild
                      className="w-full brutalist-border brutalist-shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold mt-2 text-sm transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/admin">ADMIN</Link>
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full brutalist-border brutalist-shadow-sm font-bold mt-2 text-sm transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    SIGN OUT
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setLoginDialogOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full brutalist-border brutalist-shadow-sm bg-accent text-accent-foreground hover:bg-accent/90 font-bold mt-3 text-sm transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  SIGN IN
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {mounted && <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />}
    </nav>
  )
}
