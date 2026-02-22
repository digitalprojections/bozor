import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Star } from 'lucide-react';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full shrink-0">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{user.name}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span className="text-[10px] font-bold">{(user.average_rating || 0).toFixed(1)}</span>
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
