import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Get creator profile
  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    redirect("/creator/profile/setup")
  }

  // Get auction statistics
  const { data: auctions } = await supabase
    .from("auctions")
    .select("id, status, reserve_price")
    .eq("creator_id", profile.id)

  const activeAuctions = auctions?.filter(a => a.status === "active").length || 0
  const completedAuctions = auctions?.filter(a => a.status === "completed").length || 0
  const totalAuctions = auctions?.length || 0

  // Get revenue from completed settlements
  const { data: settlements } = await supabase
    .from("settlements")
    .select(`
      creator_revenue,
      auction:auctions!inner(creator_id)
    `)
    .eq("auction.creator_id", profile.id)
    .eq("status", "completed")

  const totalRevenue = settlements?.reduce((sum, s) => sum + (s.creator_revenue || 0), 0) || 0

  // Get recent auctions
  const { data: recentAuctions } = await supabase
    .from("auctions")
    .select("*")
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.display_name}! 👋</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your auctions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              From {completedAuctions} completed auction{completedAuctions !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Auctions</CardDescription>
            <CardTitle className="text-3xl">{activeAuctions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Currently accepting bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Auctions</CardDescription>
            <CardTitle className="text-3xl">{totalAuctions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All time listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl">
              {totalAuctions > 0 ? Math.round((completedAuctions / totalAuctions) * 100) : 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Auctions meeting reserve
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your next auction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/creator/auctions/new" className="block">
              <Button className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Auction
              </Button>
            </Link>
            <Link href="/creator/auctions" className="block">
              <Button variant="outline" className="w-full">
                View All Auctions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Keep your information up to date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Followers</span>
              <span className="font-semibold">{profile.follower_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Engagement Rate</span>
              <span className="font-semibold">{profile.engagement_rate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reputation</span>
              <span className="font-semibold">{profile.reputation_score}/5.0</span>
            </div>
            <Link href="/creator/profile" className="block pt-2">
              <Button variant="outline" className="w-full" size="sm">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Auctions */}
      {recentAuctions && recentAuctions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Auctions</CardTitle>
            <CardDescription>Your latest listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAuctions.map((auction) => (
                <Link
                  key={auction.id}
                  href={`/creator/auctions/${auction.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{auction.title}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {auction.status} • {auction.platform}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(auction.reserve_price)}</div>
                    <div className="text-sm text-muted-foreground">Reserve</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
