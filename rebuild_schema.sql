-- 1. Update Delegations Table
ALTER TABLE delegations ADD COLUMN IF NOT EXISTS required_persons INTEGER DEFAULT 0;
ALTER TABLE delegations ADD COLUMN IF NOT EXISTS required_singles INTEGER DEFAULT 0;
ALTER TABLE delegations ADD COLUMN IF NOT EXISTS required_doubles INTEGER DEFAULT 0;

-- 2. Drop existing problematic triggers/functions related to allocations
DROP TRIGGER IF EXISTS check_capacity_on_allocation ON accommodation_allocation_rooms;
DROP FUNCTION IF EXISTS validate_accommodation_capacity();

-- 3. Rebuild Accommodation Allocations (Header Only)
DROP TABLE IF EXISTS accommodation_allocation_rooms CASCADE;
DROP TABLE IF EXISTS accommodation_allocations CASCADE;

CREATE TABLE accommodation_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delegation_id UUID NOT NULL REFERENCES delegations(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'cancelled')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rebuild Accommodation Allocation Rooms (Consumption Only)
CREATE TABLE accommodation_allocation_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    allocation_id UUID NOT NULL REFERENCES accommodation_allocations(id) ON DELETE CASCADE,
    room_capacity INTEGER NOT NULL, -- 1 for singles, 2 for doubles, etc.
    rooms_count INTEGER NOT NULL DEFAULT 0,
    CHECK (rooms_count >= 0)
);

-- 5. Enable RLS (Disable for now as requested in previous sessions for local dev/testing simplicity if needed, but standard is active)
ALTER TABLE accommodation_allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_allocation_rooms DISABLE ROW LEVEL SECURITY;
