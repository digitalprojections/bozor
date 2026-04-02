import { BadgeCheck } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';

interface VerifiedBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showTooltip?: boolean;
}

export function VerifiedBadge({ size = 'md', className, showTooltip = true }: VerifiedBadgeProps) {
    const { t } = useTranslations();

    const sizeClasses = {
        sm: 'size-3',
        md: 'size-4',
        lg: 'size-5',
    };

    const badge = (
        <BadgeCheck
            className={cn(
                'text-blue-500 fill-blue-100 dark:fill-blue-900',
                sizeClasses[size],
                className
            )}
        />
    );

    if (!showTooltip) {
        return badge;
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {badge}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('verification.badge.tooltip')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
