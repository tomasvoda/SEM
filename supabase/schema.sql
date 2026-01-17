-- Create Tables

-- 1. Delegations
CREATE TABLE delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    federation TEXT NOT NULL,
    country_code TEXT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    total_persons INTEGER NOT NULL,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hotels
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hotel Daily Capacities
CREATE TABLE hotel_daily_capacities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    room_type TEXT NOT NULL, -- single, double, triple
    rooms_total INTEGER NOT NULL,
    room_capacity INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Accommodation Allocations
CREATE TABLE accommodation_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegation_id UUID REFERENCES delegations(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, confirmed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Accommodation Allocation Rooms
CREATE TABLE accommodation_allocation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES accommodation_allocations(id) ON DELETE CASCADE,
    room_type TEXT NOT NULL,
    rooms_count INTEGER NOT NULL,
    room_capacity INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Data

-- Hotels
INSERT INTO hotels (id, name, city) VALUES
('b2a9e3f1-7c5d-4a8e-9b2f-1d3e5a7c9f0a', 'Grand Hotel Prostějov', 'Prostějov'),
('c3b0f4a2-8d6e-5b9f-0c3a-2e4f6b8d0a1b', 'Business Hotel Zlín', 'Zlín');

-- Delegations
INSERT INTO delegations (team_name, federation, country_code, arrival_date, departure_date, total_persons) VALUES
('Czech National Team', 'Czech Handball Federation', 'CZE', '2026-10-14', '2026-10-25', 19),
('Swedish Vikings', 'Swedish Handball Federation', 'SWE', '2026-10-14', '2026-10-25', 15);

-- Capacities for October 2026
DO $$
DECLARE
    hotel_rec RECORD;
    target_date DATE;
BEGIN
    FOR hotel_rec IN SELECT id FROM hotels LOOP
        FOR i IN 14..25 LOOP
            target_date := TO_DATE('2026-10-' || i, 'YYYY-MM-DD');
            
            -- Single
            INSERT INTO hotel_daily_capacities (hotel_id, date, room_type, rooms_total, room_capacity)
            VALUES (hotel_rec.id, target_date, 'single', 5, 1);
            
            -- Double
            INSERT INTO hotel_daily_capacities (hotel_id, date, room_type, rooms_total, room_capacity)
            VALUES (hotel_rec.id, target_date, 'double', 20, 2);
            
            -- Triple
            INSERT INTO hotel_daily_capacities (hotel_id, date, room_type, rooms_total, room_capacity)
            VALUES (hotel_rec.id, target_date, 'triple', 10, 3);
        END LOOP;
    END LOOP;
END $$;
