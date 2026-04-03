import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
    price: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function PriceDisplay({ price, className, size = 'md' }: PriceDisplayProps) {
    const formattedPrice = `¥${price.toLocaleString()}`;

    const sizeClasses = {
        sm: 'text-sm font-semibold',
        md: 'text-lg font-bold',
        lg: 'text-2xl font-black text-[#0e1d38]',
        xl: 'text-3xl sm:text-4xl font-black text-[#101b2d]'
    };

    return (
        <div className={cn(sizeClasses[size], "tracking-tighter", className)}>
            {formattedPrice}
        </div>
    );
}
