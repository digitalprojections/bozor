import { Link, router } from '@inertiajs/react';
import { LogIn, LogOut, Settings, Star, UserPlus } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import type { User } from '@/types';
import { login, logout, register } from '@/routes';
import { edit } from '@/routes/profile';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const { t } = useTranslations();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={`/users/${user.id}`}
                        prefetch
                        onClick={cleanup}
                    >
                        <Star className="mr-2" />
                        {t('auth.profile.title') || 'Public Profile'}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            {!user.is_guest && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer"
                                href={edit().url}
                                prefetch
                                onClick={cleanup}
                            >
                                <Settings className="mr-2" />
                                {t('layout.sidebar.settings') || 'Settings'}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </>
            )}

            {user.is_guest && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer font-bold text-primary"
                                href={login().url}
                                prefetch
                                onClick={cleanup}
                            >
                                <LogIn className="mr-2" />
                                {t('common.login')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer"
                                href={register().url}
                                prefetch
                                onClick={cleanup}
                            >
                                <UserPlus className="mr-2" />
                                {t('common.register')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout().url}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('common.logout') || 'Log out'}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
