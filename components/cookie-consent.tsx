"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, X, Settings, Shield } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  advertising: boolean
  functional: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  advertising: false,
  functional: false,
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)
    applyCookieSettings(prefs)
  }

  const acceptAllCookies = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    }
    savePreferences(allAccepted)
  }

  const acceptNecessaryOnly = () => {
    savePreferences(defaultPreferences)
  }

  const applyCookieSettings = (prefs: CookiePreferences) => {
    // Apply cookie settings based on preferences
    if (typeof window !== 'undefined' && window.gtag) {
      // Update Google Analytics consent
      window.gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.advertising ? 'granted' : 'denied',
        'ad_user_data': prefs.advertising ? 'granted' : 'denied',
        'ad_personalization': prefs.advertising ? 'granted' : 'denied',
      })
    }
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!mounted || !showBanner) return null

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t-4 border-primary brutalist-shadow z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="brutalist-border bg-primary text-primary-foreground p-3 brutalist-shadow-sm flex-shrink-0">
                <Cookie className="h-6 w-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold">Cookie Consent</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content.
                  By continuing to use our site, you agree to our use of cookies.
                  <a href="/cookie-policy" className="text-primary hover:underline ml-1">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="ml-4 p-2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!showSettings ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={acceptAllCookies}
                className="brutalist-border brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                Accept All Cookies
              </Button>
              <Button
                onClick={acceptNecessaryOnly}
                variant="outline"
                className="brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold"
              >
                Accept Only Necessary
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                className="brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {/* Cookie Settings */}
              <div className="grid gap-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 border-2 border-border rounded">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Necessary Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for the website to function properly
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-semibold">
                    Required
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 border-2 border-border rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={preferences.analytics}
                      onChange={(e) => updatePreference('analytics', e.target.checked)}
                      className="w-4 h-4 text-primary border-2 border-primary rounded focus:ring-primary"
                    />
                    <div>
                      <label htmlFor="analytics" className="font-semibold cursor-pointer">
                        Analytics Cookies
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how visitors interact with our website
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-center justify-between p-4 border-2 border-border rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="advertising"
                      checked={preferences.advertising}
                      onChange={(e) => updatePreference('advertising', e.target.checked)}
                      className="w-4 h-4 text-primary border-2 border-primary rounded focus:ring-primary"
                    />
                    <div>
                      <label htmlFor="advertising" className="font-semibold cursor-pointer">
                        Advertising Cookies
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Used to display relevant ads and measure campaign effectiveness
                      </p>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 border-2 border-border rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="functional"
                      checked={preferences.functional}
                      onChange={(e) => updatePreference('functional', e.target.checked)}
                      className="w-4 h-4 text-primary border-2 border-primary rounded focus:ring-primary"
                    />
                    <div>
                      <label htmlFor="functional" className="font-semibold cursor-pointer">
                        Functional Cookies
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Enable enhanced functionality and personalization
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => savePreferences(preferences)}
                  className="brutalist-border brutalist-shadow bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="brutalist-border brutalist-shadow bg-background hover:bg-muted font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}