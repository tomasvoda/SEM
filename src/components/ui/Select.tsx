import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder = "Select...", className, disabled = false }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const openUp = spaceBelow < 250;

                setDropdownStyles({
                    position: 'fixed',
                    top: openUp ? 'auto' : `${rect.bottom + 8}px`,
                    bottom: openUp ? `${window.innerHeight - rect.top + 8}px` : 'auto',
                    left: `${rect.left}px`,
                    width: `${rect.width}px`,
                    zIndex: 9999, // Ensure it's on top of everything
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Also check if clicking inside the portal
                const portal = document.getElementById('select-portal-root');
                if (portal && !portal.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
        >
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-between w-full px-3 h-[46px] bg-[var(--glass-surface)] border rounded-xl text-left transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 flex-shrink-0",
                    isOpen ? "border-brand-500 ring-2 ring-brand-500/10" : "border-[var(--glass-border)] hover:border-brand-500/50",
                    disabled && "opacity-50 cursor-not-allowed bg-[var(--glass-border)]/50",
                    !value && "text-[var(--text-muted)]"
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 text-[var(--text-muted)] transition-transform duration-200",
                    isOpen && "transform rotate-180"
                )} />
            </button>

            {isOpen && createPortal(
                <div
                    style={dropdownStyles}
                    className={cn(
                        "overflow-hidden bg-[var(--app-bg)]/95 backdrop-blur-2xl border border-[var(--glass-border)] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    )}
                >
                    <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={value === option.value}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent immediate closing if logic conflicts
                                    handleSelect(option.value);
                                }}
                                className={cn(
                                    "px-3 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors",
                                    value === option.value
                                        ? "bg-brand-500/20 text-brand-500 font-bold"
                                        : "text-[var(--text-secondary)] hover:bg-brand-500/10 hover:text-brand-500"
                                )}
                            >
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-brand-500" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
}
