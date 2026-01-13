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

const CATEGORIES = [
  "Fashion", "Beauty", "Fitness", "Travel", "Food", "Gaming",
  "Tech", "Lifestyle", "Business", "Entertainment", "Education", "Other"
]

export default function CreatorProfileSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    instagram_handle: "",
    tiktok_handle: "",
    follower_count: "",
    engagement_rate: "",
    categories: [] as string[],
  })

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
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

      // Create creator profile
      const { error: insertError } = await supabase
        .from("creator_profiles")
        .insert({
          user_id: user.id,
          display_name: formData.display_name,
          bio: formData.bio,
          instagram_handle: formData.instagram_handle || null,
          tiktok_handle: formData.tiktok_handle || null,
          follower_count: parseInt(formData.follower_count) || 0,
          engagement_rate: parseFloat(formData.engagement_rate) || 0,
          categories: formData.categories,
        })

      if (insertError) throw insertError

      // Redirect to dashboard
      router.push("/creator/dashboard")
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Creator Profile</CardTitle>
          <CardDescription>
            Tell brands about yourself and your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Your name or brand"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell brands about your content and audience..."
                rows={4}
              />
            </div>

            {/* Social Handles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={formData.instagram_handle}
                  onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok Handle</Label>
                <Input
                  id="tiktok"
                  value={formData.tiktok_handle}
                  onChange={(e) => setFormData({ ...formData, tiktok_handle: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>

            {/* Follower Count */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="follower_count">Total Follower Count *</Label>
                <Input
                  id="follower_count"
                  type="number"
                  value={formData.follower_count}
                  onChange={(e) => setFormData({ ...formData, follower_count: e.target.value })}
                  placeholder="100000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engagement_rate">Engagement Rate (%) *</Label>
                <Input
                  id="engagement_rate"
                  type="number"
                  step="0.1"
                  value={formData.engagement_rate}
                  onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                  placeholder="3.5"
                  required
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Content Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`p-2 text-sm rounded-lg border-2 transition-all ${
                      formData.categories.includes(category)
                        ? "border-primary bg-primary/5 font-medium"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {formData.categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select at least one category
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || formData.categories.length === 0}
            >
              {loading ? "Creating profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
