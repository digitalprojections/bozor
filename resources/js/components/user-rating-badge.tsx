import React from 'react';
import { Star } from 'lucide-react';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { roundedRating } from '@/lib/format';

interface UserRatingBadgeProps {
    user: {
        id: number;
        name: string;
        masked_name?: string;
        avatar_url?: string;
        avatar_source?: 'uploaded' | 'mascot' | 'generated' | 'google';
        avatar_seed?: string;
        average_rating?: number | string;
        ratings_count?: number;
    };
    variant?: 'compact' | 'standard' | 'full';
    className?: string;
}

export function UserRatingBadge({ user, variant = 'standard', className }: UserRatingBadgeProps) {
    const rating = roundedRating(user.average_rating);

    if (variant === 'compact') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <UserAvatar user={user} className="h-6 w-6" fallbackClassName="text-[10px]" mascotSize={22} />
                <span className="text-xs text-muted-foreground truncate">
                    {user.masked_name || user.name}
                </span>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <UserAvatar
                user={user}
                className={cn(
                    "border border-[#e1e9f2] shrink-0",
                    variant === 'full' ? "h-11 w-11" : "h-9 w-9"
                )}
                imageClassName="object-cover"
                fallbackClassName="bg-[#d3e0f0] text-[#3a5670] font-semibold"
                mascotSize={variant === 'full' ? 40 : 34}
            />
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
