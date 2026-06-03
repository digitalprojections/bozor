import { UserAvatar } from '@/components/user-avatar';
import { Star } from 'lucide-react';
import type { User } from '@/types';
import { formatRating } from '@/lib/format';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    return (
        <>
            <UserAvatar user={user} className="h-8 w-8 shrink-0" mascotSize={30} />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{user.masked_name || user.name}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span className="text-[10px] font-bold">{formatRating(user.average_rating)}</span>
                        <span className="text-[10px] text-muted-foreground ml-0.5">({user.ratings_count || 0})</span>
                    </div>
                </div>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
