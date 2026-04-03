import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface UserRatingBadgeProps {
    user: {
        id: number;
        name: string;
        masked_name?: string;
        avatar_url?: string;
        average_rating?: number;
        ratings_count?: number;
    };
    variant?: 'compact' | 'standard' | 'full';
    className?: string;
}

export function UserRatingBadge({ user, variant = 'standard', className }: UserRatingBadgeProps) {
    const getInitials = useInitials();
    const rating = Math.round(user.average_rating || 0);

    if (variant === 'compact') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="text-[10px]">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                    {user.masked_name || user.name}
                </span>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar className={cn(
                "border border-[#e1e9f2] shrink-0",
                variant === 'full' ? "h-11 w-11" : "h-9 w-9"
            )}>
                <AvatarImage src={user.avatar_url} alt={user.name} className="object-cover" />
                <AvatarFallback className="bg-[#d3e0f0] text-[#3a5670] font-semibold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <div className={cn(
                    "font-bold text-[#0b1b32] truncate",
                    variant === 'full' ? "text-base" : "text-sm"
                )}>
                    <Link href={`/users/${user.id}`} className="hover:text-[#0d9488] transition-colors">
                        {user.masked_name || user.name}
                    </Link>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={variant === 'full' ? 12 : 10}
                                className={cn(
                                    "transition-colors",
                                    star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                )}
                            />
                        ))}
                    </div>
                    {user.ratings_count !== undefined && (
                        <span className="text-[10px] sm:text-xs text-[#0d9488] font-medium">
                            ({user.ratings_count})
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
