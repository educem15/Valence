-- VALENCE MVP Database Schema
-- This SQL script sets up the complete database schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('creator', 'brand');
CREATE TYPE auction_status AS ENUM ('draft', 'active', 'closed', 'completed', 'failed');
CREATE TYPE bid_status AS ENUM ('pending', 'won', 'lost', 'approved', 'rejected');
CREATE TYPE settlement_status AS ENUM ('pending', 'escrowed', 'completed');
CREATE TYPE platform AS ENUM ('instagram', 'tiktok', 'youtube');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator profiles
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    instagram_handle TEXT,
    tiktok_handle TEXT,
    follower_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5, 2) DEFAULT 0.0,
    categories TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    reputation_score DECIMAL(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Brand profiles
CREATE TABLE brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    logo_url TEXT,
    budget_range TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Auctions
CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    platform platform NOT NULL,
    content_type TEXT NOT NULL,
    delivery_window_start DATE NOT NULL,
    delivery_window_end DATE NOT NULL,
    access_slots INTEGER NOT NULL DEFAULT 10,
    entry_price DECIMAL(10, 2) NOT NULL,
    reserve_price DECIMAL(10, 2) NOT NULL,
    prohibited_categories TEXT[] DEFAULT '{}',
    status auction_status DEFAULT 'draft',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    bid_amount DECIMAL(10, 2) NOT NULL,
    entry_fee_paid BOOLEAN DEFAULT FALSE,
    status bid_status DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(auction_id, brand_id)
);

-- Settlements
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    winning_bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    clearing_price DECIMAL(10, 2) NOT NULL,
    platform_revenue DECIMAL(10, 2) NOT NULL,
    creator_revenue DECIMAL(10, 2) NOT NULL,
    status settlement_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(auction_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX idx_auctions_creator_id ON auctions(creator_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_bids_auction_id ON bids(auction_id);
CREATE INDEX idx_bids_brand_id ON bids(brand_id);
CREATE INDEX idx_settlements_auction_id ON settlements(auction_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Creator profiles policies
CREATE POLICY "Anyone can view creator profiles" ON creator_profiles
    FOR SELECT USING (true);

CREATE POLICY "Creators can insert their own profile" ON creator_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update their own profile" ON creator_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Brand profiles policies
CREATE POLICY "Brands can view all brand profiles" ON brand_profiles
    FOR SELECT USING (true);

CREATE POLICY "Brands can insert their own profile" ON brand_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brands can update their own profile" ON brand_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Auctions policies
CREATE POLICY "Anyone can view active auctions" ON auctions
    FOR SELECT USING (status IN ('active', 'closed', 'completed'));

CREATE POLICY "Creators can view their own auctions" ON auctions
    FOR SELECT USING (
        creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Creators can insert auctions" ON auctions
    FOR INSERT WITH CHECK (
        creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Creators can update their own auctions" ON auctions
    FOR UPDATE USING (
        creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    );

-- Bids policies
CREATE POLICY "Brands can view their own bids" ON bids
    FOR SELECT USING (
        brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Creators can view bids on their auctions" ON bids
    FOR SELECT USING (
        auction_id IN (
            SELECT a.id FROM auctions a
            JOIN creator_profiles cp ON a.creator_id = cp.id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Brands can insert bids" ON bids
    FOR INSERT WITH CHECK (
        brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Brands can update their own bids" ON bids
    FOR UPDATE USING (
        brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
    );

-- Settlements policies
CREATE POLICY "Creators can view settlements for their auctions" ON settlements
    FOR SELECT USING (
        auction_id IN (
            SELECT a.id FROM auctions a
            JOIN creator_profiles cp ON a.creator_id = cp.id
            WHERE cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Brands can view settlements for won bids" ON settlements
    FOR SELECT USING (
        winning_bid_id IN (
            SELECT b.id FROM bids b
            JOIN brand_profiles bp ON b.brand_id = bp.id
            WHERE bp.user_id = auth.uid()
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        'creator'::user_role, -- Default role, should be updated by application
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate second-price auction winner
CREATE OR REPLACE FUNCTION calculate_auction_winner(auction_uuid UUID)
RETURNS TABLE (
    winning_bid_id UUID,
    clearing_price DECIMAL,
    reserve_met BOOLEAN
) AS $$
DECLARE
    auction_reserve DECIMAL;
    highest_bid_id UUID;
    highest_bid_amount DECIMAL;
    second_highest_bid_amount DECIMAL;
BEGIN
    -- Get auction reserve price
    SELECT reserve_price INTO auction_reserve
    FROM auctions
    WHERE id = auction_uuid;

    -- Get highest bid
    SELECT id, bid_amount INTO highest_bid_id, highest_bid_amount
    FROM bids
    WHERE auction_id = auction_uuid
    ORDER BY bid_amount DESC, submitted_at ASC
    LIMIT 1;

    -- Get second highest bid
    SELECT bid_amount INTO second_highest_bid_amount
    FROM bids
    WHERE auction_id = auction_uuid AND id != highest_bid_id
    ORDER BY bid_amount DESC, submitted_at ASC
    LIMIT 1;

    -- If no bids, return null
    IF highest_bid_id IS NULL THEN
        RETURN;
    END IF;

    -- Calculate clearing price (second price or reserve, whichever is higher)
    IF second_highest_bid_amount IS NULL THEN
        -- Only one bid, use reserve as clearing price if bid meets reserve
        IF highest_bid_amount >= auction_reserve THEN
            RETURN QUERY SELECT highest_bid_id, auction_reserve, TRUE;
        ELSE
            RETURN QUERY SELECT highest_bid_id, highest_bid_amount, FALSE;
        END IF;
    ELSE
        -- Multiple bids, use second price or reserve (whichever is higher)
        IF second_highest_bid_amount >= auction_reserve THEN
            RETURN QUERY SELECT highest_bid_id, second_highest_bid_amount, TRUE;
        ELSIF highest_bid_amount >= auction_reserve THEN
            RETURN QUERY SELECT highest_bid_id, auction_reserve, TRUE;
        ELSE
            RETURN QUERY SELECT highest_bid_id, second_highest_bid_amount, FALSE;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;
