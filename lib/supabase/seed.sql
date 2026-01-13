-- VALENCE MVP Seed Data
-- This script creates sample data for testing the MVP
-- Run this AFTER schema.sql

-- Clear existing data (optional - comment out if you want to preserve existing data)
-- TRUNCATE notifications, settlements, bids, auctions, brand_profiles, creator_profiles, users CASCADE;

-- Note: You'll need to manually create auth.users first via Supabase Auth UI or API
-- This script assumes you have user IDs from auth.users table

-- ============================================================================
-- SAMPLE USERS (Reference - create these via Supabase Auth Dashboard)
-- ============================================================================
-- Creator Users:
-- 1. creator1@valence.test (ID will be generated)
-- 2. creator2@valence.test
-- 3. creator3@valence.test
-- 4. creator4@valence.test
-- 5. creator5@valence.test

-- Brand Users:
-- 1. brand1@valence.test (ID will be generated)
-- 2. brand2@valence.test
-- 3. brand3@valence.test
-- 4. brand4@valence.test
-- 5. brand5@valence.test

-- ============================================================================
-- INSTRUCTIONS FOR MANUAL SETUP:
-- ============================================================================
-- 1. Go to Supabase Auth Dashboard
-- 2. Create users manually with the emails above
-- 3. Copy their generated UUIDs
-- 4. Replace the UUIDs below with your actual user IDs
-- 5. Run this script

-- ============================================================================
-- HELPER: Generate sample UUIDs for template
-- (Replace these with your actual auth.users IDs)
-- ============================================================================

-- Sample Creator Profile IDs (replace with actual)
-- Creator 1 (Fashion Influencer): 10000000-0000-0000-0000-000000000001
-- Creator 2 (Tech Reviewer): 10000000-0000-0000-0000-000000000002
-- Creator 3 (Fitness Coach): 10000000-0000-0000-0000-000000000003
-- Creator 4 (Food Blogger): 10000000-0000-0000-0000-000000000004
-- Creator 5 (Travel Vlogger): 10000000-0000-0000-0000-000000000005

-- Sample Brand Profile IDs (replace with actual)
-- Brand 1 (Fashion Brand): 20000000-0000-0000-0000-000000000001
-- Brand 2 (Tech Company): 20000000-0000-0000-0000-000000000002
-- Brand 3 (Fitness Brand): 20000000-0000-0000-0000-000000000003
-- Brand 4 (Food Company): 20000000-0000-0000-0000-000000000004
-- Brand 5 (Travel Agency): 20000000-0000-0000-0000-000000000005

-- ============================================================================
-- AUTOMATED SEED DATA (uses existing auth.users)
-- ============================================================================

-- This approach fetches existing users from auth.users
-- Create sample creator profiles from any existing users with role='creator'
DO $$
DECLARE
    creator_user_ids UUID[];
    brand_user_ids UUID[];
BEGIN
    -- Get up to 5 creator user IDs
    SELECT ARRAY_AGG(id) INTO creator_user_ids
    FROM (
        SELECT id FROM users WHERE role = 'creator' LIMIT 5
    ) AS creator_users;

    -- Get up to 5 brand user IDs
    SELECT ARRAY_AGG(id) INTO brand_user_ids
    FROM (
        SELECT id FROM users WHERE role = 'brand' LIMIT 5
    ) AS brand_users;

    -- Only proceed if we have users
    IF array_length(creator_user_ids, 1) IS NOT NULL AND array_length(creator_user_ids, 1) >= 1 THEN
        -- Insert creator profiles if they don't exist
        INSERT INTO creator_profiles (user_id, display_name, bio, instagram_handle, tiktok_handle, follower_count, engagement_rate, categories, reputation_score)
        SELECT
            creator_user_ids[1],
            'Emma Fashion',
            'Fashion & lifestyle content creator. Specializing in sustainable fashion and ethical brands. NYC-based.',
            '@emmafashion',
            '@emmastyle',
            150000,
            4.2,
            ARRAY['Fashion', 'Lifestyle', 'Beauty'],
            4.8
        WHERE NOT EXISTS (SELECT 1 FROM creator_profiles WHERE user_id = creator_user_ids[1]);
    END IF;

    IF array_length(brand_user_ids, 1) IS NOT NULL AND array_length(brand_user_ids, 1) >= 1 THEN
        -- Insert brand profiles if they don't exist
        INSERT INTO brand_profiles (user_id, company_name, industry, website, budget_range)
        SELECT
            brand_user_ids[1],
            'StyleCo Fashion',
            'Fashion & Apparel',
            'https://styleco.example.com',
            '$10K - $25K'
        WHERE NOT EXISTS (SELECT 1 FROM brand_profiles WHERE user_id = brand_user_ids[1]);
    END IF;
END $$;

-- ============================================================================
-- SAMPLE CREATOR PROFILES (Manual insertion with known UUIDs)
-- ============================================================================

-- Note: Comment out the DO block above and use these manual INSERTs if you prefer
-- Replace UUIDs with actual auth.users IDs from your Supabase project

/*
INSERT INTO creator_profiles (user_id, display_name, bio, instagram_handle, tiktok_handle, follower_count, engagement_rate, categories, reputation_score) VALUES
('YOUR_UUID_HERE', 'Emma Fashion', 'Fashion & lifestyle content creator. Specializing in sustainable fashion and ethical brands. NYC-based.', '@emmafashion', '@emmastyle', 150000, 4.2, ARRAY['Fashion', 'Lifestyle', 'Beauty'], 4.8),
('YOUR_UUID_HERE', 'TechReviewer Pro', 'In-depth tech reviews and unboxings. Honest opinions on the latest gadgets and software.', '@techreviewpro', '@techpro', 280000, 5.1, ARRAY['Tech', 'Gaming'], 4.9),
('YOUR_UUID_HERE', 'FitLife Coach', 'Certified personal trainer sharing workout tips, nutrition advice, and wellness content.', '@fitlifecoach', '@fitlife', 95000, 6.3, ARRAY['Fitness', 'Health & Wellness'], 4.7),
('YOUR_UUID_HERE', 'Foodie Adventures', 'Restaurant reviews, recipes, and culinary travel. Making food fun and accessible!', '@foodieadventures', '@foodietravel', 210000, 4.8, ARRAY['Food', 'Travel'], 4.6),
('YOUR_UUID_HERE', 'Global Wanderlust', 'Travel vlogger exploring hidden gems around the world. Budget travel tips and destination guides.', '@globalwanderlust', '@wanderlust', 185000, 3.9, ARRAY['Travel', 'Lifestyle'], 4.5);
*/

-- ============================================================================
-- SAMPLE BRAND PROFILES (Manual insertion)
-- ============================================================================

/*
INSERT INTO brand_profiles (user_id, company_name, industry, website, budget_range) VALUES
('YOUR_UUID_HERE', 'StyleCo Fashion', 'Fashion & Apparel', 'https://styleco.example.com', '$10K - $25K'),
('YOUR_UUID_HERE', 'TechGear Inc', 'Technology', 'https://techgear.example.com', '$25K - $50K'),
('YOUR_UUID_HERE', 'PureFit Nutrition', 'Health & Wellness', 'https://purefit.example.com', '$5K - $10K'),
('YOUR_UUID_HERE', 'Gourmet Foods Co', 'Food & Beverage', 'https://gourmetfoods.example.com', '$10K - $25K'),
('YOUR_UUID_HERE', 'Explore Travel Agency', 'Travel & Hospitality', 'https://exploretravel.example.com', '$25K - $50K');
*/

-- ============================================================================
-- SAMPLE AUCTIONS
-- ============================================================================

-- Note: These require actual creator_profile.id values
-- The script below will create auctions for existing creator profiles

DO $$
DECLARE
    creator_ids UUID[];
BEGIN
    -- Get existing creator profile IDs
    SELECT ARRAY_AGG(id) INTO creator_ids
    FROM (SELECT id FROM creator_profiles LIMIT 5) AS creators;

    -- Only create auctions if we have creator profiles
    IF array_length(creator_ids, 1) IS NOT NULL AND array_length(creator_ids, 1) >= 1 THEN
        -- Active Auction 1
        INSERT INTO auctions (creator_id, title, description, platform, content_type, delivery_window_start, delivery_window_end, access_slots, entry_price, reserve_price, prohibited_categories, status, start_time, end_time)
        VALUES (
            creator_ids[1],
            'Instagram Reel - Summer Fashion Collection',
            'Featuring your summer collection in a 30-60 second Instagram Reel. High-quality production with trending audio. Includes product links and brand mention. Expected reach: 150K+ impressions.',
            'instagram',
            'Instagram Reel',
            CURRENT_DATE + INTERVAL '14 days',
            CURRENT_DATE + INTERVAL '30 days',
            10,
            250,
            4000,
            ARRAY['Alcohol', 'Gambling'],
            'active',
            NOW(),
            NOW() + INTERVAL '48 hours'
        );

        IF array_length(creator_ids, 1) >= 2 THEN
            -- Active Auction 2
            INSERT INTO auctions (creator_id, title, description, platform, content_type, delivery_window_start, delivery_window_end, access_slots, entry_price, reserve_price, prohibited_categories, status, start_time, end_time)
            VALUES (
                creator_ids[2],
                'YouTube Product Review Video',
                'Comprehensive 10-15 minute review video featuring your product. In-depth analysis, pros/cons, and final verdict. Video optimized for SEO with detailed description.',
                'youtube',
                'YouTube Video',
                CURRENT_DATE + INTERVAL '7 days',
                CURRENT_DATE + INTERVAL '21 days',
                5,
                800,
                8000,
                ARRAY['Political', 'Adult Content'],
                'active',
                NOW(),
                NOW() + INTERVAL '72 hours'
            );
        END IF;

        IF array_length(creator_ids, 1) >= 3 THEN
            -- Active Auction 3
            INSERT INTO auctions (creator_id, title, description, platform, content_type, delivery_window_start, delivery_window_end, access_slots, entry_price, reserve_price, prohibited_categories, status, start_time, end_time)
            VALUES (
                creator_ids[3],
                'TikTok Workout Challenge',
                '3-part TikTok series showcasing your fitness product or supplement. Each video 15-30 seconds with workout demonstrations. Authentic integration.',
                'tiktok',
                'TikTok Video',
                CURRENT_DATE + INTERVAL '10 days',
                CURRENT_DATE + INTERVAL '25 days',
                8,
                300,
                3500,
                ARRAY['Tobacco', 'Alcohol'],
                'active',
                NOW(),
                NOW() + INTERVAL '96 hours'
            );
        END IF;

        IF array_length(creator_ids, 1) >= 4 THEN
            -- Recently Closed Auction
            INSERT INTO auctions (creator_id, title, description, platform, content_type, delivery_window_start, delivery_window_end, access_slots, entry_price, reserve_price, prohibited_categories, status, start_time, end_time)
            VALUES (
                creator_ids[4],
                'Instagram Story Series - Restaurant Review',
                '5-story series reviewing your restaurant/food product. Behind-the-scenes content, taste test, and recommendation. Swipe-up link included.',
                'instagram',
                'Instagram Story',
                CURRENT_DATE + INTERVAL '5 days',
                CURRENT_DATE + INTERVAL '15 days',
                12,
                200,
                2800,
                ARRAY[]::text[],
                'closed',
                NOW() - INTERVAL '3 days',
                NOW() - INTERVAL '1 hour'
            );
        END IF;

        IF array_length(creator_ids, 1) >= 5 THEN
            -- Draft Auction
            INSERT INTO auctions (creator_id, title, description, platform, content_type, delivery_window_start, delivery_window_end, access_slots, entry_price, reserve_price, prohibited_categories, status, start_time, end_time)
            VALUES (
                creator_ids[5],
                'YouTube Travel Vlog - Destination Feature',
                'Feature your travel service/product in a destination vlog. 8-12 minute video with beautiful cinematography and genuine endorsement.',
                'youtube',
                'YouTube Video',
                CURRENT_DATE + INTERVAL '20 days',
                CURRENT_DATE + INTERVAL '45 days',
                6,
                500,
                6000,
                ARRAY['MLM', 'Cryptocurrency'],
                'draft',
                NULL,
                NULL
            );
        END IF;
    END IF;
END $$;

-- ============================================================================
-- SAMPLE BIDS
-- ============================================================================

DO $$
DECLARE
    brand_ids UUID[];
    auction_ids UUID[];
BEGIN
    -- Get existing brand and auction IDs
    SELECT ARRAY_AGG(id) INTO brand_ids FROM (SELECT id FROM brand_profiles LIMIT 5) AS brands;
    SELECT ARRAY_AGG(id) INTO auction_ids FROM (SELECT id FROM auctions WHERE status = 'active' LIMIT 3) AS active_auctions;

    -- Create sample bids if we have both brands and auctions
    IF array_length(brand_ids, 1) IS NOT NULL AND array_length(auction_ids, 1) IS NOT NULL THEN
        IF array_length(auction_ids, 1) >= 1 AND array_length(brand_ids, 1) >= 1 THEN
            -- Bids on first active auction
            INSERT INTO bids (auction_id, brand_id, bid_amount, entry_fee_paid, status, submitted_at)
            VALUES
                (auction_ids[1], brand_ids[1], 4500, true, 'pending', NOW() - INTERVAL '6 hours'),
                (auction_ids[1], brand_ids[2], 3800, true, 'pending', NOW() - INTERVAL '4 hours');

            IF array_length(brand_ids, 1) >= 3 THEN
                INSERT INTO bids (auction_id, brand_id, bid_amount, entry_fee_paid, status, submitted_at)
                VALUES (auction_ids[1], brand_ids[3], 5200, true, 'pending', NOW() - INTERVAL '2 hours');
            END IF;
        END IF;

        IF array_length(auction_ids, 1) >= 2 AND array_length(brand_ids, 1) >= 2 THEN
            -- Bids on second active auction
            INSERT INTO bids (auction_id, brand_id, bid_amount, entry_fee_paid, status, submitted_at)
            VALUES
                (auction_ids[2], brand_ids[2], 9500, true, 'pending', NOW() - INTERVAL '12 hours');

            IF array_length(brand_ids, 1) >= 4 THEN
                INSERT INTO bids (auction_id, brand_id, bid_amount, entry_fee_paid, status, submitted_at)
                VALUES (auction_ids[2], brand_ids[4], 8800, true, 'pending', NOW() - INTERVAL '8 hours');
            END IF;
        END IF;
    END IF;
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Seed data created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Summary:';
    RAISE NOTICE 'Creator Profiles: %', (SELECT COUNT(*) FROM creator_profiles);
    RAISE NOTICE 'Brand Profiles: %', (SELECT COUNT(*) FROM brand_profiles);
    RAISE NOTICE 'Auctions: %', (SELECT COUNT(*) FROM auctions);
    RAISE NOTICE 'Bids: %', (SELECT COUNT(*) FROM bids);
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '1. Create test users via Supabase Auth Dashboard';
    RAISE NOTICE '2. Sign up as Creator and Brand to test flows';
    RAISE NOTICE '3. Browse auctions, place bids, and test the full experience';
END $$;
