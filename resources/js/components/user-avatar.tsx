import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MascotAvatar } from '@/components/mascot-avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    AvatarConfig,
    DEFAULT_COLORS,
    SKIN_TONES,
} from '@/types/mascot-avatar';
import type { User } from '@/types';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
    user: Pick<User, 'name' | 'avatar_url' | 'avatar_source' | 'avatar_seed'>;
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
    mascotSize?: number;
};

const DEFAULT_MASCOT_CONFIG: AvatarConfig = {
    characterType: 'blob',
    bodyColor: DEFAULT_COLORS[0],
    eyeType: 'round',
    mouthType: 'smile',
    accessoryType: 'none',
    accessoryColor: DEFAULT_COLORS[1],
    skinTone: SKIN_TONES[0],
    size: 120,
};

function parseMascotConfig(seed: string | null | undefined): AvatarConfig {
    if (!seed?.startsWith('{')) {
        return DEFAULT_MASCOT_CONFIG;
    }

    try {
        return {
            ...DEFAULT_MASCOT_CONFIG,
            ...JSON.parse(seed),
        };
    } catch {
        return DEFAULT_MASCOT_CONFIG;
    }
}

export function UserAvatar({
    user,
    className,
    imageClassName,
    fallbackClassName,
    mascotSize = 32,
}: UserAvatarProps) {
    const getInitials = useInitials();
    const isMascot = user.avatar_source === 'mascot';

    return (
        <Avatar className={cn('overflow-hidden rounded-full', className)}>
            {isMascot ? (
                <div className="flex h-full w-full items-center justify-center bg-background">
                    <MascotAvatar {...parseMascotConfig(user.avatar_seed)} size={mascotSize} />
                </div>
            ) : (
                <>
                    <AvatarImage
                        src={user.avatar_url || undefined}
                        alt={user.name}
                        className={imageClassName}
                    />
                    <AvatarFallback
                        className={cn(
                            'rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white',
                            fallbackClassName,
                        )}
                    >
                        {getInitials(user.name)}
                    </AvatarFallback>
                </>
            )}
        </Avatar>
    );
}
