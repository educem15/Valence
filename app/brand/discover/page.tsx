import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber, getTimeRemaining, formatTimeRemaining } from "@/lib/utils"

export default async function DiscoverPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Get brand profile
  const { data: profile } = await supabase
    .from("brand_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!profile) redirect("/brand/profile/setup")

  // Fetch active auctions
  const { data: auctions } = await supabase
    .from("auctions")
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Get bid counts
  const auctionIds = auctions?.map(a => a.id) || []
  const { data: bidCounts } = await supabase
    .from("bids")
    .select("auction_id")
    .in("auction_id", auctionIds)

  const bidCountMap = bidCounts?.reduce((acc, bid) => {
    acc[bid.auction_id] = (acc[bid.auction_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Check which auctions the brand has already bid on
  const { data: userBids } = await supabase
    .from("bids")
    .select("auction_id")
    .eq("brand_id", profile.id)

  const userBidMap = new Set(userBids?.map(b => b.auction_id) || [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Creator Auctions</h1>
        <p className="text-muted-foreground">
          Browse active auctions and place your bids
        </p>
      </div>

      {/* Filters - TODO: Implement filtering */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
          All Platforms
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
          Fashion
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
          Beauty
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
          Lifestyle
        </Badge>
      </div>

      {!auctions || auctions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No active auctions</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no active auctions at the moment. Check back soon for new creator opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => {
            const timeRemaining = getTimeRemaining(auction.end_time)
            const hasBid = userBidMap.has(auction.id)
            const bidCount = bidCountMap[auction.id] || 0
            const slotsAvailable = auction.access_slots - bidCount

            return (
              <Link key={auction.id} href={`/brand/auctions/${auction.id}`}>
                <Card className="hover:shadow-medium transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                          {auction.creator?.display_name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="font-semibold">{auction.creator?.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(auction.creator?.follower_count || 0)} followers
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{auction.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {auction.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Platform & Categories */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {auction.platform}
                      </Badge>
                      {auction.creator?.categories?.slice(0, 2).map((cat: string) => (
                        <Badge key={cat} variant="outline">
                          {cat}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">Entry Price</div>
                        <div className="font-bold">{formatCurrency(auction.entry_price)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Reserve</div>
                        <div className="font-bold">{formatCurrency(auction.reserve_price)}</div>
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground">Engagement Rate</div>
                      <div className="font-semibold">{auction.creator?.engagement_rate}%</div>
                    </div>

                    {/* Availability */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Slots Available</span>
                        <span className="font-semibold">{slotsAvailable} / {auction.access_slots}</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${((auction.access_slots - slotsAvailable) / auction.access_slots) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Time Left</span>
                        <span className={`font-semibold ${timeRemaining.total < 86400000 ? "text-warning" : ""}`}>
                          {formatTimeRemaining(timeRemaining)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {hasBid && (
                      <div className="pt-2">
                        <Badge variant="success" className="w-full justify-center">
                          ✓ You've Placed a Bid
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
