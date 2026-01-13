import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            VALENCE
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 tracking-tight">
              The Exchange for
              <span className="block text-secondary">Creator Attention</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transparent, auction-based pricing for creator promotional inventory.
              Fair market discovery for the $250B+ attention economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=creator"
                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                I'm a Creator
              </Link>
              <Link
                href="/signup?role=brand"
                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-all hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                I'm a Brand
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Why VALENCE?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-xl border border-border hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground">
                Second-price sealed-bid auctions reveal true market value. No more guessing or negotiating.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Creator Sovereignty</h3>
              <p className="text-muted-foreground">
                Set reserve prices, approve winners, and maintain full control over your brand partnerships.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Infrastructure</h3>
              <p className="text-muted-foreground">
                Exchange-grade platform built for the attention economy. Real-time, scalable, transparent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Creators List Promotional Inventory</h3>
                <p className="text-muted-foreground">
                  Define your offering (platform, content type, delivery window), set access parameters, and establish your reserve price.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Brands Discover & Purchase Access</h3>
                <p className="text-muted-foreground">
                  Browse auctions, evaluate creator profiles, and purchase access slots to participate in sealed-bid auctions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sealed-Bid Auction Unfolds</h3>
                <p className="text-muted-foreground">
                  Brands submit private bids. When the auction closes, the second-price mechanism determines the winner and clearing price.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Creator Approves & Campaign Begins</h3>
                <p className="text-muted-foreground">
                  Creator reviews the winning bidder and has 24 hours to approve. Once approved, funds are escrowed and the campaign begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Market Opportunity
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">$250B+</div>
              <div className="text-muted-foreground">Global Creator Economy</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">50M+</div>
              <div className="text-muted-foreground">Content Creators Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">$21B</div>
              <div className="text-muted-foreground">Influencer Marketing Spend</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Exchange?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're a creator looking to monetize your influence or a brand seeking authentic partnerships, VALENCE is your marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?role=creator"
              className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all text-lg font-semibold"
            >
              Sign Up as Creator
            </Link>
            <Link
              href="/signup?role=brand"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all text-lg font-semibold"
            >
              Sign Up as Brand
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold mb-2">VALENCE</div>
              <div className="text-sm text-gray-400">
                Exchange infrastructure for the attention economy
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2026 VALENCE. All rights reserved. MVP v0.1.0-alpha
          </div>
        </div>
      </footer>
    </div>
  )
}
