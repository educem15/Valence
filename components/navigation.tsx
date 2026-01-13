"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/types"

interface NavigationProps {
  role?: UserRole
  user?: {
    email: string
    id: string
  }
}

export function Navigation({ role, user }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Public navigation
  if (!user) {
    return (
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            VALENCE
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // Creator navigation
  if (role === "creator") {
    return (
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/creator/dashboard" className="text-2xl font-bold text-primary">
            VALENCE
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/creator/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === "/creator/dashboard"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/creator/auctions"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/creator/auctions")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Auctions
            </Link>
            <Link
              href="/creator/revenue"
              className={`text-sm font-medium transition-colors ${
                pathname === "/creator/revenue"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Revenue
            </Link>
            <Link
              href="/creator/profile"
              className={`text-sm font-medium transition-colors ${
                pathname === "/creator/profile"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Profile
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "..." : "Logout"}
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  // Brand navigation
  if (role === "brand") {
    return (
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/brand/dashboard" className="text-2xl font-bold text-primary">
            VALENCE
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/brand/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === "/brand/dashboard"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/brand/discover"
              className={`text-sm font-medium transition-colors ${
                pathname === "/brand/discover"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Discover
            </Link>
            <Link
              href="/brand/campaigns"
              className={`text-sm font-medium transition-colors ${
                pathname === "/brand/campaigns"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Campaigns
            </Link>
            <Link
              href="/brand/profile"
              className={`text-sm font-medium transition-colors ${
                pathname === "/brand/profile"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Profile
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "..." : "Logout"}
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return null
}
