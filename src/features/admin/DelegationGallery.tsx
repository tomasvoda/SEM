import { DelegationListCard } from './components/DelegationListCard';
import { DelegationDetailCard } from './components/DelegationDetailCard';

export function DelegationGallery() {
    const mockDelegations = [
        {
            countryName: 'Czech Republic',
            countryCode: 'CZE',
            arrivalDate: '14 Oct',
            arrivalTime: '14:20',
            departureDate: '25 Oct',
            departureTime: '10:00',
            persons: 18,
            singles: 4,
            doubles: 7,
            cateringType: 'hot_lunch' as const,
            transportRequested: true,
            trainingCount: 12,
            status: 'approved' as const
        },
        {
            countryName: 'Netherlands',
            countryCode: 'NED',
            arrivalDate: '13 Oct',
            arrivalTime: '18:45',
            departureDate: '25 Oct',
            departureTime: '09:30',
            persons: 22,
            singles: 6,
            doubles: 8,
            cateringType: 'lunch_package' as const,
            transportRequested: true,
            trainingCount: 15,
            status: 'submitted' as const
        },
        {
            countryName: 'Belgium',
            countryCode: 'BEL',
            arrivalDate: '14 Oct',
            arrivalTime: '11:00',
            departureDate: '24 Oct',
            departureTime: '14:00',
            persons: 15,
            singles: 3,
            doubles: 6,
            cateringType: 'none' as const,
            transportRequested: false,
            trainingCount: 8,
            status: 'draft' as const
        }
    ];

    const detailMock = {
        countryName: 'Czech Republic',
        countryCode: 'CZE',
        federation: 'Czech Korfball Association',
        contactPerson: 'Jan Novák',
        contactEmail: 'jan.novak@korfbal.cz',
        contactPhone: '+420 777 123 456',
        arrivalDate: '2026-10-12',
        departureDate: '2026-10-20',
        persons: 18,
        singles: 4,
        doubles: 7,
        catering: 'half_board',
        billingName: 'Czech Korfball Association z.s.',
        billingAddress: 'Zátopkova 100/2, 169 00 Praha 6',
        status: 'approved' as const
    };

    return (
        <div className="p-8 space-y-16 bg-[var(--app-bg)] min-h-screen">
            <section className="space-y-6">
                <h2 className="text-2xl font-black text-brand-500 uppercase tracking-widest border-b border-brand-500/20 pb-4">
                    Redesigned List Cards (Calm Admin Style)
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    {mockDelegations.map((d, i) => (
                        <DelegationListCard
                            key={i}
                            {...d}
                            onViewDetails={() => console.log('View details', d.countryName)}
                        />
                    ))}
                </div>
            </section>


            <section className="space-y-6">
                <h2 className="text-2xl font-black text-brand-500 uppercase tracking-widest border-b border-brand-500/20 pb-4">
                    Delegation Detail (Edit Mode Enabled)
                </h2>
                <DelegationDetailCard
                    initialData={detailMock}
                    onSave={(data: any) => console.log('Saved', data)}
                />
            </section>
        </div>
    );
}
