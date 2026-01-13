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

## 🚀 Quick Start

**⚡ Ready to test the MVP? See the [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete step-by-step instructions!**

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works!)

### Installation (5 Minutes)

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials (see [TESTING_GUIDE.md](TESTING_GUIDE.md) for details):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Set up the database:**
   - Open your Supabase project → SQL Editor
   - Run `lib/supabase/schema.sql` (creates tables)
   - Run `lib/supabase/seed.sql` (loads sample data - optional but recommended)

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) and start testing!**

### 📖 Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing instructions with user flows
- **[MVP_PROGRESS.md](MVP_PROGRESS.md)** - Current development status (70% complete!)
- **lib/supabase/schema.sql** - Complete database schema
- **lib/supabase/seed.sql** - Sample data for testing

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

## Development Status (70% Complete)

### ✅ Phase 1: Foundation (Complete)
- ✅ Project setup (Next.js, Tailwind, Supabase)
- ✅ Design system implementation (colors, typography, components)
- ✅ Authentication flows (signup, login, logout, role-based)
- ✅ Navigation and layouts (creator/brand specific)
- ✅ Public pages (landing, how-it-works, about)

### ✅ Phase 2: Profiles & Auctions (Complete)
- ✅ Creator profile creation and editing
- ✅ Brand profile creation and editing
- ✅ Auction creation form with validation
- ✅ Auction listing and browse pages
- ✅ Database schema with RLS policies
- ✅ Sealed-bid submission interface
- ✅ Discovery page for brands

### ✅ Phase 2.5: Dashboards (Complete)
- ✅ Creator dashboard with metrics
- ✅ Brand dashboard with metrics
- ✅ Revenue tracking page (creators)
- ✅ Campaign management page (brands)
- ✅ Auction detail views (both roles)

### 🚧 Phase 3: Automation & Real-time (In Progress)
- ⏳ Real-time auction updates (Supabase subscriptions)
- ⏳ Automated auction closing mechanism
- ⏳ Winner approval/rejection flow (UI exists, needs backend)
- ⏳ Notification system

### 📋 Phase 4: Polish & Deploy (Planned)
- ⏳ Animations and transitions
- ⏳ Mobile responsive optimization
- ⏳ Edge case handling
- ⏳ End-to-end testing
- ⏳ Deployment to Vercel

**Current Progress:** 70% - Core user flows complete and ready for testing!

See [MVP_PROGRESS.md](MVP_PROGRESS.md) for detailed breakdown.

## Contributing

This is an MVP project. Contributions are welcome but should align with the MVP scope and design specifications.

## License

Proprietary - VALENCE MVP v0.1.0-alpha

## Support

For questions or issues, please contact the development team.
