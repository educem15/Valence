import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          How VALENCE Works
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-12">
            VALENCE brings exchange-grade infrastructure to creator-brand partnerships
            through transparent, auction-based pricing mechanisms.
          </p>

          <div className="space-y-12">
            {/* For Creators */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">For Creators</h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Create Your Auction</h3>
                      <p className="text-muted-foreground">
                        List your promotional inventory by defining the platform (Instagram, TikTok, YouTube),
                        content type, delivery window, and set your reserve price with AI recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Set Access Parameters</h3>
                      <p className="text-muted-foreground">
                        Define how many brands can participate (access slots) and the entry price.
                        Optionally exclude certain brand categories (e.g., alcohol, gambling).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Monitor Live Bidding</h3>
                      <p className="text-muted-foreground">
                        Watch in real-time as brands purchase access and submit sealed bids.
                        See bid counts and slot availability, but bid amounts remain private.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Approve Winner</h3>
                      <p className="text-muted-foreground">
                        When the auction closes, review the winning bidder. You have 24 hours to
                        approve or reject the partnership. If approved, funds are escrowed and the campaign begins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* For Brands */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">For Brands</h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Discover Creators</h3>
                      <p className="text-muted-foreground">
                        Browse active auctions and filter by category, follower range, platform, and budget.
                        View detailed creator profiles including engagement rates and historical performance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Purchase Access</h3>
                      <p className="text-muted-foreground">
                        Pay the entry price to secure an access slot. This grants you the right to
                        submit a sealed bid in the auction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Submit Sealed Bid</h3>
                      <p className="text-muted-foreground">
                        Enter your maximum bid amount privately. Your bid remains sealed and invisible
                        to competitors until the auction closes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Win & Launch Campaign</h3>
                      <p className="text-muted-foreground">
                        If you submit the highest bid and meet the reserve price, you'll be notified as the
                        winner. After creator approval, the campaign details are finalized and you begin collaboration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Auction Mechanics */}
            <section className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
              <h2 className="text-3xl font-bold text-primary mb-6">Auction Mechanics</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Second-Price Sealed-Bid (Vickrey Auction)</h3>
                  <p className="text-muted-foreground">
                    VALENCE uses the Vickrey auction mechanism, where the highest bidder wins but pays
                    the second-highest bid amount (or the reserve price, whichever is higher). This encourages
                    truthful bidding and ensures fair market pricing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Reserve Price Protection</h3>
                  <p className="text-muted-foreground">
                    Creators set a minimum acceptable price (reserve). If no bids meet this threshold,
                    the auction fails and no sale occurs. This protects creator value.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Access Slots</h3>
                  <p className="text-muted-foreground">
                    Limited access slots create scarcity and ensure only serious bidders participate.
                    The entry fee compensates creators for their time reviewing bids.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Creator Approval</h3>
                  <p className="text-muted-foreground">
                    Winning a bid doesn't guarantee the partnership. Creators maintain sovereignty by
                    reviewing and approving winners within 24 hours, ensuring brand fit.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Ready to Experience Fair Market Pricing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the exchange and discover transparent, auction-based partnerships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup?role=creator"
                  className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-lg font-semibold"
                >
                  Sign Up as Creator
                </Link>
                <Link
                  href="/signup?role=brand"
                  className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-all text-lg font-semibold"
                >
                  Sign Up as Brand
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
