import { create } from 'zustand';
import { delegationService } from '../services/delegationService';
import { differenceInDays, parseISO, isValid } from 'date-fns';
import { persist } from 'zustand/middleware';

// --- Constants (Admin Configuration) ---

export interface PricingConfig {
    accommodation: {
        [hotelName: string]: Record<number, number>; // Capacity -> Price per Person per Night
    } & { default: Record<number, number> };
    catering: {
        half_board: number;
        full_board: number;
        lunchPackage: number;
        hotLunch: number;
    };
    transport: {
        // EUR per TRANSFER (flat fee), per airport
        [airportCode: string]: number;
    } & { default: number };
    training: {
        slot: number;
    };
    accreditation: number;
}

export const INITIAL_PRICING: PricingConfig = {
    accommodation: {
        // EUR per person per night
        'Hotel Comfort Olomouc': { 1: 80, 2: 100, 3: 135 },
        'Hotel Zlín': { 1: 75, 2: 95, 3: 130 },
        'Hotel Rottal': { 1: 75, 2: 95, 3: 130 },
        // Fallback
        'default': { 1: 80, 2: 100, 3: 135 }
    },
    catering: {
        // EUR per person per day
        half_board: 30,
        full_board: 40,
        lunchPackage: 10,
        hotLunch: 15,
    },
    transport: {
        // EUR per TRANSFER (Flat fee for the vehicle/group)
        'PRG': 500, // Prague
        'VIE': 350, // Vienna
        'BRQ': 150, // Brno
        'default': 200
    },
    training: {
        // EUR per team per slot
        slot: 50
    },
    accreditation: 65
};

// Backwards compatibility for UI components that import it directly (though strictly they should read from store)
// For now, we point this to INITIAL_PRICING, but components should ideally select from store.
export const PRICING_CONFIG = INITIAL_PRICING;

// --- Constants (Admin Configuration) ---

export const HOTEL_TO_CITY_MAPPING: Record<string, string> = {
    'Hotel Comfort Olomouc': 'Prostějov',
    'Hotel Zlín': 'Otrokovice',
    'Hotel Rottal': 'Otrokovice'
};

// --- Types ---

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface BasicsState {
    federation: string;
    country_code: string;
    teamName: string;
    contactPerson: string;
    email: string;
    phone: string;
    headCount: {
        players: number;
        staff: number;
        total: number;
    };
    dates: {
        arrival: string;
        departure: string;
    };
}

export interface AccommodationBlock {
    id: string;
    hotel: string;
    checkIn: string;
    checkOut: string;
    rooms: Array<{ capacity: number; count: number }>;
}

export interface TransportLeg {
    type: 'plane' | 'bus' | 'car' | null;
    date: string;
    time: string;
    location: string;
    flightNumber?: string;
    persons: number;
    airportTransfer?: boolean;
}

export interface MealsState {
    plan: 'full_board' | 'half_board';
    dietary: {
        vegetarian: number;
        vegan: number;
        glutenFree: number;
        other: string;
    };
    addons: {
        lunchPackage: boolean;
        hotLunch: boolean;
    }
}

export interface TrainingSession {
    id: string;
    date: string; // Restricted to 2026-10-14 or 2026-10-15
    slots: number;
}

export interface TrainingState {
    sessions: TrainingSession[];
}

export interface BillingState {
    companyName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber?: string;
    billingEmail: string;
}

export interface CostBreakdown {
    accommodation: number;
    meals: number;
    transport: number;
    training: number;
    accreditation: number;
    total: number;
}

export interface DelegationValues {
    basics: BasicsState;
    accommodation: AccommodationBlock[];
    transport: {
        arrival: TransportLeg;
        departure: TransportLeg;
    };
    meals: MealsState;
    training: TrainingState;
    billing: BillingState;
    pricing: PricingConfig;
    agreedToTerms: boolean;
    status: 'draft' | 'submitted';
    isLoading: boolean;
    error: string | null;
}

// --- Store ---

interface DelegationStore extends DelegationValues {
    updateBasics: (data: Partial<BasicsState>) => void;
    setAccommodation: (data: AccommodationBlock[]) => void;
    updateTransport: (leg: 'arrival' | 'departure', data: Partial<TransportLeg>) => void;
    updateMeals: (data: Partial<MealsState>) => void;
    updateTraining: (data: Partial<TrainingState>) => void;
    updateBilling: (data: Partial<BillingState>) => void;
    updatePricing: (data: DeepPartial<PricingConfig>) => void;
    setAgreedToTerms: (val: boolean) => void;
    submitReservation: () => void;
    reset: () => void;
    getEstimatedCosts: () => CostBreakdown;
    isStepValid: (step: string) => boolean;
    getStepErrors: (step: string) => string[];
    loadDelegation: (delegation: any) => void;
}

export const useDelegationStore = create<DelegationStore>()(
    persist(
        (set, get) => ({
            basics: {
                federation: 'Czech Handball Federation',
                country_code: 'CZE',
                teamName: '',
                contactPerson: '',
                email: '',
                phone: '',
                headCount: { players: 0, staff: 0, total: 0 },
                dates: { arrival: '', departure: '' },
            },
            accommodation: [],
            transport: {
                arrival: { type: null, date: '', time: '', location: '', flightNumber: '', persons: 0, airportTransfer: false },
                departure: { type: null, date: '', time: '', location: '', persons: 0, airportTransfer: false },
            },
            meals: {
                plan: 'half_board',
                dietary: { vegetarian: 0, vegan: 0, glutenFree: 0, other: '' },
                addons: { lunchPackage: false, hotLunch: false },
            },
            training: {
                sessions: []
            },
            billing: {
                companyName: '',
                address: '',
                city: '',
                postalCode: '',
                country: '',
                vatNumber: '',
                billingEmail: ''
            },
            pricing: INITIAL_PRICING,
            agreedToTerms: false,
            status: 'draft',
            isLoading: false,
            error: null,

            updateBasics: (data) => set((state) => {
                const nextBasics = { ...state.basics, ...data };

                // Enforce headcount limits
                if (data.headCount) {
                    const players = Math.min(data.headCount.players || 0, 14);
                    const staff = Math.min(data.headCount.staff || 0, 5);
                    const total = Math.min(players + staff, 19);
                    nextBasics.headCount = { players, staff, total };
                }

                // Sync Billing Country with Team Country_code
                const nextBilling = { ...state.billing };
                if (data.country_code) {
                    nextBilling.country = data.country_code;
                }

                return {
                    basics: nextBasics,
                    billing: nextBilling
                };
            }),

            setAccommodation: (data) => set({ accommodation: data }),

            updateTransport: (leg, data) => set((state) => {
                const nextTransport = {
                    ...state.transport,
                    [leg]: { ...state.transport[leg], ...data }
                };

                // If Arrival Type OR Location changed, sync to Departure
                if (leg === 'arrival') {
                    if (data.type !== undefined) {
                        nextTransport.departure.type = data.type;
                    }
                    if (data.location !== undefined) {
                        nextTransport.departure.location = data.location;
                    }
                    if (data.airportTransfer !== undefined) {
                        nextTransport.departure.airportTransfer = data.airportTransfer;
                    }
                } else if (leg === 'departure') {
                    // For departure, only date/time/persons should really change from UI if synced,
                    // but we keep the flexibility while ensuring location/type stay locked if derived from arrival.
                    // The UI will handle the locking, but we can enforce it here too.
                    nextTransport.departure.type = state.transport.arrival.type;
                    nextTransport.departure.location = state.transport.arrival.location;
                    nextTransport.departure.airportTransfer = state.transport.arrival.airportTransfer;
                    // Merge in the allowed changes (date, time, persons, flightNumber)
                    if (data.date !== undefined) nextTransport.departure.date = data.date;
                    if (data.time !== undefined) nextTransport.departure.time = data.time;
                    if (data.persons !== undefined) nextTransport.departure.persons = data.persons;
                    if (data.flightNumber !== undefined) nextTransport.departure.flightNumber = data.flightNumber;
                }

                return { transport: nextTransport };
            }),

            updateMeals: (data) => set((state) => ({
                meals: { ...state.meals, ...data, plan: 'half_board' } // Enforce Half Board
            })),

            updateTraining: (data) => set((state) => ({
                training: { ...state.training, ...data }
            })),

            updateBilling: (data) => set((state) => ({
                billing: { ...state.billing, ...data }
            })),

            updatePricing: (data) => set((state) => {
                // Deep merge for pricing
                const newPricing = { ...state.pricing };
                if (data.accommodation) newPricing.accommodation = { ...newPricing.accommodation, ...(data.accommodation as any) };
                if (data.catering) newPricing.catering = { ...newPricing.catering, ...data.catering };
                if (data.transport) newPricing.transport = { ...newPricing.transport, ...(data.transport as any) };
                if (data.training) newPricing.training = { ...newPricing.training, ...data.training };
                if (data.accreditation !== undefined) newPricing.accreditation = data.accreditation;
                return { pricing: newPricing };
            }),

            setAgreedToTerms: (val) => set({ agreedToTerms: val }),

            submitReservation: async () => {
                const state = get();
                const { basics } = state;

                set({ isLoading: true, error: null });
                try {
                    console.log('Attempting to submit delegation:', {
                        team_name: basics.teamName,
                        federation: basics.federation,
                        country_code: basics.country_code,
                        arrival_date: basics.dates.arrival,
                        departure_date: basics.dates.departure
                    });


                    // Save full accommodation details including Hotel names
                    // This allows the admin to know WHICH hotel the delegation requested
                    const accommodationRequest = state.accommodation.map(block => ({
                        hotel: block.hotel,
                        checkIn: block.checkIn,
                        checkOut: block.checkOut,
                        rooms: block.rooms
                    }));


                    // Calculate totals for DB storage
                    const required_singles = state.accommodation.reduce((sum, block) =>
                        sum + (block.rooms || []).filter(r => r.capacity === 1).reduce((s, r) => s + r.count, 0)
                        , 0);
                    const required_doubles = state.accommodation.reduce((sum, block) =>
                        sum + (block.rooms || []).filter(r => r.capacity === 2).reduce((s, r) => s + r.count, 0)
                        , 0);

                    const result = await delegationService.createDelegation({
                        team_name: basics.teamName,
                        federation: basics.federation,
                        country_code: basics.country_code,
                        contact_name: basics.contactPerson,
                        contact_email: basics.email,
                        contact_phone: basics.phone,
                        arrival_date: basics.dates.arrival,
                        departure_date: basics.dates.departure,
                        required_persons: basics.headCount.total,
                        required_players: basics.headCount.players,
                        required_staff: basics.headCount.staff,
                        required_singles,
                        required_doubles,

                        // Logistics
                        transport_arrival_type: state.transport.arrival.type,
                        transport_arrival_date: state.transport.arrival.date,
                        transport_arrival_time: state.transport.arrival.time,
                        transport_arrival_location: state.transport.arrival.location,
                        transport_arrival_flight: state.transport.arrival.flightNumber || null,
                        transport_arrival_persons: state.transport.arrival.persons,
                        transport_arrival_transfer: state.transport.arrival.airportTransfer || false,

                        transport_departure_type: state.transport.departure.type,
                        transport_departure_date: state.transport.departure.date,
                        transport_departure_time: state.transport.departure.time,
                        transport_departure_location: state.transport.departure.location,
                        transport_departure_flight: state.transport.departure.flightNumber || null,
                        transport_departure_persons: state.transport.departure.persons,
                        transport_departure_transfer: state.transport.departure.airportTransfer || false,

                        // Services
                        meal_plan: state.meals.plan,
                        dietary_vegetarian: state.meals.dietary.vegetarian,
                        dietary_vegan: state.meals.dietary.vegan,
                        dietary_gluten_free: state.meals.dietary.glutenFree,
                        dietary_other: state.meals.dietary.other || null,
                        addon_lunch_package: state.meals.addons.lunchPackage,
                        addon_hot_lunch: state.meals.addons.hotLunch,

                        training_sessions: state.training.sessions,

                        // Billing
                        billing_company: state.billing.companyName,
                        billing_address: state.billing.address,
                        billing_city: state.billing.city,
                        billing_postal: state.billing.postalCode,
                        billing_country: state.billing.country,
                        billing_vat: state.billing.vatNumber || null,
                        billing_email: state.billing.billingEmail,

                        accommodation_request: accommodationRequest
                    });


                    console.log('Submission successful:', result);
                    set({ status: 'submitted', isLoading: false, error: null });
                } catch (err: any) {
                    console.error('Submission error details:', err);
                    const errorMessage = err.message || (typeof err === 'string' ? err : 'Unknown submission error');
                    set({ error: errorMessage, isLoading: false, status: 'draft' });
                }
            },

            reset: () => set({
                basics: { federation: 'Czech Handball Federation', country_code: 'CZE', teamName: '', contactPerson: '', email: '', phone: '', headCount: { players: 0, staff: 0, total: 0 }, dates: { arrival: '', departure: '' } },
                accommodation: [],
                transport: { arrival: { type: null, date: '', time: '', location: '', persons: 0 }, departure: { type: null, date: '', time: '', location: '', persons: 0 } },
                meals: { plan: 'half_board', dietary: { vegetarian: 0, vegan: 0, glutenFree: 0, other: '' }, addons: { lunchPackage: false, hotLunch: false } },
                training: { sessions: [] },
                billing: { companyName: '', address: '', city: '', postalCode: '', country: '', vatNumber: '', billingEmail: '' },
                agreedToTerms: false,
                status: 'draft',
                isLoading: false,
                error: null,
                pricing: INITIAL_PRICING
            }),

            getEstimatedCosts: () => {
                const state = get();
                let accCost = 0;
                let mealsCost = 0;
                let transCost = 0;
                let trainingCost = 0;

                // 2. ACCOMMODATION CALCULATION
                // Formula: persons * price_per_person_per_night * number_of_nights
                // Actually, the PRICING_CONFIG for accommodation is usually per ROOM or per PERSON?
                // The prompt says: "Accommodation (EUR per person per night, per hotel & room type)"
                // But typically hotel prices are per room or per person.
                // Re-reading Schema: "persons × price_per_person_per_night × number_of_nights" is NOT correct if price is per ROOM type.
                // Wait, the Prompt says: "Accommodation (EUR per person per night, per hotel & room type)".
                // And Formula: "persons × price_per_person_per_night × number_of_nights".
                // BUT we have room composition inputs (Single, Double, Triple).
                // Usually "Single Room" price is for the whole room (1 person). "Double Room" price might be per person or per room.
                // Given "EUR per person per night", I will assume the config prices are PER PERSON.
                // So a Double Room @ 100 EUR means 100 EUR per person? Or 100 EUR for the room?
                // "per hotel & room type".
                // Let's assume the keys 'single', 'double', 'triple' in CONFIG are the Price Per Person Per Night for that category.
                // And the Store has `rooms: { single: X, double: Y, ... }`.
                // We don't strictly track "persons in single rooms", we track "number of single rooms".
                // A single room has 1 person. A double has 2. A triple has 3.
                // So Total Persons = (single*1) + (double*2) + (triple*3).
                // Cost = (single*1 * price_single) + (double*2 * price_double) + (triple*3 * price_triple) * nights.
                // Let's interpret the CONFIG values as "Price Per Person".

                state.accommodation.forEach(block => {
                    if (block.checkIn && block.checkOut) {
                        const d1 = parseISO(block.checkIn);
                        const d2 = parseISO(block.checkOut);
                        if (isValid(d1) && isValid(d2)) {
                            const nights = Math.max(0, differenceInDays(d2, d1));
                            const prices = state.pricing.accommodation[block.hotel as keyof typeof state.pricing.accommodation] || state.pricing.accommodation.default;

                            // Rooms * Capacity * Price per Person * Nights
                            if (Array.isArray(block.rooms)) {
                                block.rooms.forEach(room => {
                                    const pricePerPerson = prices[room.capacity] || prices[1] || 0;
                                    accCost += (room.count * room.capacity * pricePerPerson * nights);
                                });
                            }
                        }
                    }
                });

                // 3. CATERING CALCULATION
                // Formula: persons (Total Headcount) * price_per_person_per_day * number_of_days
                if (state.basics.headCount.total > 0 && state.basics.dates.arrival && state.basics.dates.departure) {
                    const d1 = parseISO(state.basics.dates.arrival);
                    const d2 = parseISO(state.basics.dates.departure);
                    if (isValid(d1) && isValid(d2)) {
                        // "Number of days". Usually includes departure day for food? Or nights?
                        // "Catering (EUR per person per day)".
                        // Usually catering is calculated by Days. differenceInDays gives nights.
                        // Let's assume inclusive of arrival, exclusive of departure? Or just nights + 1?
                        // Standard practice: Lunch/Dinner starts Arrival, Ends Departure.
                        // For simplicity in this "Estimation", let's use differenceInDays (Nights).
                        // Modification: If they arrive 14th and leave 16th, that's 2 nights. Days: 14, 15, 16?
                        // "Half board is mandatory".
                        // Let's stick to 'Nights' as the multiplier for now to match Accommodation logic, unless specified.
                        // Prompt says "number_of_days". I'll use `differenceInDays`.
                        const days = Math.max(0, differenceInDays(d2, d1));

                        const baseRate = state.pricing.catering[state.meals.plan as keyof typeof state.pricing.catering] || 0;
                        mealsCost += (baseRate * state.basics.headCount.total * days);

                        if (state.meals.addons?.lunchPackage) {
                            mealsCost += (state.pricing.catering.lunchPackage * state.basics.headCount.total * days);
                        }
                        if (state.meals.addons?.hotLunch) {
                            mealsCost += (state.pricing.catering.hotLunch * state.basics.headCount.total * days);
                        }
                    }
                }

                // 4. TRANSPORT CALCULATION
                // Formula: Flat fee per transfer leg if requested
                if (state.transport.arrival.type === 'plane' && state.transport.arrival.airportTransfer) {
                    const airportCode = state.transport.arrival.location || 'default';
                    const price = state.pricing.transport[airportCode as keyof typeof state.pricing.transport] || state.pricing.transport.default;
                    transCost += price;
                }
                if (state.transport.departure.type === 'plane' && state.transport.departure.airportTransfer) {
                    const airportCode = state.transport.departure.location || 'default';
                    const price = state.pricing.transport[airportCode as keyof typeof state.pricing.transport] || state.pricing.transport.default;
                    transCost += price;
                }

                // 5. PAID TRAINING SESSIONS
                // Formula: number_of_slots * price_per_slot
                state.training.sessions.forEach(session => {
                    // Filter for Oct 14/15 is done in UI/Validation, but strictly speaking checking here is good too?
                    // "Paid training sessions are available ONLY on: 14 Oct 2026, 15 Oct 2026"
                    // "Training sessions on other days are free and excluded from pricing"
                    if (session.date.includes('2026-10-14') || session.date.includes('2026-10-15')) {
                        trainingCost += (session.slots * state.pricing.training.slot);
                    }
                });

                const accreditationCost = (state.pricing.accreditation || 0) * state.basics.headCount.total;

                return {
                    accommodation: accCost,
                    meals: mealsCost,
                    transport: transCost,
                    training: trainingCost,
                    accreditation: accreditationCost,
                    total: accCost + mealsCost + transCost + trainingCost + accreditationCost
                };
            },

            isStepValid: (step) => {
                const state = get();
                switch (step) {
                    case 'basics':
                        return !!state.basics.teamName && !!state.basics.contactPerson && state.basics.headCount.players > 0 && state.basics.headCount.staff > 0;
                    case 'billing':
                        return !!state.billing.companyName &&
                            !!state.billing.address &&
                            !!state.billing.city &&
                            !!state.billing.postalCode &&
                            !!state.billing.country &&
                            !!state.billing.billingEmail;
                    // Training is optional
                    default:
                        return true;
                }
            },

            getStepErrors: (step) => {
                const state = get();
                const errors: string[] = [];

                if (step === 'basics') {
                    if (state.basics.headCount.players <= 0) errors.push("Number of Players is required");
                    if (state.basics.headCount.staff <= 0) errors.push("Number of Staff is required");
                }

                if (step === 'billing') {
                    if (!state.billing.companyName) errors.push("Company Name is required");
                    if (!state.billing.address) errors.push("Address is required");
                    if (!state.billing.city) errors.push("City is required");
                    if (!state.billing.postalCode) errors.push("Postal Code is required");
                    if (!state.billing.country) errors.push("Country is required");
                    if (!state.billing.billingEmail) errors.push("Billing Email is required");
                }

                return errors;
            },

            loadDelegation: (delegation: any) => {
                const req = delegation.accommodation_request || [];

                set({
                    basics: {
                        federation: delegation.federation || '',
                        country_code: delegation.country_code || '',
                        teamName: delegation.team_name || '',
                        contactPerson: delegation.contact_name || '',
                        email: delegation.contact_email || '',
                        phone: delegation.contact_phone || '',
                        headCount: {
                            players: delegation.required_players || 0,
                            staff: delegation.required_staff || 0,
                            total: delegation.required_persons || 0
                        },
                        dates: {
                            arrival: delegation.arrival_date || '',
                            departure: delegation.departure_date || ''
                        }
                    },
                    accommodation: Array.isArray(req) ? req : [],
                    transport: {
                        arrival: {
                            type: delegation.transport_arrival_type || null,
                            date: delegation.transport_arrival_date || '',
                            time: delegation.transport_arrival_time || '',
                            location: delegation.transport_arrival_location || '',
                            flightNumber: delegation.transport_arrival_flight || '',
                            persons: delegation.transport_arrival_persons || 0,
                            airportTransfer: delegation.transport_arrival_transfer || false
                        },
                        departure: {
                            type: delegation.transport_departure_type || null,
                            date: delegation.transport_departure_date || '',
                            time: delegation.transport_departure_time || '',
                            location: delegation.transport_departure_location || '',
                            flightNumber: delegation.transport_departure_flight || '',
                            persons: delegation.transport_departure_persons || 0,
                            airportTransfer: delegation.transport_departure_transfer || false
                        }
                    },
                    meals: {
                        plan: (delegation.meal_plan as any) || 'half_board',
                        dietary: {
                            vegetarian: delegation.dietary_vegetarian || 0,
                            vegan: delegation.dietary_vegan || 0,
                            glutenFree: delegation.dietary_gluten_free || 0,
                            other: delegation.dietary_other || ''
                        },
                        addons: {
                            lunchPackage: delegation.addon_lunch_package || false,
                            hotLunch: delegation.addon_hot_lunch || false
                        }
                    },
                    training: { sessions: delegation.training_sessions || [] },
                    billing: {
                        companyName: delegation.billing_company || '',
                        address: delegation.billing_address || '',
                        city: delegation.billing_city || '',
                        postalCode: delegation.billing_postal || '',
                        country: delegation.billing_country || delegation.country_code || '',
                        vatNumber: delegation.billing_vat || '',
                        billingEmail: delegation.billing_email || delegation.contact_email || ''
                    },
                    status: delegation.status || 'draft',
                    agreedToTerms: true // Assuming if submitted/stored, they agreed
                });
            }
        }),
        {
            name: 'sem-delegation-wizard-v2'
        }
    )
);
