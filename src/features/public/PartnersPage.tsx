import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { ExternalLink, Building2 } from 'lucide-react';

interface Partner {
    name: string;
    description?: string;
    url: string;
    type: 'gold' | 'silver' | 'bronze' | 'institutional';
    logo?: string;
    scale?: string;
}

const PARTNERS: Partner[] = [
    {
        name: 'IKF',
        url: 'https://korfball.sport/',
        type: 'gold',
        logo: '/partners/ikf.png'
    },
    {
        name: 'ČT4 Sport',
        url: 'https://www.ceskatelevize.cz/sport/',
        type: 'institutional',
        logo: '/partners/ct4_sport.jpg'
    },
    {
        name: 'AXIWI',
        url: 'https://www.axiwi.com/',
        type: 'silver',
        logo: '/partners/axiwi.png'
    },
    {
        name: 'Národní sportovní agentura',
        url: 'https://agenturasport.cz/',
        type: 'institutional',
        logo: '/partners/nsa_official.png'
    },
    {
        name: 'Olomoucký kraj',
        url: 'https://www.olkraj.cz/',
        type: 'institutional',
        logo: '/partners/olkraj_color.jpg',
        scale: 'scale-[1.2]'
    },
    {
        name: 'Zlínský kraj',
        url: 'https://www.kr-zlinsky.cz/',
        type: 'institutional',
        logo: '/partners/zlinsky_official.png'
    },
    {
        name: 'Město Prostějov',
        url: 'https://www.prostejov.eu/',
        type: 'institutional',
        logo: '/partners/prostejov_color.png'
    },
    {
        name: 'Město Zlín',
        url: 'https://www.zlin.eu/',
        type: 'institutional',
        logo: '/partners/zlin.svg'
    },
    {
        name: 'Město Otrokovice',
        url: 'https://www.otrokovice.cz/',
        type: 'institutional',
        logo: '/partners/otrokovice.png',
        scale: 'scale-[1.2]'
    },
    {
        name: 'ČUKIS',
        url: 'https://cukis.cz',
        type: 'institutional',
        logo: '/partners/cukis.png'
    },
    {
        name: 'MIKASA',
        url: 'https://mikasasports.eu/',
        type: 'silver',
        logo: '/partners/mikasa.png'
    }
];

export function PartnersPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <PageHeader
                title="Partners"
                subtitle="We thank our partners for their support"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Partners' }
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {PARTNERS.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                    >
                        <GlassCard className="h-64 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:bg-white/[0.05] group-hover:scale-[1.02] border-white/5 relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/0 via-brand-500/0 to-brand-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                            <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full">
                                <div className="max-w-full h-32 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 border border-white/5 group-hover:border-white/10 overflow-hidden w-fit px-1">
                                    {partner.logo ? (
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className={`max-h-full w-auto object-contain ${partner.scale || 'scale-[1.05]'} filter grayscale invert brightness-[2] opacity-60 group-hover:grayscale-0 group-hover:invert-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500`}
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    target.style.display = 'none';
                                                    const icon = document.createElement('div');
                                                    icon.className = "text-[var(--text-muted)] opacity-50 px-8 py-4";
                                                    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
                                                    parent.appendChild(icon);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-[var(--text-muted)] opacity-50 px-8 py-4" />
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                                        {partner.name}
                                    </h3>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] group-hover:text-brand-400 transition-colors uppercase tracking-wider">
                                        Visit Website <ExternalLink className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    </a>
                ))}
            </div>

            <GlassCard className="p-8 mt-12 text-center bg-gradient-to-b from-transparent to-[var(--glass-surface)]">
                <div className="max-w-2xl mx-auto space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Become a Partner</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Join us in supporting the European Korfball Championship 2026.
                        For partnership opportunities, please look at the contact section.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
