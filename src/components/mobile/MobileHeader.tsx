import { Menu, Phone, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LogoEM } from '../ui/LogoEM';

export function MobileHeader() {
    const { t } = useTranslation('common');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40">
            <div className="mobile-header-bar px-4 pb-1.5 pt-[calc(0.375rem+env(safe-area-inset-top))]">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="scale-75 origin-left">
                            <LogoEM />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">
                                {t('footer.event')} <span className="text-[var(--text-muted)] font-normal">| {t('footer.country')}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Menu trigger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        aria-label="Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Dropdown menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu panel */}
                    <div className="absolute top-full right-0 mt-1 mr-4 w-56 glass-panel rounded-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2">
                            <Link
                                to="/mobile/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-xl hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {t('navigation.contact')}
                            </Link>
                            <Link
                                to="/mobile/settings"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-xl hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <SettingsIcon className="w-4 h-4" />
                                {t('navigation.settings')}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
