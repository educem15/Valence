import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VALENCE - Auction-Based Exchange for Creator Promotional Inventory",
  description: "Transparent, auction-based pricing for the attention economy. Where creators meet brands through fair market discovery.",
  keywords: ["creator economy", "auctions", "brand partnerships", "influencer marketing"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
