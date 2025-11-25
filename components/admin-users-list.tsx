"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX, Crown, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { adminService } from "@/lib/admin-service"
import { UserProfile } from "@/lib/firestore-service"
import { toast } from "react-hot-toast"

export function AdminUsersList() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (userProfile?.isAdmin) {
      loadUsers()
    }
  }, [userProfile])

  const loadUsers = async () => {
    try {
      const allUsers = await adminService.getAllUsersForAdmin()
      setUsers(allUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (!user) return
    
    // Prevent user from removing their own admin status
    if (userId === user.uid && isCurrentlyAdmin) {
      toast.error('You cannot remove your own admin privileges')
      return
    }

    try {
      if (isCurrentlyAdmin) {
        await adminService.removeAdminRole(userId, user.uid)
        toast.success('Admin privileges removed')
      } else {
        await adminService.assignAdminRole(userId, user.uid)
        toast.success('Admin privileges granted')
      }
      
      await loadUsers() // Reload users
    } catch (error) {
      console.error('Error toggling admin status:', error)
      toast.error('Failed to update user role')
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
        <h3 className="text-xl font-bold mb-2">LOADING USERS...</h3>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        Total users: {users.length}
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-3">
        {users.map((userData) => (
          <div key={userData.uid} className="brutalist-border bg-card p-3 brutalist-shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {userData.isAdmin ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {userData.displayName || 'Anonymous'}
                      {userData.uid === user?.uid && (
                        <span className="text-xs text-muted-foreground ml-2">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{userData.email}</div>
                  </div>
                </div>
                
                <Badge
                  variant={userData.isAdmin ? "default" : "secondary"}
                  className="brutalist-border font-bold text-xs"
                >
                  {userData.isAdmin ? "ADMIN" : "USER"}
                </Badge>
              </div>

              <Button
                size="sm"
                variant={userData.isAdmin ? "destructive" : "default"}
                className="brutalist-border brutalist-shadow-sm p-2"
                onClick={() => handleToggleAdmin(userData.uid, userData.isAdmin)}
                disabled={userData.uid === user?.uid && userData.isAdmin}
              >
                {userData.isAdmin ? (
                  <UserX className="h-3 w-3" />
                ) : (
                  <UserCheck className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="brutalist-border bg-muted p-6 text-center brutalist-shadow-sm">
          <h3 className="text-xl font-bold mb-2">NO USERS FOUND</h3>
          <p className="text-muted-foreground">No users have signed up yet.</p>
        </div>
      )}
    </div>
  )
}