import { usePage, Link } from '@inertiajs/react';
import { ChevronsUpDown, LogIn, UserPlus } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { login, register } from '@/routes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const { t } = useTranslations();

    if (!auth.user || auth.user.is_guest) {
        return (
            <SidebarMenu>
                <SidebarMenuItem className="flex flex-col gap-2 p-2">
                    <Link href={login().url} className="w-full">
                        <SidebarMenuButton className="w-full justify-start">
                            <LogIn className="mr-2 size-4" />
                            {t('common.login') as string}
                        </SidebarMenuButton>
                    </Link>
                    <Link href={register().url} className="w-full">
                        <SidebarMenuButton className="w-full justify-start transition-colors bg-primary text-primary-foreground hover:bg-primary/90">
                            <UserPlus className="mr-2 size-4" />
                            {t('common.register') as string}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
