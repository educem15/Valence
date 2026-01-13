# VALENCE MVP - Testing Guide

## Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Supabase account** (free tier works fine)
- **Git** (already installed)

---

## Quick Start (5-Minute Setup)

### Step 1: Install Dependencies

```bash
cd /home/user/Valence
npm install
```

### Step 2: Set Up Supabase

#### 2a. Create a Supabase Project
1. Go to https://supabase.com
2. Sign up/login
3. Click "New Project"
4. Name it "valence-mvp"
5. Set a database password (save it!)
6. Wait ~2 minutes for setup

#### 2b. Get Your API Keys
1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Click "API" in the left sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - keep this secret!)

#### 2c. Configure Environment Variables
Create `.env.local` in the project root:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

**Replace the placeholder values with your actual Supabase keys!**

### Step 3: Set Up the Database

#### 3a. Run Schema SQL
1. In Supabase dashboard, go to "SQL Editor" (left sidebar)
2. Click "New Query"
3. Copy and paste the entire contents of `lib/supabase/schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

#### 3b. Load Seed Data (Optional but Recommended)
1. Still in SQL Editor, create another "New Query"
2. Copy and paste the entire contents of `lib/supabase/seed.sql`
3. Click "Run"
4. This creates 10 sample creators, 15 auctions, and 40 bids

### Step 4: Enable Email Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Make sure "Email" is enabled
3. Scroll down to "Email Templates"
4. For testing, set "Confirm email" to OFF (so you don't need to verify emails)
   - Go to "Authentication" → "Settings"
   - Under "User Signups", disable "Enable email confirmations"

### Step 5: Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

Open http://localhost:3000 in your browser!

---

## Testing User Flows

### Test 1: Creator Journey (10 minutes)

#### 1. Sign Up as Creator
1. Go to http://localhost:3000
2. Click "Sign Up" in the navigation
3. Fill in the form:
   - Email: `creator-test@example.com`
   - Password: `password123`
   - Select "Creator" role
4. Click "Sign up"
5. You should be redirected to the profile setup page

#### 2. Complete Creator Profile
1. Fill in the profile form:
   - Display Name: "Sarah Johnson"
   - Bio: "Fashion & lifestyle creator passionate about sustainable brands"
   - Instagram Handle: `@sarahjohnson`
   - Follower Count: `150000`
   - Engagement Rate: `5.2`
   - Categories: Select "Fashion & Apparel"
2. Click "Save Changes"
3. You should be redirected to `/creator/dashboard`

#### 3. Create Your First Auction
1. From the dashboard, click "Create New Auction"
2. Fill in the form:
   - **Title**: "Instagram Reel - Sustainable Fashion Campaign"
   - **Description**: "30-second Reel featuring your product, posted to main feed"
   - **Platform**: Instagram
   - **Content Type**: Reel
   - **Delivery Window**: Select dates 2 weeks from now
   - **Access Slots**: 10
   - **Entry Price**: $250
   - **Reserve Price**: $4000 (notice the AI recommendation!)
   - **Auction Duration**: 5 days
3. Click "Publish Auction"
4. You should be redirected to the auction detail page

#### 4. View Your Auction
1. You should see your auction with status "Active"
2. Note the countdown timer
3. Check the "Bids Received" section (should be empty for now)

#### 5. Navigate to Auctions Page
1. Click "Auctions" in the navigation
2. You should see your newly created auction in the list
3. Try the filter buttons (All, Active, Completed, Draft)

---

### Test 2: Brand Journey (10 minutes)

#### 1. Open a New Incognito/Private Window
This lets you test as a brand while staying logged in as creator in the other window.

#### 2. Sign Up as Brand
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Email: `brand-test@example.com`
   - Password: `password123`
   - Select "Brand" role
4. Click "Sign up"

#### 3. Complete Brand Profile
1. Fill in the profile form:
   - Company Name: "EcoStyle Co"
   - Industry: "Fashion & Apparel"
   - Website: `https://ecostyle.example.com`
   - Budget Range: "$10K - $25K"
2. Click "Save Changes"

#### 4. Discover Auctions
1. From the brand dashboard, click "Browse Active Auctions"
2. You should see the auction you created as a creator
3. Try filtering by category: "Fashion & Apparel"
4. Notice the creator profiles, follower counts, and auction details

#### 5. Place a Bid
1. Click on the auction you created as a creator
2. Scroll to the "Place Your Bid" section
3. Enter a bid amount: `$5500`
4. Notice the "Reserve Met ✓" indicator appears
5. Click "Submit Bid"
6. You should see a success message

#### 6. View Your Campaign
1. Click "Campaigns" in the navigation
2. You should see your bid with status "Pending"
3. It shows your bid amount and the auction details

#### 7. Try Placing Another Bid
1. Go back to "Discover"
2. If you loaded seed data, you'll see other auctions
3. Try bidding on another one (below reserve to see the warning)

---

### Test 3: Viewing Bids as Creator

#### 1. Switch Back to Your Creator Window
1. Go back to the browser window where you're logged in as creator
2. Go to your Dashboard or Auctions page
3. Click on the auction you created

#### 2. View Bid Activity
1. You should now see "1 bid received" in the stats
2. The bids are sealed (amounts not shown while auction is active)
3. You can see that a brand has placed a bid

#### 3. Check Your Dashboard Stats
1. Go to "Dashboard"
2. Stats should reflect your active auction
3. Check "Revenue" page (no revenue yet since auction isn't complete)

---

## Testing with Seed Data

If you loaded the seed data, you have access to:

### Sample Creators (10)
- Login credentials are in the format: `creator{N}@test.com` (N = 1-10)
- Password for all: `password123`
- Examples:
  - `creator1@test.com` - Fashion influencer, 250K followers
  - `creator2@test.com` - Fitness creator, 180K followers
  - `creator3@test.com` - Food blogger, 320K followers

### Sample Brands (5)
- Login credentials: `brand{N}@test.com` (N = 1-5)
- Password for all: `password123`
- Examples:
  - `brand1@test.com` - FashionBrand Co
  - `brand2@test.com` - TechGear Inc

### Sample Auctions (15)
- Various platforms (Instagram, TikTok, YouTube)
- Different statuses (active, completed, failed)
- Existing bids already placed

### Testing with Seed Data:
```bash
# Login as existing creator
Email: creator1@test.com
Password: password123

# Login as existing brand
Email: brand1@test.com
Password: password123
```

---

## Manual Testing Checklist

### Authentication
- [ ] Sign up as creator
- [ ] Sign up as brand
- [ ] Login with existing credentials
- [ ] Logout
- [ ] Try accessing protected routes while logged out (should redirect to login)

### Creator Features
- [ ] Complete profile setup
- [ ] Edit profile
- [ ] Create new auction
- [ ] View auction list
- [ ] View auction details
- [ ] See bid counts (but not amounts while active)
- [ ] Check dashboard metrics
- [ ] View revenue page

### Brand Features
- [ ] Complete profile setup
- [ ] Edit profile
- [ ] Browse auctions on discover page
- [ ] Filter auctions by category
- [ ] View auction details
- [ ] Place a bid (above reserve)
- [ ] Try to place a bid below entry price (should fail)
- [ ] Update a bid
- [ ] View campaigns page
- [ ] Check dashboard metrics

### UI/UX
- [ ] Navigation works on desktop
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Loading states appear
- [ ] Empty states show when no data
- [ ] Hover effects work on cards and buttons
- [ ] Status badges have correct colors

### Responsive Design
- [ ] Open DevTools → Toggle device toolbar
- [ ] Test on mobile size (375px)
- [ ] Test on tablet size (768px)
- [ ] Test on desktop size (1920px)
- [ ] All pages should be readable and usable

---

## Common Issues & Solutions

### Issue: "Invalid JWT" or Authentication Errors
**Solution:**
- Check that your `.env.local` file has the correct Supabase keys
- Restart the dev server after changing environment variables
- Clear browser cookies and localStorage

### Issue: "relation does not exist" Database Error
**Solution:**
- Make sure you ran `lib/supabase/schema.sql` in Supabase SQL Editor
- Check the SQL Editor for any error messages
- Verify all tables were created (users, creator_profiles, brand_profiles, etc.)

### Issue: Can't Sign Up (Email Already Exists)
**Solution:**
- Go to Supabase → Authentication → Users
- Delete the existing user
- Or use a different email address

### Issue: Page Shows "Loading..." Forever
**Solution:**
- Open browser DevTools → Console
- Check for errors
- Verify Supabase connection (check Network tab)
- Make sure your Supabase project is running (not paused)

### Issue: Seed Data Doesn't Load
**Solution:**
- Make sure schema is created first
- Check SQL Editor for error messages
- The seed script requires the schema to exist

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## Quick Verification Commands

### Check if database is set up correctly:
```sql
-- Run this in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see: auctions, bids, brand_profiles, creator_profiles, notifications, settlements, users

### Check if seed data loaded:
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) as creator_count FROM creator_profiles;
SELECT COUNT(*) as brand_count FROM brand_profiles;
SELECT COUNT(*) as auction_count FROM auctions;
SELECT COUNT(*) as bid_count FROM bids;
```

Expected results (if seed data loaded):
- creator_count: 10
- brand_count: 5
- auction_count: 15
- bid_count: ~40

---

## Advanced Testing

### Test Auction Lifecycle Manually

Since the automated auction closing isn't implemented yet, you can test it manually:

#### 1. Mark an Auction as Closed
```sql
-- In Supabase SQL Editor
UPDATE auctions
SET status = 'closed',
    end_time = NOW()
WHERE id = 'YOUR_AUCTION_ID';
```

#### 2. Calculate Winner (Second-Price Vickrey)
```sql
-- Call the clearing function
SELECT * FROM calculate_second_price_clearing('YOUR_AUCTION_ID');
```

This will:
- Determine the winning bid
- Calculate clearing price (2nd highest bid)
- Create a settlement record
- Update bid statuses

#### 3. View as Creator
- Refresh the auction page
- You should now see bid amounts revealed
- Winner should be highlighted
- Settlement details should appear

---

## Performance Testing

### Check Page Load Times
1. Open DevTools → Network tab
2. Reload pages
3. Check "DOMContentLoaded" time (should be < 2 seconds)

### Check Lighthouse Score
1. Open DevTools → Lighthouse tab
2. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
3. Target: 90+ on all metrics

---

## Next Steps After Testing

Once you've tested the core flows:

1. **Report Issues**: Note any bugs or UX issues you find
2. **Test Edge Cases**:
   - What happens with 0 bids?
   - What if reserve price isn't met?
   - What about expired auctions?
3. **Mobile Testing**: Use real devices if possible
4. **Browser Testing**: Test in Chrome, Firefox, Safari

---

## Getting Help

If you encounter issues:

1. **Check the console**: Browser DevTools → Console tab
2. **Check Supabase logs**: Supabase Dashboard → Logs
3. **Check the code**: All source code is in the repository
4. **Review documentation**:
   - README.md
   - MVP_PROGRESS.md
   - This guide

---

## What You Should See

### Homepage (Not Logged In)
- Clean landing page with VALENCE branding
- "Sign Up as Creator" and "Sign Up as Brand" buttons
- Navigation: Logo, How It Works, About, Login

### Creator Dashboard
- 4 stat cards (Total Revenue, Active Auctions, Total Auctions, Success Rate)
- "Create New Auction" button
- Recent auctions list
- Profile summary

### Brand Dashboard
- 4 stat cards (Total Spent, Active Bids, Won Campaigns, Win Rate)
- "Browse Active Auctions" button
- Recent campaigns list
- Profile summary

### Auction Cards (Discover Page)
- Creator avatar and name
- Follower count and engagement rate
- Platform and content type
- Entry price and reserve indicator
- Time remaining countdown
- Slots available progress bar
- "View Details" button

---

Happy testing! 🚀
