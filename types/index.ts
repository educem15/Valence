export type UserRole = "creator" | "brand"

export type AuctionStatus = "draft" | "active" | "closed" | "completed" | "failed"

export type BidStatus = "pending" | "won" | "lost" | "approved" | "rejected"

export type SettlementStatus = "pending" | "escrowed" | "completed"

export type Platform = "instagram" | "tiktok" | "youtube"

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface CreatorProfile {
  id: string
  user_id: string
  display_name: string
  bio: string
  instagram_handle?: string
  tiktok_handle?: string
  follower_count: number
  engagement_rate: number
  categories: string[]
  avatar_url?: string
  reputation_score: number
  created_at: string
}

export interface BrandProfile {
  id: string
  user_id: string
  company_name: string
  industry: string
  website?: string
  logo_url?: string
  budget_range: string
  created_at: string
}

export interface Auction {
  id: string
  creator_id: string
  title: string
  description: string
  platform: Platform
  content_type: string
  delivery_window_start: string
  delivery_window_end: string
  access_slots: number
  entry_price: number
  reserve_price: number
  prohibited_categories: string[]
  status: AuctionStatus
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  creator?: CreatorProfile
  bid_count?: number
  slots_filled?: number
}

export interface Bid {
  id: string
  auction_id: string
  brand_id: string
  bid_amount: number
  entry_fee_paid: boolean
  status: BidStatus
  submitted_at: string
  created_at: string
  brand?: BrandProfile
  auction?: Auction
}

export interface Settlement {
  id: string
  auction_id: string
  winning_bid_id: string
  clearing_price: number
  platform_revenue: number
  creator_revenue: number
  status: SettlementStatus
  created_at: string
  completed_at?: string
  auction?: Auction
  winning_bid?: Bid
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface DashboardStats {
  total_revenue?: number
  active_auctions?: number
  completed_auctions?: number
  average_clearing_price?: number
  total_spent?: number
  active_campaigns?: number
  won_campaigns?: number
  average_roi?: number
}
