"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { adminService, AdminStats as StatsType } from "@/lib/admin-service"

export function AdminStats() {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const { userProfile } = useAuth()

  useEffect(() => {
    if (userProfile?.isAdmin) {
      loadStats()
    }
  }, [userProfile])

  const loadStats = async () => {
    try {
      const adminStats = await adminService.getAdminStats()
      setStats(adminStats)
    } catch (error) {
      console.error('Error loading admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userProfile?.isAdmin) {
    return (
      <div className="brutalist-border bg-muted p-6 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">ACCESS DENIED</h3>
        <p className="text-muted-foreground">Admin privileges required.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="brutalist-border bg-card p-6 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">LOADING STATS...</h3>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="brutalist-border bg-card p-6 text-center brutalist-shadow-sm">
        <h3 className="text-xl font-bold mb-2">NO DATA AVAILABLE</h3>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="brutalist-border bg-primary text-primary-foreground p-4 brutalist-shadow text-center">
        <div className="text-2xl md:text-3xl font-bold">{stats.totalUsers}</div>
        <div className="text-xs md:text-sm font-bold">TOTAL USERS</div>
      </div>

      <div className="brutalist-border bg-accent text-accent-foreground p-4 brutalist-shadow text-center">
        <div className="text-2xl md:text-3xl font-bold">{stats.totalPrompts}</div>
        <div className="text-xs md:text-sm font-bold">TOTAL PROMPTS</div>
      </div>

      <div className="brutalist-border bg-yellow-500 text-white p-4 brutalist-shadow text-center">
        <div className="text-2xl md:text-3xl font-bold">{stats.pendingPrompts}</div>
        <div className="text-xs md:text-sm font-bold">PENDING</div>
      </div>

      <div className="brutalist-border bg-green-600 text-white p-4 brutalist-shadow text-center">
        <div className="text-2xl md:text-3xl font-bold">{stats.approvedPrompts}</div>
        <div className="text-xs md:text-sm font-bold">APPROVED</div>
      </div>

      <div className="brutalist-border bg-red-600 text-white p-4 brutalist-shadow text-center">
        <div className="text-2xl md:text-3xl font-bold">{stats.rejectedPrompts}</div>
        <div className="text-xs md:text-sm font-bold">REJECTED</div>
      </div>
    </div>
  )
}