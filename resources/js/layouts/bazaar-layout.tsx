import { Head, usePage, router } from '@inertiajs/react';
import { LocalizedLink as Link } from '@/components/localized-link';
import { Search, Star, Gavel, CheckCircle, Package, Clock, Heart, CreditCard, Receipt, Wallet, ShieldCheck, Bell, MessageCircle, Settings, ChevronRight, LayoutDashboard, ShoppingCart, Lock, Palette, Truck, LogOut, Menu } from 'lucide-react';
import React, { ReactNode } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import AppLogo from '@/components/app-logo';

interface BazaarLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    sidebar?: ReactNode;
}

export default function BazaarLayout({ children, title, breadcrumbs = [], sidebar }: BazaarLayoutProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-[#f4f6fa] text-[#1a263b]">
            <Head title={title} />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[#e8e7e5] bg-white shadow-sm">
                <div className="mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4 md:gap-8 flex-1">
                        <div className="flex items-center gap-2 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="p-2 text-[#1a263b] hover:bg-gray-100 rounded-md" aria-label="Open menu">
                                        <Menu size={24} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] p-0 bg-white">
                                    <SheetHeader className="border-b p-4 text-left">
                                        <SheetTitle className="flex items-center gap-2">
                                            <AppLogo />
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="py-4 px-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                                        <DefaultSidebar />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>

                        {/* Search Bar */}
                        <div className="relative max-w-md w-full hidden md:block">
                            <input
                                type="text"
                                placeholder={t('layout.header.search_placeholder')}
                                className="w-full rounded-full border border-[#cfddee] bg-[#f8fafd] py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6b7a]">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <LocaleSwitcher variant="ghost" size="sm" className="text-[#5f6b7a] hover:text-[#0d9488]" />
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-semibold text-[#1a263b] hover:text-[#0d9488] transition-colors hidden sm:block"
                                >
                                    {t('layout.header.my_listings')}
                                </Link>

                                <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
                                    <div className="flex flex-col items-end mr-0.5">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                            <Star size={10} className="fill-amber-500" />
                                            {(user?.average_rating || 0).toFixed(1)}
                                        </div>
                                        <div className="text-[9px] text-[#5f6c84] leading-none">
                                            ({user?.ratings_count || 0})
                                        </div>
                                    </div>
                                    <Avatar className="h-8 w-8 border border-[#e1e9f2]">
                                        <AvatarImage src={user?.avatar_url || undefined} alt={user?.name} className="object-cover" />
                                        <AvatarFallback className="bg-[#d9e2ef] text-[#3a5670] text-xs font-semibold">
                                            {user?.name ? getInitials(user.name) : <Star size={14} />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden lg:inline text-[#0b1b32] font-bold">{user?.masked_name || user?.name}</span>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="ml-1 flex items-center gap-1 text-xs text-[#5f6c84] hover:text-red-500 transition-colors"
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
                                    className="text-sm font-semibold text-[#1a263b] hover:text-[#0d9488] transition-colors"
                                >
                                    {t('common.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex h-8 sm:h-9 items-center justify-center rounded-sm bg-[#0d9488] px-3 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#0f766e]"
                                >
                                    {t('common.register')}
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            {/* Breadcrumbs Section */}
            <div className="bg-white border-b border-[#f0f2f5] py-2">
                <div className="mx-auto w-full px-4 md:px-8">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <main className="mx-auto w-full px-4 py-6 md:py-8 md:px-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl md:text-[2rem] font-semibold tracking-tight text-[#0b1b32]">{title}</h1>
                </div>

                <div className={cn(
                    "grid grid-cols-1 gap-8",
                    sidebar ? "lg:grid-cols-[240px_1fr_320px]" : "lg:grid-cols-[240px_1fr]"
                )}>
                    {/* Main Navigation Sidebar (Left) */}
                    <aside className="hidden lg:flex flex-col gap-6">
                        <DefaultSidebar />
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex flex-col gap-6 min-w-0">
                        {children}
                    </div>

                    {/* Action Sidebar (Right) - Optional */}
                    {sidebar && (
                        <aside className="flex flex-col gap-6">
                            {sidebar}
                        </aside>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t border-[#e1e9f2] bg-white py-12">
                <div className="mx-auto w-full px-4 md:px-8 text-center space-y-4">
                    <p className="text-sm text-[#7f8fa4]">{t('layout.footer.disclaimer')}</p>
                    <div className="flex justify-center gap-6 text-sm font-medium text-[#5f6c84]">
                        <Link href="/terms" className="hover:text-[#0d9488] transition-colors">
                            {t('layout.footer.terms')}
                        </Link>
                        <Link href="/privacy" className="hover:text-[#0d9488] transition-colors">
                            {t('layout.footer.privacy')}
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SidebarSection({ title, children }: { title: string, children: ReactNode }) {
    return (
        <div className="flex flex-col">
            <h3 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#5f6c84]">{title}</h3>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}

function SidebarLink({ icon: Icon, label, href = "#" }: { icon: any, label: string, href?: string }) {
    const { url } = usePage();
    const isDashboard = href === '/dashboard';
    const isActive = isDashboard ? url === '/dashboard' : url.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-2 text-[0.95rem] font-medium transition-all rounded-lg group",
                isActive
                    ? "bg-white shadow-sm text-[#0d9488]"
                    : "text-[#1a263b] hover:bg-white hover:shadow-sm"
            )}
        >
            <Icon size={18} className={cn("transition-colors", isActive ? "text-[#0d9488]" : "text-[#3a5f8b]")} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
        </Link>
    );
}

function DefaultSidebar() {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <div className="flex flex-col gap-8">
            <div className="lg:hidden px-4">
                <LocaleSwitcher variant="outline" className="w-full justify-between" />
            </div>

            <SidebarSection title={t('layout.sidebar.activity')}>
                <SidebarLink icon={LayoutDashboard} label={t('common.dashboard')} href="/dashboard" />
                <SidebarLink icon={ShoppingCart} label={t('marketplace.title')} href="/marketplace" />
                {user && (
                    <>
                        <SidebarLink icon={CheckCircle} label={t('dashboard.won_items.title')} href="/dashboard/won-items" />
                        <SidebarLink icon={Truck} label={t('layout.sidebar.sold_items')} href="/dashboard/sold-items" />
                    </>
                )}
                <SidebarLink icon={Star} label={t('layout.sidebar.watchlist')} href="/watchlist" />
            </SidebarSection>


            {user && (
                <>
                    <SidebarSection title={t('layout.sidebar.extra')}>
                        <SidebarLink icon={Search} label={t('layout.sidebar.history')} />
                        <SidebarLink icon={Heart} label={t('layout.sidebar.following')} />
                        <SidebarLink icon={Star} label={t('layout.sidebar.saved_searches')} />
                    </SidebarSection>



                    <SidebarSection title={t('layout.sidebar.settings')}>
                        <SidebarLink icon={Settings} label={t('layout.sidebar.options')} href="/settings/profile" />
                        <SidebarLink icon={Lock} label={t('layout.sidebar.password')} href="/settings/password" />
                        <SidebarLink icon={ShieldCheck} label={t('layout.sidebar.auth')} href="/settings/two-factor" />
                        <SidebarLink icon={Palette} label={t('layout.sidebar.appearance')} href="/settings/appearance" />

                        <SidebarLink icon={Bell} label={t('layout.sidebar.notifications')} />
                    </SidebarSection>
                </>
            )}
        </div>
    );
}
