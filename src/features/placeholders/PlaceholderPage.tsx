import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';

interface PlaceholderPageProps {
    title: string;
    subtitle?: string;
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader title={title} subtitle={subtitle} />
            <GlassCard className="min-h-[400px] flex items-center justify-center border-dashed border-2 border-[var(--color-glass-border)] bg-transparent">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                        <span className="text-3xl">🚧</span>
                    </div>
                    <h3 className="text-xl font-medium text-[var(--text-primary)]">Aktuálně tento modul připravujeme</h3>
                    <p className="text-[var(--text-muted)] mt-2">Bude brzy k dispozici.</p>
                </div>
            </GlassCard>
        </div>
    );
}
