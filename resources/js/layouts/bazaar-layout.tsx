import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    Star,
    Gavel,
    CheckCircle,
    Package,
    Clock,
    Heart,
    CreditCard,
    Receipt,
    Wallet,
    ShieldCheck,
    Bell,
    MessageCircle,
    Settings,
    ChevronRight,
    LayoutDashboard,
    ShoppingCart,
    Lock,
    Palette,
    Truck,
    LogOut,
    Menu,
    UsersRound,
    Flag,
    Megaphone,
} from 'lucide-react';
import React, { ReactNode } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { LoginRequiredDialog } from '@/components/login-required-dialog';
import { AdSlot } from '@/components/ads/ad-slot';
import { UserAvatar } from '@/components/user-avatar';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { formatRating } from '@/lib/format';
import type { BreadcrumbItem } from '@/types';
import AppLogo from '@/components/app-logo';
import type { LayoutAds } from '@/types';

interface BazaarLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    sidebar?: ReactNode;
    showTitle?: boolean;
    flushMobile?: boolean;
}

export default function BazaarLayout({
    children,
    title,
    breadcrumbs = [],
    sidebar,
    showTitle = false,
    flushMobile = false,
}: BazaarLayoutProps) {
    const { t } = useTranslations();
    const { auth, flash, layoutAds = {} } = usePage().props as any;
    const user = auth.user && !auth.user.is_guest ? auth.user : null;
    const ads = layoutAds as LayoutAds;
    const hasRightRailAds = (ads.right_rail?.length ?? 0) > 0;

    return (
        <div className="min-h-screen bg-[#f4f6fa] text-[#1a263b] dark:bg-[#0b1120] dark:text-[#e5edf6]">
            <Head title={title} />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[#e8e7e5] bg-white shadow-sm dark:border-[#1f2a3d] dark:bg-[#111827]">
                <div className="mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8">
                    <div className="flex flex-1 items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        className="rounded-md p-2 text-[#1a263b] hover:bg-gray-100 dark:text-[#e5edf6] dark:hover:bg-[#1f2a3d]"
                                        aria-label="Open menu"
                                    >
                                        <Menu size={24} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[280px] bg-white p-0 dark:bg-[#111827]"
                                >
                                    <SheetHeader className="border-b p-4 text-left dark:border-[#1f2a3d]">
                                        <SheetTitle className="flex items-center gap-2">
                                            <AppLogo />
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="max-h-[calc(100vh-80px)] overflow-y-auto px-2 py-4">
                                        <DefaultSidebar />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>

                        {/* Search Bar */}
                        <div className="relative hidden w-full max-w-md md:block">
                            <input
                                type="text"
                                placeholder={t(
                                    'layout.header.search_placeholder',
                                )}
                                className="w-full rounded-full border border-[#cfddee] bg-[#f8fafd] py-2 pr-10 pl-4 text-sm text-[#1a263b] focus:ring-2 focus:ring-[#0d9488]/20 focus:outline-none dark:border-[#2f3d52] dark:bg-[#0b1120] dark:text-[#e5edf6] dark:placeholder:text-[#8ca1b9]"
                            />
                            <button className="absolute top-1/2 right-3 -translate-y-1/2 text-[#5f6b7a] dark:text-[#8ca1b9]">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <LocaleSwitcher
                            variant="ghost"
                            size="sm"
                            className="text-[#5f6b7a] hover:text-[#0d9488] dark:text-[#b8c7d9] dark:hover:text-[#5eead4]"
                        />
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="hidden text-sm font-semibold text-[#1a263b] transition-colors hover:text-[#0d9488] sm:block dark:text-[#e5edf6] dark:hover:text-[#5eead4]"
                                >
                                    {t('layout.header.my_listings')}
                                </Link>

                                <div className="flex items-center gap-2 text-sm font-medium sm:gap-3">
                                    <div className="mr-0.5 flex flex-col items-end">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                            <Star
                                                size={10}
                                                className="fill-amber-500"
                                            />
                                            {formatRating(user?.average_rating)}
                                        </div>
                                        <div className="text-[9px] leading-none text-[#5f6c84] dark:text-[#8ca1b9]">
                                            ({user?.ratings_count || 0})
                                        </div>
                                    </div>
                                    <UserAvatar
                                        user={user}
                                        className="h-8 w-8 border border-[#e1e9f2]"
                                        imageClassName="object-cover"
                                        fallbackClassName="bg-[#d9e2ef] text-xs font-semibold text-[#3a5670]"
                                        mascotSize={30}
                                    />
                                    <span className="hidden font-bold text-[#0b1b32] lg:inline dark:text-[#f8fafc]">
                                        {user?.masked_name || user?.name}
                                    </span>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="ml-1 flex items-center gap-1 text-xs text-[#5f6c84] transition-colors hover:text-red-500 dark:text-[#8ca1b9] dark:hover:text-red-300"
                                        title={t('common.logout')}
                                    >
                                        <LogOut size={15} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/login"
                                    className="inline-flex h-8 items-center justify-center rounded-sm bg-[#0d9488] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f766e] sm:h-9 sm:px-4 sm:text-sm"
                                >
                                    {t('common.login')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Breadcrumbs Section */}
            <div className="border-b border-[#f0f2f5] bg-white py-2 dark:border-[#1f2a3d] dark:bg-[#111827]">
                <div className="mx-auto w-full px-4 md:px-8">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <main
                className={cn(
                    'mx-auto w-full md:px-8 md:py-8',
                    flushMobile ? 'px-0 py-3' : 'px-4 py-6',
                )}
            >
                <AdSlot
                    placement="top_banner"
                    variant="banner"
                    className="mb-6"
                />

                {(flash?.success || flash?.error) && (
                    <div
                        role="status"
                        className={cn(
                            'mb-6 rounded border px-4 py-3 text-sm font-medium',
                            flash?.error
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]',
                        )}
                    >
                        {flash.error ?? flash.success}
                    </div>
                )}

                {showTitle && (
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#0b1b32] md:text-[2rem] dark:text-[#f8fafc]">
                            {title}
                        </h1>
                    </div>
                )}

                <div
                    className={cn(
                        'grid grid-cols-1',
                        flushMobile ? 'gap-4 md:gap-8' : 'gap-8',
                        sidebar || hasRightRailAds
                            ? 'lg:grid-cols-[240px_1fr_320px]'
                            : 'lg:grid-cols-[240px_1fr]',
                    )}
                >
                    {/* Main Navigation Sidebar (Left) */}
                    <aside className="hidden flex-col gap-6 lg:flex">
                        <DefaultSidebar />
                        <AdSlot placement="sidebar" variant="rail" />
                    </aside>

                    {/* Main Content Area */}
                    <div
                        className={cn(
                            'flex min-w-0 flex-col',
                            flushMobile ? 'gap-4 sm:gap-6' : 'gap-6',
                        )}
                    >
                        {children}
                    </div>

                    {/* Action Sidebar (Right) - Optional */}
                    {(sidebar || hasRightRailAds) && (
                        <aside className="flex flex-col gap-6">
                            {sidebar}
                            <AdSlot placement="right_rail" variant="rail" />
                        </aside>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t border-[#e1e9f2] bg-white py-12 dark:border-[#1f2a3d] dark:bg-[#111827]">
                <div className="mx-auto w-full space-y-4 px-4 text-center md:px-8">
                    <AdSlot
                        placement="footer"
                        variant="footer"
                        className="mx-auto mb-8 max-w-4xl text-left"
                    />
                    <p className="text-sm text-[#7f8fa4] dark:text-[#9fb0c5]">
                        {t('layout.footer.disclaimer')}
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-medium text-[#5f6c84] dark:text-[#b8c7d9]">
                        <Link
                            href="/terms"
                            className="transition-colors hover:text-[#0d9488] dark:hover:text-[#5eead4]"
                        >
                            {t('layout.footer.terms')}
                        </Link>
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-[#0d9488] dark:hover:text-[#5eead4]"
                        >
                            {t('layout.footer.privacy')}
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <h3 className="px-4 py-2 text-xs font-bold tracking-wider text-[#5f6c84] uppercase dark:text-[#8ca1b9]">
                {title}
            </h3>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}

function SidebarLink({
    icon: Icon,
    label,
    href = '#',
    badge,
}: {
    icon: any;
    label: string;
    href?: string;
    badge?: number;
}) {
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const [loginRequiredOpen, setLoginRequiredOpen] = React.useState(false);
    const isDashboard = href === '/dashboard';
    const isActive = isDashboard ? url === '/dashboard' : url.startsWith(href);
    const requiresAuth = [
        '/dashboard',
        '/dashboard/won-items',
        '/dashboard/sold-items',
        '/messages',
        '/watchlist',
        '/settings/profile',
        '/settings/password',
        '/settings/two-factor',
        '/listings/create',
        '/admin/users',
        '/admin/reports',
    ].some((path) => href === path || href.startsWith(`${path}/`));
    const isGuest = !auth?.user || auth.user.is_guest;

    const handleClick = (event: React.MouseEvent<Element>) => {
        if (requiresAuth && isGuest) {
            event.preventDefault();
            setLoginRequiredOpen(true);
        }
    };

    return (
        <>
            <Link
                href={href}
                onClick={handleClick}
                className={cn(
                    'group flex items-center gap-3 rounded-lg px-4 py-2 text-[0.95rem] font-medium transition-all',
                    isActive
                        ? 'bg-white text-[#0d9488] shadow-sm dark:bg-[#162033] dark:text-[#5eead4]'
                        : 'text-[#1a263b] hover:bg-white hover:shadow-sm dark:text-[#d7e1ee] dark:hover:bg-[#162033]',
                )}
            >
                <Icon
                    size={18}
                    className={cn(
                        'transition-colors',
                        isActive
                            ? 'text-[#0d9488] dark:text-[#5eead4]'
                            : 'text-[#3a5f8b] dark:text-[#8fb6e8]',
                    )}
                />
                <span className="flex-1">{label}</span>
                {badge ? (
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        {badge}
                    </span>
                ) : null}
                <ChevronRight
                    size={14}
                    className={cn(
                        'transition-opacity',
                        isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100',
                    )}
                />
            </Link>
            <LoginRequiredDialog
                open={loginRequiredOpen}
                onOpenChange={setLoginRequiredOpen}
            />
        </>
    );
}

function DefaultSidebar() {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const {
        adminPendingReportsCount = 0,
        adminPendingAdvertisingCount = 0,
        unreadMessageNotificationsCount = 0,
    } = usePage().props as any;
    const user = auth.user && !auth.user.is_guest ? auth.user : null;
    const isAdmin = !!auth.is_admin;

    return (
        <div className="flex flex-col gap-8">
            <div className="px-4 lg:hidden">
                <LocaleSwitcher
                    variant="outline"
                    className="w-full justify-between"
                />
            </div>

            <SidebarSection title={t('layout.sidebar.activity')}>
                {isAdmin && (
                    <>
                        <SidebarLink
                            icon={Flag}
                            label="Reports"
                            href="/admin/reports"
                            badge={adminPendingReportsCount}
                        />
                        <SidebarLink
                            icon={UsersRound}
                            label="Admin Users"
                            href="/admin/users"
                        />
                        <SidebarLink
                            icon={Megaphone}
                            label="Admin Ads"
                            href="/admin/advertising"
                            badge={adminPendingAdvertisingCount}
                        />
                    </>
                )}
                <SidebarLink
                    icon={LayoutDashboard}
                    label={t('common.dashboard')}
                    href="/dashboard"
                />
                <SidebarLink
                    icon={ShoppingCart}
                    label={t('marketplace.title')}
                    href="/marketplace"
                />
                {user && (
                    <>
                        <SidebarLink
                            icon={CheckCircle}
                            label={t('dashboard.won_items.title')}
                            href="/dashboard/won-items"
                        />
                        <SidebarLink
                            icon={Truck}
                            label={t('layout.sidebar.sold_items')}
                            href="/dashboard/sold-items"
                        />
                    </>
                )}
                <SidebarLink
                    icon={Star}
                    label={t('layout.sidebar.watchlist')}
                    href="/watchlist"
                />
            </SidebarSection>

            {user && (
                <>
                    <SidebarSection title={t('layout.sidebar.extra')}>
                        <SidebarLink
                            icon={MessageCircle}
                            label={t('layout.sidebar.messages')}
                            href="/messages"
                            badge={unreadMessageNotificationsCount}
                        />
                        <SidebarLink
                            icon={Megaphone}
                            label="Advertising"
                            href="/advertising"
                        />
                        <SidebarLink
                            icon={Search}
                            label={t('layout.sidebar.history')}
                        />
                        <SidebarLink
                            icon={Heart}
                            label={t('layout.sidebar.following')}
                        />
                        <SidebarLink
                            icon={Star}
                            label={t('layout.sidebar.saved_searches')}
                        />
                    </SidebarSection>

                    <SidebarSection title={t('layout.sidebar.settings')}>
                        <SidebarLink
                            icon={Settings}
                            label={t('layout.sidebar.profile')}
                            href="/settings/profile"
                        />
                        <SidebarLink
                            icon={Lock}
                            label={t('layout.sidebar.password')}
                            href="/settings/password"
                        />
                        <SidebarLink
                            icon={ShieldCheck}
                            label={t('layout.sidebar.two_factor_auth')}
                            href="/settings/two-factor"
                        />
                        <SidebarLink
                            icon={Palette}
                            label={t('layout.sidebar.appearance')}
                            href="/settings/appearance"
                        />

                        <SidebarLink
                            icon={Bell}
                            label={t('layout.sidebar.notifications')}
                        />
                    </SidebarSection>
                </>
            )}
        </div>
    );
}
