import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export default async function RevenueePage() {
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

  // Get all settlements for this creator
  const { data: settlements } = await supabase
    .from("settlements")
    .select(`
      *,
      auction:auctions(
        title,
        platform,
        content_type
      ),
      winning_bid:bids(
        brand:brand_profiles(company_name)
      )
    `)
    .eq("auction.creator_id", profile.id)
    .order("created_at", { ascending: false })

  // Calculate totals
  const totalRevenue = settlements?.reduce((sum, s) => sum + (s.creator_revenue || 0), 0) || 0
  const completedPayments = settlements?.filter(s => s.status === "completed").length || 0
  const pendingPayments = settlements?.filter(s => s.status === "pending" || s.status === "escrowed").length || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success"
      case "escrowed": return "warning"
      case "pending": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revenue & Payments</h1>
        <p className="text-muted-foreground">
          Track your earnings from completed auctions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Payments</CardDescription>
            <CardTitle className="text-3xl">{completedPayments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payments</CardDescription>
            <CardTitle className="text-3xl">{pendingPayments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settlements List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            All settlements from your auctions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!settlements || settlements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No payments yet. Complete your first auction to start earning!
            </div>
          ) : (
            <div className="space-y-4">
              {settlements.map((settlement) => (
                <div key={settlement.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        {settlement.auction?.title || "Auction"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Brand: {settlement.winning_bid?.brand?.company_name || "Unknown"} •{" "}
                        <span className="capitalize">{settlement.auction?.platform}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(settlement.status) as any}>
                      {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Clearing Price</div>
                      <div className="font-semibold">{formatCurrency(settlement.clearing_price)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Platform Fee</div>
                      <div className="font-semibold">{formatCurrency(settlement.platform_revenue)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Your Revenue</div>
                      <div className="font-semibold text-success">{formatCurrency(settlement.creator_revenue)}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    {settlement.status === "completed" && settlement.completed_at ? (
                      <span>Paid on {formatDateTime(settlement.completed_at)}</span>
                    ) : (
                      <span>Created {formatDateTime(settlement.created_at)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
