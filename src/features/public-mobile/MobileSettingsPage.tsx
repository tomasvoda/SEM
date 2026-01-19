import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import i18n from '../../i18n';
import { useState } from 'react';

const languages = [
    { code: 'system', labelKey: 'language.system', icon: Globe },
    { code: 'en', labelKey: 'language.en', icon: null },
    { code: 'cs', labelKey: 'language.cs', icon: null },
    { code: 'nl', labelKey: 'language.nl', icon: null },
    { code: 'de', labelKey: 'language.de', icon: null },
    { code: 'fr', labelKey: 'language.fr', icon: null }
];

const themes = [
    { value: 'system', labelKey: 'theme.system', icon: Monitor },
    { value: 'light', labelKey: 'theme.light', icon: Sun },
    { value: 'dark', labelKey: 'theme.dark', icon: Moon }
];

export function MobileSettingsPage() {
    const { t } = useTranslation('settings');
    const { theme, setTheme } = useThemeStore();
    const [currentLang, setCurrentLang] = useState(i18n.language);

    const handleLanguageChange = (langCode: string) => {
        if (langCode === 'system') {
            const browserLang = navigator.language.split('-')[0];
            const supportedLang = ['en', 'cs', 'nl', 'de', 'fr'].includes(browserLang) ? browserLang : 'en';
            i18n.changeLanguage(supportedLang);
            localStorage.removeItem('i18n-language');
        } else {
            i18n.changeLanguage(langCode);
        }
        setCurrentLang(langCode);
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
                {t('title')}
            </h1>

            <div className="space-y-6">
                {/* Theme */}
                <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">
                        {t('sections.appearance.title')}
                    </h2>
                    <div className="glass-panel rounded-2xl p-4">
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                            {t('sections.appearance.theme')}
                        </p>
                        <div className="space-y-2">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                return (
                                    <button
                                        key={themeOption.value}
                                        onClick={() => setTheme(themeOption.value as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${theme === themeOption.value
                                                ? 'bg-brand-500/10 border-2 border-brand-500/30 text-brand-500'
                                                : 'bg-white/5 border-2 border-transparent text-[var(--text-secondary)] hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{t(themeOption.labelKey)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">
                        {t('sections.language.title')}
                    </h2>
                    <div className="glass-panel rounded-2xl p-4">
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                            {t('sections.language.select')}
                        </p>
                        <div className="space-y-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentLang === lang.code || (currentLang.startsWith(lang.code) && lang.code !== 'system')
                                        ? 'bg-brand-500/10 border-2 border-brand-500/30 text-brand-500'
                                        : 'bg-white/5 border-2 border-transparent text-[var(--text-secondary)] hover:bg-white/10'
                                        }`}
                                >
                                    {lang.icon && <lang.icon className="w-5 h-5" />}
                                    {!lang.icon && <Globe className="w-5 h-5 opacity-50" />}
                                    <span className="text-sm font-medium">{t(lang.labelKey)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* About */}
                <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">
                        {t('sections.about.title')}
                    </h2>
                    <div className="glass-panel rounded-2xl p-4">
                        <p className="text-xs text-[var(--text-muted)]">
                            {t('sections.about.version')}: 1.0.0
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                            {t('sections.about.copyright')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
