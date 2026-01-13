import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function CreatorAuctionsPage() {
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

  // Fetch all auctions
  const { data: auctions } = await supabase
    .from("auctions")
    .select(`
      *,
      creator:creator_profiles(display_name, avatar_url)
    `)
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false })

  // Get bid counts for each auction
  const auctionIds = auctions?.map(a => a.id) || []
  const { data: bidCounts } = await supabase
    .from("bids")
    .select("auction_id")
    .in("auction_id", auctionIds)

  const bidCountMap = bidCounts?.reduce((acc, bid) => {
    acc[bid.auction_id] = (acc[bid.auction_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success"
      case "closed": return "warning"
      case "completed": return "default"
      case "failed": return "destructive"
      case "draft": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Auctions</h1>
          <p className="text-muted-foreground">
            Manage your promotional inventory auctions
          </p>
        </div>
        <Link href="/creator/auctions/new">
          <Button size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Auction
          </Button>
        </Link>
      </div>

      {!auctions || auctions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No auctions yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first auction to start monetizing your promotional inventory through transparent, market-based pricing.
            </p>
            <Link href="/creator/auctions/new">
              <Button>Create Your First Auction</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {auctions.map((auction) => (
            <Link key={auction.id} href={`/creator/auctions/${auction.id}`}>
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{auction.title}</CardTitle>
                        <Badge variant={getStatusColor(auction.status) as any}>
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {auction.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Platform</div>
                      <div className="font-semibold capitalize">{auction.platform}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Reserve Price</div>
                      <div className="font-semibold">{formatCurrency(auction.reserve_price)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Entry Price</div>
                      <div className="font-semibold">{formatCurrency(auction.entry_price)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Bids Received</div>
                      <div className="font-semibold">{bidCountMap[auction.id] || 0} / {auction.access_slots}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {auction.status === "active" ? "Ends" : "Ended"}
                      </div>
                      <div className="font-semibold text-sm">
                        {formatDate(auction.end_time)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
