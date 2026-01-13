import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function BrandDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Get brand profile
  const { data: profile } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    redirect("/brand/profile/setup")
  }

  // Get bid statistics
  const { data: bids } = await supabase
    .from("bids")
    .select("id, status, bid_amount")
    .eq("brand_id", profile.id)

  const activeBids = bids?.filter(b => b.status === "pending").length || 0
  const wonBids = bids?.filter(b => b.status === "won" || b.status === "approved").length || 0
  const totalSpent = bids?.filter(b => b.status === "approved").reduce((sum, b) => sum + b.bid_amount, 0) || 0
  const totalBids = bids?.length || 0

  // Get recent campaigns
  const { data: recentBids } = await supabase
    .from("bids")
    .select(`
      *,
      auction:auctions(*)
    `)
    .eq("brand_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">
          Here's an overview of your campaigns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalSpent)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              From {wonBids} successful campaign{wonBids !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Bids</CardDescription>
            <CardTitle className="text-3xl">{activeBids}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Awaiting auction results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Won Campaigns</CardDescription>
            <CardTitle className="text-3xl">{wonBids}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Successful partnerships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="text-3xl">
              {totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Auction success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Discover Creators</CardTitle>
            <CardDescription>Find your next brand partnership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/brand/discover" className="block">
              <Button className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Active Auctions
              </Button>
            </Link>
            <Link href="/brand/campaigns" className="block">
              <Button variant="outline" className="w-full">
                View My Campaigns
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Company</span>
              <span className="font-semibold">{profile.company_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Industry</span>
              <span className="font-semibold">{profile.industry}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget Range</span>
              <span className="font-semibold">{profile.budget_range}</span>
            </div>
            <Link href="/brand/profile" className="block pt-2">
              <Button variant="outline" className="w-full" size="sm">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      {recentBids && recentBids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest auction participation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBids.map((bid) => (
                <Link
                  key={bid.id}
                  href={`/brand/auctions/${bid.auction_id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{bid.auction?.title || "Auction"}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {bid.status} • {bid.auction?.platform}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(bid.bid_amount)}</div>
                    <div className="text-sm text-muted-foreground">Your Bid</div>
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
