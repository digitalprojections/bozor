import { Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface FreeShippingBadgeProps {
    className?: string;
    compact?: boolean;
}

export function FreeShippingBadge({
    className,
    compact = false,
}: FreeShippingBadgeProps) {
    const { t } = useTranslations();

    return (
        <Badge
            className={cn(
                'border-emerald-200 bg-emerald-500 text-white shadow-sm hover:bg-emerald-500',
                compact ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-xs',
                className,
            )}
        >
            <Truck className="h-3 w-3" />
            {t('listing.shipping.free_shipping')}
        </Badge>
    );
}
