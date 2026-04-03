import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface SoldBadgeProps {
    variant?: 'overlay' | 'standard';
    className?: string;
}

export function SoldBadge({ variant = 'standard', className }: SoldBadgeProps) {
    const { t } = useTranslations();

    if (variant === 'overlay') {
        return (
            <div className={cn("absolute inset-0 flex items-center justify-center bg-black/20 z-10", className)}>
                <Badge className="bg-[#b91c1c] text-white hover:bg-[#b91c1c] font-black text-sm px-4 py-1.5 uppercase tracking-widest shadow-lg border-none -rotate-12 scale-110">
                    {t('dashboard.status.sold')}
                </Badge>
            </div>
        );
    }

    return (
        <Badge 
            variant="destructive" 
            className={cn(
                "bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fee2e2] border-none font-bold uppercase tracking-wide", 
                className
            )}
        >
            {t('dashboard.status.sold')}
        </Badge>
    );
}
