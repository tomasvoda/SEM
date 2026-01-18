import { Bell, Settings, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export function TopBar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const logout = useAuthStore((state) => state.logout);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 w-full h-12 flex items-center justify-between px-6 border-b-0 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/[0.03] to-white/[0.005] backdrop-blur-xl transition-all duration-300">
            {/* Glass strip background removed in favor of direct styling */}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src="/korfby.jpg"
                        alt="Korfby"
                        className="w-8 h-8 rounded-full object-cover border border-white/10 shadow-sm"
                    />
                    <h2 className="text-xs font-medium text-[var(--text-secondary)] tracking-widest uppercase opacity-80">
                        European Korfball Championship 2026 <span className="mx-2 opacity-30">|</span> Czechia
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <IconButton
                        icon={Bell}
                        variant="ghost"
                        label="Notifications"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_var(--color-emerald-500)] pointer-events-none"></span>

                    {isNotificationsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 glass-panel rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-emerald-500/10 flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Status: Normal</h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            Nothing is urgent, no specific attention needed. You can continue working safely.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-white/10 mx-2" />

                {/* User Menu Trigger */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[var(--glass-highlight)] transition-all duration-300 group"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-white/10">
                            AD
                        </div>
                        <ChevronDown className={cn("h-3 w-3 text-[var(--text-muted)] transition-transform duration-300", isUserMenuOpen && "rotate-180")} />
                    </button>

                    {/* Popover Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-2xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-white/5">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">Admin User</p>
                                <p className="text-xs text-[var(--text-muted)]">admin@sem.com</p>
                            </div>

                            <div className="p-1">
                                <Link
                                    to="/settings"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] rounded-xl hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Appearance
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
