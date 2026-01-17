import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';
import { Monitor, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SettingsPage() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                subtitle="Configure tournament parameters and system options"
                breadcrumbs={[
                    { label: 'Admin', href: '/admin/dashboard' },
                    { label: 'Settings' }
                ]}
            />

            <div className="grid gap-6 max-w-2xl text-[var(--text-primary)]">
                <GlassCard>
                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-[var(--text-secondary)]">
                            Customize how the application looks on your device.
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            {/* SYSTEM */}
                            <button
                                onClick={() => setTheme('system')}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                                    theme === 'system'
                                        ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/50"
                                        : "border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                <Monitor className="h-6 w-6" />
                                <span className="text-sm font-medium">System</span>
                            </button>

                            {/* LIGHT */}
                            <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                                    theme === 'light'
                                        ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/50"
                                        : "border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                <Sun className="h-6 w-6" />
                                <span className="text-sm font-medium">Light</span>
                            </button>

                            {/* DARK */}
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                                    theme === 'dark'
                                        ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/50"
                                        : "border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                <Moon className="h-6 w-6" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
