import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          About VALENCE
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-12">
            Exchange infrastructure for the $250B+ attention economy
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              VALENCE exists to bring transparent, market-based pricing to creator-brand partnerships.
              We believe that the attention economy deserves the same level of infrastructure sophistication
              as financial markets—transparent pricing, fair market discovery, and creator sovereignty.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Today's creator economy operates on opaque, inefficient pricing mechanisms:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Price Opacity:</strong> Creators and brands negotiate in the dark, leading to information asymmetry and suboptimal deals</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Value Discovery Friction:</strong> No transparent mechanism to discover fair market prices for promotional inventory</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Creator Sovereignty Issues:</strong> Creators often lose control over partnerships once negotiations begin</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Inefficient Matching:</strong> Finding the right brand-creator fit is time-consuming and hit-or-miss</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Solution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VALENCE applies proven auction theory and exchange infrastructure principles to creator partnerships:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  Second-price sealed-bid auctions reveal true market value without
                  game-theoretic manipulation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Market Discovery</h3>
                <p className="text-muted-foreground">
                  Real-time auctions with multiple bidders create efficient price discovery
                  for promotional inventory.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Creator Control</h3>
                <p className="text-muted-foreground">
                  Reserve prices, winner approval, and category restrictions preserve
                  creator sovereignty.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Liquidity Infrastructure</h3>
                <p className="text-muted-foreground">
                  Exchange-grade platform enables future secondary markets for
                  promotional inventory.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Why "VALENCE"?</h2>
            <p className="text-muted-foreground leading-relaxed">
              In chemistry, valence refers to the combining power of an element—its capacity to
              form bonds. Similarly, VALENCE measures and facilitates the bonding capacity between
              creators and brands, creating stable, valuable partnerships through market mechanisms.
            </p>
          </section>

          <section className="mb-12 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-primary mb-6">Market Positioning</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VALENCE is not a social network, CRM tool, or influencer marketplace.
              We are <strong>exchange infrastructure</strong>—purpose-built for the attention economy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Think Stripe for payments, but for creator promotional inventory. We provide the
              rails, mechanisms, and trust layer that enable fair, transparent transactions at scale.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">This MVP</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You're experiencing VALENCE v0.1.0-alpha, our minimum viable product demonstrating:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Core auction mechanics with second-price clearing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Real-time auction updates and bidding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Creator sovereignty features (reserve, approval, restrictions)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Transparent market infrastructure</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Mock escrow and settlement flows</span>
              </li>
            </ul>
          </section>

          <section className="text-center py-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Join the Exchange
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of the future of creator-brand partnerships
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
  )
}
