export type HotelStatus = 'active' | 'inactive';
export type OfferStatus = 'draft' | 'confirmed' | 'rejected';

export const EVENT_START_DATE = '2026-10-14';
export const EVENT_END_DATE = '2026-10-25';

export type ServiceType =
    | 'city_tax'
    | 'dinner'
    | 'lunch'
    | 'parking_car'
    | 'parking_bus'
    | 'meeting_room'
    | 'custom';

export type ServiceUnit =
    | 'person_per_night'
    | 'room_per_night'
    | 'vehicle_per_day'
    | 'flat';

export interface Hotel {
    id: string;
    name: string;
    city: string;
    address: string;
    contact_email: string;
    contact_phone: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface HotelOffer {
    id: string;
    hotel_id: string;
    name: string;
    date_from: string;
    date_to: string;
    nights: number;
    status: OfferStatus;
    note: string;
    created_at: string;
    updated_at: string;
}

export interface HotelOfferRoom {
    id: string;
    hotel_offer_id: string;
    room_capacity: number; // Beds per room
    rooms_count: number;
    price_per_room_per_night: number;
    is_gratuit: boolean;
    note: string;
}

export interface HotelOfferService {
    id: string;
    hotel_offer_id: string;
    service_type: ServiceType;
    price: number;
    unit: ServiceUnit;
    mandatory: boolean;
    note: string;
}

export interface HotelDailyCapacity {
    id: string;
    hotel_id: string;
    hotel_offer_id: string;
    date: string; // YYYY-MM-DD
    room_capacity: number;
    rooms_total: number;
    capacity_total: number;
    source: "offer" | "db";
    created_at: string;
}

export interface HotelDailyCapacityAllocation {
    id: string;
    hotel_daily_capacity_id: string;
    allocation_id: string;
    delegation_id: string;
    rooms_reserved: number;
    created_at: string;
}

export type AllocationStatus = 'draft' | 'confirmed' | 'cancelled';

export interface AccommodationAllocation {
    id: string;
    delegation_id: string; // FK to Delegation
    hotel_id: string; // FK to Hotel
    date_from: string;
    date_to: string;
    status: AllocationStatus;
    note?: string;
    created_at: string;
    updated_at: string;
}

export interface AccommodationAllocationRoom {
    id: string;
    allocation_id: string;
    room_capacity: number; // Beds per room: 1, 2, 3, etc.
    rooms_count: number;
}

// Read-only Delegation interface for Admin
export interface Delegation {
    id: string;
    team_name: string;
    federation: string;
    country_code: string;
    arrival_date: string;
    departure_date: string;
    required_persons: number;
    required_singles: number;
    required_doubles: number;
    required_players: number;
    required_staff: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;

    // Logistics
    transport_arrival_type: string | null;
    transport_arrival_date: string | null;
    transport_arrival_time: string | null;
    transport_arrival_location: string | null;
    transport_arrival_flight: string | null;
    transport_arrival_persons: number;
    transport_arrival_transfer: boolean;

    transport_departure_type: string | null;
    transport_departure_date: string | null;
    transport_departure_time: string | null;
    transport_departure_location: string | null;
    transport_departure_flight: string | null;
    transport_departure_persons: number;
    transport_departure_transfer: boolean;

    // Services
    meal_plan: string;
    dietary_vegetarian: number;
    dietary_vegan: number;
    dietary_gluten_free: number;
    dietary_other: string | null;
    addon_lunch_package: boolean;
    addon_hot_lunch: boolean;

    training_sessions: any; // JSONB

    // Billing
    billing_company: string | null;
    billing_address: string | null;
    billing_city: string | null;
    billing_postal: string | null;
    billing_country: string | null;
    billing_vat: string | null;
    billing_email: string | null;

    status: 'draft' | 'submitted';
    accommodation_request?: any;
    created_at: string;
}

// --- Reporting Types ---

export interface CityReport {
    city: string;
    total_rooms: number;
    used_rooms: number;
    available_rooms: number;
    total_capacity: number;
    used_capacity: number;
    occupancy_percentage: number;
}

export interface HotelOccupancyReport {
    hotel_id: string;
    hotel_name: string;
    date: string;
    room_capacity: number;
    total_rooms: number;
    reserved_rooms: number;
    available_rooms: number;
    occupancy_percentage: number;
}

export interface DelegationStayReport {
    delegation_id: string;
    delegation_name: string;
    hotel_name: string;
    date: string;
    room_capacity: number;
    rooms_reserved: number;
    persons: number;
    status: AllocationStatus;
}

export interface DailyGridDay {
    date: string;
    occupancy_percentage: number;
    status: 'low' | 'medium' | 'critical' | 'unavailable'; // Based on 80/95 thresholds
}

export interface HotelDailyGrid {
    hotel_id: string;
    hotel_name: string;
    city: string;
    days: DailyGridDay[];
}

export interface CityOccupancyGrid {
    city: string;
    days: DailyGridDay[];
}
