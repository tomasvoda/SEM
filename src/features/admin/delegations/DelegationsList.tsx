import { useAdminStore } from '../../../store/adminStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Users, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DelegationListCard } from '../components/DelegationListCard';

export function DelegationsList() {
    const { delegations } = useAdminStore();

    // Remove any delete logic unless we have a deleteDelegation function in store -> we don't seem to have one exposed in types/admin? 
    // Usually delegations are not deleted lightly. 
    // I will skip Delete button for now to be safe, or just list them.

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Admin', path: '/admin/dashboard' },
                        { label: 'Delegations' }
                    ]}
                />

                <div className="flex justify-between items-end">
                    <div className="text-left">
                        <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Delegations</h1>
                        <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Manage participating teams</p>
                    </div>
                    <Link
                        to="/admin/delegations/new"
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Delegation
                    </Link>
                </div>
            </div>

            {delegations.length === 0 ? (
                <GlassCard className="p-20 text-center border-dashed border-2">
                    <Users className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">No Delegations Found</h3>
                    <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8 font-medium">
                        Delegations will appear here once they register or are added.
                    </p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {delegations.map((delegation) => {
                        const arrivalDate = delegation.transport_arrival_date ? format(parseISO(delegation.transport_arrival_date), 'dd MMM') :
                            (delegation.arrival_date ? format(parseISO(delegation.arrival_date), 'dd MMM') : '-');

                        const departureDate = delegation.transport_departure_date ? format(parseISO(delegation.transport_departure_date), 'dd MMM') :
                            (delegation.departure_date ? format(parseISO(delegation.departure_date), 'dd MMM') : '-');

                        return (
                            <Link
                                key={delegation.id}
                                to={`/admin/delegations/${delegation.id}`}
                                className="block"
                            >
                                <DelegationListCard
                                    countryName={delegation.team_name || 'N/A'}
                                    countryCode={delegation.country_code || '??'}
                                    arrivalDate={arrivalDate}
                                    arrivalTime={delegation.transport_arrival_time || 'N/A'}
                                    arrivalPersons={delegation.transport_arrival_persons}
                                    arrivalTransportReq={delegation.transport_arrival_transfer}
                                    departureDate={departureDate}
                                    departureTime={delegation.transport_departure_time || 'N/A'}
                                    departurePersons={delegation.transport_departure_persons}
                                    departureTransportReq={delegation.transport_departure_transfer}
                                    transportType={delegation.transport_arrival_type as any || 'plane'}
                                    persons={delegation.required_persons || 0}
                                    singles={delegation.required_singles || 0}
                                    doubles={delegation.required_doubles || 0}
                                    cateringType={delegation.addon_hot_lunch ? 'hot_lunch' : (delegation.addon_lunch_package ? 'lunch_package' : 'none')}
                                    trainingCount={Array.isArray(delegation.training_sessions) ? delegation.training_sessions.length : 0}
                                    status={delegation.status as any}
                                />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
