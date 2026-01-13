import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateTime, getTimeRemaining, formatTimeRemaining } from "@/lib/utils"
import Link from "next/link"

export default async function AuctionDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Get creator profile
  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!profile) redirect("/creator/profile/setup")

  // Fetch auction details
  const { data: auction, error } = await supabase
    .from("auctions")
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .eq("id", params.id)
    .eq("creator_id", profile.id)
    .single()

  if (error || !auction) {
    notFound()
  }

  // Fetch bids (with brand info for completed auctions)
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      brand:brand_profiles(*)
    `)
    .eq("auction_id", auction.id)
    .order("bid_amount", { ascending: false })

  // Fetch settlement if exists
  const { data: settlement } = await supabase
    .from("settlements")
    .select("*")
    .eq("auction_id", auction.id)
    .single()

  const timeRemaining = getTimeRemaining(auction.end_time)
  const isActive = auction.status === "active" && timeRemaining.total > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success"
      case "closed": return "warning"
      case "completed": return "default"
      case "failed": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/creator/auctions" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Back to Auctions
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{auction.title}</h1>
              <Badge variant={getStatusColor(auction.status) as any}>
                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{auction.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Auction Details */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Platform</div>
                  <div className="font-semibold capitalize">{auction.platform}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Content Type</div>
                  <div className="font-semibold">{auction.content_type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Delivery Window</div>
                  <div className="font-semibold text-sm">
                    {new Date(auction.delivery_window_start).toLocaleDateString()} - {new Date(auction.delivery_window_end).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Access Slots</div>
                  <div className="font-semibold">{bids?.length || 0} / {auction.access_slots}</div>
                </div>
              </div>

              {auction.prohibited_categories && auction.prohibited_categories.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Prohibited Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {auction.prohibited_categories.map((cat) => (
                      <Badge key={cat} variant="destructive">{cat}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bids */}
          <Card>
            <CardHeader>
              <CardTitle>Bids Received ({bids?.length || 0})</CardTitle>
              <CardDescription>
                {isActive
                  ? "Bid amounts will be revealed when the auction closes"
                  : auction.status === "closed"
                  ? "Auction has closed - review bids below"
                  : "Final bid results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!bids || bids.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bids yet. Brands are reviewing your auction.
                </div>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-4 rounded-lg border ${
                        bid.status === "won" || bid.status === "approved"
                          ? "border-success bg-success/5"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {bid.brand?.company_name || "Anonymous Brand"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {bid.brand?.industry}
                          </div>
                        </div>
                        <div className="text-right">
                          {!isActive ? (
                            <>
                              <div className="font-bold text-lg">
                                {formatCurrency(bid.bid_amount)}
                              </div>
                              {index === 0 && (
                                <Badge variant="success" className="mt-1">
                                  Highest Bid
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline">Bid Sealed</Badge>
                          )}
                        </div>
                      </div>

                      {auction.status === "closed" && index === 0 && bids[0].bid_amount >= auction.reserve_price && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <p className="text-sm text-muted-foreground">
                            This brand won the auction! Review and approve to finalize the partnership.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              Approve Winner
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settlement Info */}
          {settlement && (
            <Card>
              <CardHeader>
                <CardTitle>Settlement Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clearing Price</span>
                  <span className="font-semibold">{formatCurrency(settlement.clearing_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (10%)</span>
                  <span className="font-semibold">{formatCurrency(settlement.platform_revenue)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Your Revenue</span>
                  <span className="font-bold text-lg text-success">{formatCurrency(settlement.creator_revenue)}</span>
                </div>
                <div className="pt-2">
                  <Badge variant={settlement.status === "completed" ? "success" : "warning"}>
                    {settlement.status === "completed" ? "Payment Completed" : "Payment Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Entry Price</div>
                <div className="text-2xl font-bold">{formatCurrency(auction.entry_price)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Reserve Price</div>
                <div className="text-2xl font-bold">{formatCurrency(auction.reserve_price)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Countdown */}
          {isActive && (
            <Card>
              <CardHeader>
                <CardTitle>Time Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatTimeRemaining(timeRemaining)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Ends {formatDateTime(auction.end_time)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                <div>
                  <div className="font-medium">Started</div>
                  <div className="text-muted-foreground">{formatDateTime(auction.start_time)}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${isActive ? "bg-success animate-pulse" : "bg-muted"}`} />
                <div>
                  <div className="font-medium">{isActive ? "Active Bidding" : "Closed"}</div>
                  <div className="text-muted-foreground">{formatDateTime(auction.end_time)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
