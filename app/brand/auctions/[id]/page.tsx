"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber, getTimeRemaining, formatTimeRemaining } from "@/lib/utils"
import type { Auction, CreatorProfile, Bid } from "@/types"

export default function BrandAuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [existingBid, setExistingBid] = useState<Bid | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [brandId, setBrandId] = useState<string | null>(null)

  useEffect(() => {
    loadAuction()
  }, [params.id])

  const loadAuction = async () => {
    try {
      const supabase = createClient()

      // Get current user and brand profile
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("brand_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!profile) {
        router.push("/brand/profile/setup")
        return
      }

      setBrandId(profile.id)

      // Fetch auction
      const { data: auctionData, error: auctionError } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", params.id)
        .single()

      if (auctionError) throw auctionError

      // Fetch creator profile
      const { data: creatorData } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("id", auctionData.creator_id)
        .single()

      setAuction(auctionData)
      setCreator(creatorData)

      // Check if brand has already bid
      const { data: bidData } = await supabase
        .from("bids")
        .select("*")
        .eq("auction_id", params.id)
        .eq("brand_id", profile.id)
        .single()

      if (bidData) {
        setExistingBid(bidData)
        setBidAmount(bidData.bid_amount.toString())
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandId || !auction) return

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const amount = parseFloat(bidAmount)

      if (amount < auction.entry_price) {
        throw new Error(`Bid must be at least ${formatCurrency(auction.entry_price)}`)
      }

      if (existingBid) {
        // Update existing bid
        const { error: updateError } = await supabase
          .from("bids")
          .update({ bid_amount: amount })
          .eq("id", existingBid.id)

        if (updateError) throw updateError
      } else {
        // Create new bid
        const { error: insertError } = await supabase
          .from("bids")
          .insert({
            auction_id: auction.id,
            brand_id: brandId,
            bid_amount: amount,
            entry_fee_paid: true, // Mock payment
          })

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/brand/campaigns")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit bid")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!auction || !creator) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Auction not found</h3>
            <Link href="/brand/discover">
              <Button>Back to Discover</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(auction.end_time)
  const isActive = auction.status === "active" && timeRemaining.total > 0

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <Link href="/brand/discover" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Back to Discover
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{auction.title}</h1>
              <Badge variant={isActive ? "success" : "outline"}>
                {isActive ? "Active" : "Closed"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{auction.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creator Profile */}
          <Card>
            <CardHeader>
              <CardTitle>About the Creator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                  {creator.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{creator.display_name}</h3>
                  <p className="text-muted-foreground mb-2">{creator.bio}</p>
                  <div className="flex gap-4 text-sm">
                    {creator.instagram_handle && (
                      <div className="text-muted-foreground">
                        Instagram: <span className="text-foreground">{creator.instagram_handle}</span>
                      </div>
                    )}
                    {creator.tiktok_handle && (
                      <div className="text-muted-foreground">
                        TikTok: <span className="text-foreground">{creator.tiktok_handle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                  <div className="text-xl font-bold">{formatNumber(creator.follower_count)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Engagement</div>
                  <div className="text-xl font-bold">{creator.engagement_rate}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reputation</div>
                  <div className="text-xl font-bold">{creator.reputation_score}/5.0</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {creator.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auction Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
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
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">Delivery Window</div>
                  <div className="font-semibold">
                    {new Date(auction.delivery_window_start).toLocaleDateString()} -{" "}
                    {new Date(auction.delivery_window_end).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {auction.prohibited_categories && auction.prohibited_categories.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Prohibited Brand Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {auction.prohibited_categories.map((cat) => (
                      <Badge key={cat} variant="destructive">{cat}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Bidding */}
        <div className="space-y-6">
          {isActive ? (
            <Card>
              <CardHeader>
                <CardTitle>{existingBid ? "Update Your Bid" : "Place Your Bid"}</CardTitle>
                <CardDescription>
                  Sealed-bid auction - your bid remains private
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bid_amount">Bid Amount ($)</Label>
                    <Input
                      id="bid_amount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={auction.entry_price}
                      step="1"
                      required
                      placeholder={`Min: ${formatCurrency(auction.entry_price)}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: {formatCurrency(auction.entry_price)}
                    </p>
                    {parseFloat(bidAmount) >= auction.reserve_price && (
                      <p className="text-xs text-success font-medium">
                        ✓ Meets reserve price
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-success bg-success/10 border border-success/20 rounded-lg">
                      Bid submitted successfully! Redirecting...
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting || success}>
                    {submitting ? "Submitting..." : existingBid ? "Update Bid" : "Submit Bid"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your bid is sealed and won't be visible to others
                  </p>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Auction Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This auction has ended. Check your campaigns to see if you won.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pricing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Entry Price</div>
                <div className="text-2xl font-bold">{formatCurrency(auction.entry_price)}</div>
              </div>
              <div className="pt-3 border-t">
                <div className="text-sm text-muted-foreground">Reserve Price</div>
                <div className="text-2xl font-bold">{formatCurrency(auction.reserve_price)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum for winning bid
                </p>
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
                  Ends {new Date(auction.end_time).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
