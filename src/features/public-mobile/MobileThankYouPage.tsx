import { useTranslation } from 'react-i18next';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMobileStore } from '../../store/mobileStore';

export function MobileThankYouPage() {
    const { t } = useTranslation('signup');
    const { volunteerApplication } = useMobileStore();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">
                    {t('thankYou.title')}
                </h1>

                {/* Message */}
                <div className="glass-panel rounded-2xl p-6">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                        {t('thankYou.message')}
                    </p>
                    {volunteerApplication?.email && (
                        <p className="text-xs text-[var(--text-muted)]">
                            {t('thankYou.email')} <span className="text-brand-500 font-bold">{volunteerApplication.email}</span>
                        </p>
                    )}
                </div>

                {/* Next Steps */}
                <div className="glass-panel rounded-2xl p-6 text-left">
                    <h2 className="text-sm font-black uppercase tracking-wide text-brand-500 mb-4">
                        {t('thankYou.next')}
                    </h2>
                    <ul className="space-y-3">
                        {(t('thankYou.steps', { returnObjects: true }) as string[]).map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <span className="text-brand-500 font-bold">{i + 1}.</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Back to Home */}
                <Link
                    to="/mobile/home"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-brand-500 text-white rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all"
                >
                    {t('thankYou.backHome')}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
