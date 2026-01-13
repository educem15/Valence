# VALENCE MVP

**Auction-Based Exchange for Creator Promotional Inventory**

## Overview

VALENCE is a minimum viable product demonstrating core auction mechanics, creator sovereignty, and transparent pricing for the attention economy. Built for the $250B+ creator economy, VALENCE provides exchange-grade infrastructure where creators and brands meet through fair market discovery.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js + TypeScript
- **API**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Realtime**: Supabase Realtime for live auction updates
- **Payments**: Stripe Connect (escrow simulation)
- **Blockchain**: Mock implementation (no actual blockchain for MVP)

### Deployment
- **Hosting**: Vercel
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (test mode)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd valence-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase and Stripe credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up the database:

Go to your Supabase project's SQL Editor and run the SQL script in `lib/supabase/schema.sql` to create all tables, indexes, policies, and functions.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                    # Next.js App Router pages and layouts
  /api                  # API route handlers
  /creator              # Creator dashboard pages
  /brand                # Brand dashboard pages
  /auction              # Public auction pages
  globals.css           # Global styles
  layout.tsx            # Root layout
  page.tsx              # Landing page

/components             # Reusable UI components
  /ui                   # shadcn/ui base components

/lib                    # Utility functions and helpers
  /supabase             # Supabase client and helpers
  /validations          # Zod schemas for forms
  auth.ts               # Authentication helpers
  utils.ts              # Common utilities

/types                  # TypeScript type definitions
  index.ts              # Core type definitions

/public                 # Static assets
```

## Key Features

### MVP Included Features
- User authentication (Creator and Brand roles)
- Creator auction creation with reserve pricing
- Sealed-bid auction participation for brands
- Real-time auction updates and countdown
- Second-price (Vickrey) clearing mechanism
- Mock escrow and settlement flow
- Basic creator and brand dashboards
- Performance metrics simulation
- Responsive mobile-first design

### Excluded from MVP
- Actual payment processing (simulated only)
- Secondary market trading
- Social platform API integration
- Advanced analytics and reporting
- Dispute resolution system
- Multi-currency support
- Blockchain settlement
- Mobile native apps

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `users` - User accounts with role (creator/brand)
- `creator_profiles` - Creator profile information
- `brand_profiles` - Brand company information
- `auctions` - Auction listings
- `bids` - Sealed bids from brands
- `settlements` - Auction settlement details
- `notifications` - User notifications

See `lib/supabase/schema.sql` for the complete schema with Row Level Security policies.

## Development Phases

### Phase 1: Foundation (Week 1)
- ✅ Project setup (Next.js, Tailwind, Supabase)
- ✅ Design system implementation
- ✅ Authentication flows
- ✅ Basic navigation and layouts

### Phase 2: Profiles & Auctions (Week 2)
- Creator profile creation and editing
- Auction creation form with validation
- Auction listing and browse pages
- Database schema implementation

### Phase 3: Bidding & Real-time (Week 3)
- Bidding interface and sealed-bid logic
- Real-time auction updates
- Auction closing mechanism
- Winner approval/rejection flow

### Phase 4: Dashboards (Week 4)
- Dashboard implementations
- Performance metrics and charts
- Notification system
- Mobile responsive refinement

### Phase 5: Polish & Deploy (Week 5-6)
- Animations and polish
- Edge case handling
- Seed data creation
- Testing and deployment

## Contributing

This is an MVP project. Contributions are welcome but should align with the MVP scope and design specifications.

## License

Proprietary - VALENCE MVP v0.1.0-alpha

## Support

For questions or issues, please contact the development team.
