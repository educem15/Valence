"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CONTENT_TYPES = [
  "Instagram Post", "Instagram Story", "Instagram Reel",
  "TikTok Video", "YouTube Video", "YouTube Short"
]

const PROHIBITED_CATEGORIES = [
  "Alcohol", "Gambling", "Adult Content", "Tobacco",
  "Pharmaceuticals", "Political", "Cryptocurrency", "MLM"
]

export default function NewAuctionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "instagram" as "instagram" | "tiktok" | "youtube",
    content_type: "",
    delivery_window_start: "",
    delivery_window_end: "",
    access_slots: "10",
    entry_price: "",
    reserve_price: "",
    prohibited_categories: [] as string[],
    auction_duration: "72", // hours
  })

  const handleProhibitedCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      prohibited_categories: prev.prohibited_categories.includes(category)
        ? prev.prohibited_categories.filter(c => c !== category)
        : [...prev.prohibited_categories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get creator profile
      const { data: profile } = await supabase
        .from("creator_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!profile) throw new Error("Creator profile not found")

      // Calculate auction times
      const now = new Date()
      const startTime = now.toISOString()
      const endTime = new Date(now.getTime() + parseInt(formData.auction_duration) * 60 * 60 * 1000).toISOString()

      // Create auction
      const { data: auction, error: insertError } = await supabase
        .from("auctions")
        .insert({
          creator_id: profile.id,
          title: formData.title,
          description: formData.description,
          platform: formData.platform,
          content_type: formData.content_type,
          delivery_window_start: formData.delivery_window_start,
          delivery_window_end: formData.delivery_window_end,
          access_slots: parseInt(formData.access_slots),
          entry_price: parseFloat(formData.entry_price),
          reserve_price: parseFloat(formData.reserve_price),
          prohibited_categories: formData.prohibited_categories,
          status: "active",
          start_time: startTime,
          end_time: endTime,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect to auction detail page
      router.push(`/creator/auctions/${auction.id}`)
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the auction")
    } finally {
      setLoading(false)
    }
  }

  // Calculate recommended reserve based on followers (simplified AI recommendation)
  const calculateRecommendedReserve = () => {
    const entryPrice = parseFloat(formData.entry_price)
    const slots = parseInt(formData.access_slots)
    if (entryPrice && slots) {
      // Simple calculation: entry_price * slots * 2 (brands should bid 2x entry on average)
      return Math.round(entryPrice * slots * 2)
    }
    return null
  }

  const recommendedReserve = calculateRecommendedReserve()

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Auction</h1>
        <p className="text-muted-foreground">
          List your promotional inventory and let brands bid for partnership
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Describe what you're offering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Auction Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Instagram Post - Fashion Brand Partnership"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what brands will get: post specs, deliverables, timeline, audience demographics..."
                rows={5}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  required
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_type">Content Type *</Label>
                <Select
                  id="content_type"
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  required
                >
                  <option value="">Select type</option>
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Window */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Window</CardTitle>
            <CardDescription>
              When will you deliver the content?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_start">Start Date *</Label>
                <Input
                  id="delivery_start"
                  type="date"
                  value={formData.delivery_window_start}
                  onChange={(e) => setFormData({ ...formData, delivery_window_start: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_end">End Date *</Label>
                <Input
                  id="delivery_end"
                  type="date"
                  value={formData.delivery_window_end}
                  onChange={(e) => setFormData({ ...formData, delivery_window_end: e.target.value })}
                  min={formData.delivery_window_start || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Access & Pricing</CardTitle>
            <CardDescription>
              Set your auction parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="access_slots">Access Slots *</Label>
                <Input
                  id="access_slots"
                  type="number"
                  value={formData.access_slots}
                  onChange={(e) => setFormData({ ...formData, access_slots: e.target.value })}
                  min="1"
                  max="100"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How many brands can participate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_price">Entry Price ($) *</Label>
                <Input
                  id="entry_price"
                  type="number"
                  value={formData.entry_price}
                  onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                  min="1"
                  step="1"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Cost to purchase an access slot
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reserve_price">Reserve Price ($) *</Label>
              <Input
                id="reserve_price"
                type="number"
                value={formData.reserve_price}
                onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                min={formData.entry_price || "1"}
                step="1"
                required
              />
              {recommendedReserve && (
                <p className="text-sm text-primary">
                  💡 AI Recommendation: ${recommendedReserve.toLocaleString()}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, reserve_price: recommendedReserve.toString() })}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Use this
                  </button>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum acceptable bid (auction fails if not met)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auction_duration">Auction Duration *</Label>
              <Select
                id="auction_duration"
                value={formData.auction_duration}
                onChange={(e) => setFormData({ ...formData, auction_duration: e.target.value })}
                required
              >
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">72 hours (recommended)</option>
                <option value="96">96 hours</option>
                <option value="168">7 days</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Brand Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Restrictions (Optional)</CardTitle>
            <CardDescription>
              Exclude certain brand categories from bidding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PROHIBITED_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleProhibitedCategoryToggle(category)}
                  className={`p-2 text-sm rounded-lg border-2 transition-all ${
                    formData.prohibited_categories.includes(category)
                      ? "border-destructive bg-destructive/5 font-medium"
                      : "border-border hover:border-destructive/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating auction..." : "Create Auction"}
          </Button>
        </div>
      </form>
    </div>
  )
}
