import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export default async function CampaignsPage() {
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

  // Fetch all bids with auction details
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      auction:auctions(
        *,
        creator:creator_profiles(*)
      )
    `)
    .eq("brand_id", profile.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "success"
      case "won": return "success"
      case "pending": return "warning"
      case "lost": return "destructive"
      case "rejected": return "destructive"
      default: return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Active Campaign"
      case "won": return "Won - Pending Approval"
      case "pending": return "Bid Pending"
      case "lost": return "Not Selected"
      case "rejected": return "Rejected by Creator"
      default: return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
        <p className="text-muted-foreground">
          Track all your auction bids and active campaigns
        </p>
      </div>

      {!bids || bids.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start bidding on creator auctions to build your campaign portfolio.
            </p>
            <Link href="/brand/discover">
              <Button>Discover Creators</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bids.map((bid) => {
            const auction = bid.auction
            if (!auction) return null

            return (
              <Link key={bid.id} href={`/brand/auctions/${auction.id}`}>
                <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{auction.title}</CardTitle>
                          <Badge variant={getStatusColor(bid.status) as any}>
                            {getStatusText(bid.status)}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                              {auction.creator?.display_name?.charAt(0) || "C"}
                            </div>
                            <span>{auction.creator?.display_name}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="capitalize">{auction.platform}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Your Bid</div>
                        <div className="font-semibold text-lg">{formatCurrency(bid.bid_amount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Reserve Price</div>
                        <div className="font-semibold">{formatCurrency(auction.reserve_price)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Auction Status</div>
                        <div className="font-semibold capitalize">{auction.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Submitted</div>
                        <div className="font-semibold text-sm">
                          {formatDateTime(bid.submitted_at)}
                        </div>
                      </div>
                    </div>

                    {bid.status === "won" && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-success">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">You won this auction! Awaiting creator approval.</span>
                        </div>
                      </div>
                    )}

                    {bid.status === "approved" && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-success">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Campaign approved! Check your email for next steps.</span>
                        </div>
                      </div>
                    )}

                    {bid.status === "rejected" && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Creator declined this partnership.</span>
                        </div>
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
