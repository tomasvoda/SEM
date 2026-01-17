import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDelegationStore } from '../../../store/delegationStore';
import { useAdminStore } from '../../../store/adminStore';
import { DelegationLayout } from '../../delegation/DelegationLayout';
import { ArrowLeft } from 'lucide-react';

export function AdminDelegationWizard() {
    const { id } = useParams<{ id: string }>();
    const { reset, loadDelegation } = useDelegationStore();
    const { delegations } = useAdminStore();

    useEffect(() => {
        if (id) {
            const delegation = delegations.find(d => d.id === id);
            if (delegation) {
                loadDelegation(delegation);
            }
        } else {
            // Reset store on mount for a fresh creation process
            reset();
        }
    }, [id, reset, loadDelegation, delegations]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <Link to="/admin/delegations" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Delegations</span>
                </Link>
            </div>

            <DelegationLayout />
        </div>
    );
}
