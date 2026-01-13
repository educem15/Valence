import { createClient } from "@/lib/supabase/server"
import { User, UserRole } from "@/types"

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user profile with role
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!userData) return null

  return userData as User
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  return user?.role || null
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()

  if (user.role !== role) {
    throw new Error("Forbidden: Insufficient permissions")
  }

  return user
}
