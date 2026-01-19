import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogoEM: React.FC = () => {
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Short delay for the animation to play before navigation
        setTimeout(() => {
            navigate('/');
            setIsAnimating(false);
        }, 400);
    };

    return (
        <div
            onClick={handleClick}
            className="group cursor-pointer flex items-center justify-center relative select-none"
            style={{
                width: '56px',
                height: '56px'
            }}
            role="button"
            aria-label="Return to Dashboard"
        >
            {/* Fixed Logo Container - 56x56px for premium feel */}
            <div className="relative flex items-center justify-center w-full h-full">
                {/* SVG Symbol - Increased from 40px to 44.8px (~12% larger) */}
                <svg
                    width="45"
                    height="45"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible transition-all duration-300 group-hover:scale-105"
                    style={{
                        // Optical centering - slight adjustment for visual balance
                        transform: 'translateX(-0.5px)'
                    }}
                >
                    {/* Enhanced Glow Filter for premium feel */}
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <g
                        filter="url(#glow)"
                        className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    >
                        {/* Abstract E - 3 Horizontal Lines */}
                        <g className={`transition-all duration-[400ms] ease-out ${isAnimating ? 'translate-y-[-2px]' : ''}`}>
                            <rect
                                x="8" y="12" width="10" height="3" rx="1.5"
                                className={`fill-brand-500 transition-all duration-300 group-hover:fill-brand-400 ${isAnimating ? 'translate-y-[-2px]' : ''}`}
                            />
                            <rect
                                x="8" y="18.5" width="10" height="3" rx="1.5"
                                className="fill-brand-500 transition-all duration-300 group-hover:fill-brand-400"
                            />
                            <rect
                                x="8" y="25" width="10" height="3" rx="1.5"
                                className={`fill-brand-500 transition-all duration-300 group-hover:fill-brand-400 ${isAnimating ? 'translate-y-[2px]' : ''}`}
                            />
                        </g>

                        {/* Abstract M - 2 Vertical Pillars */}
                        <g className={`transition-all duration-[400ms] ease-out ${isAnimating ? 'translate-x-[2px]' : ''}`}>
                            <rect
                                x="22" y="12" width="3" height="16" rx="1.5"
                                className={`fill-brand-500 transition-all duration-300 group-hover:fill-brand-400 ${isAnimating ? 'translate-x-[-2px]' : ''}`}
                            />
                            <rect
                                x="29" y="12" width="3" height="16" rx="1.5"
                                className={`fill-brand-500 transition-all duration-300 group-hover:fill-brand-400 ${isAnimating ? 'translate-x-[2px]' : ''}`}
                            />
                        </g>
                    </g>
                </svg>

                {/* Premium hover effect - subtle background glow */}
                <div
                    className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                        // Respect user's motion preferences
                        transitionDuration: 'var(--transition-duration, 300ms)'
                    }}
                />
            </div>
        </div>
    );
};
