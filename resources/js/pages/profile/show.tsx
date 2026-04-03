import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Star, Package, Calendar, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface Rating {
    id: number;
    score: number;
    comment: string | null;
    created_at: string;
    rater: {
        id: number;
        name: string;
        avatar_url: string;
    };
}

interface Listing {
    id: number;
    title: string;
    price: number;
    images: string[];
    created_at: string;
    status: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedListings {
    data: Listing[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface ProfileProps {
    profileUser: {
        id: number;
        name: string;
        avatar_url: string;
        created_at: string;
        average_rating: number;
        ratings_count: number;
        received_ratings: Rating[];
        store_name: string | null;
        store_description: string | null;
        store_banner_url: string | null;
    };
    activeListings: PaginatedListings;
    soldListings: PaginatedListings;
}

export default function Show({ profileUser, activeListings, soldListings }: ProfileProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        { title: profileUser.name, href: '#' },
    ];

    const Pagination = ({ pagination, preserveScroll = true }: { pagination: PaginatedListings, preserveScroll?: boolean }) => {
        if (pagination.last_page <= 1) return null;

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    asChild={!!pagination.prev_page_url}
                    disabled={!pagination.prev_page_url}
                    className="gap-1"
                >
                    {pagination.prev_page_url ? (
                        <Link href={pagination.prev_page_url} preserveScroll={preserveScroll}>
                            <ChevronLeft size={16} />
                            {t('listings.grid.previous')}
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft size={16} />
                            {t('listings.grid.previous')}
                        </>
                    )}
                </Button>

                <div className="flex items-center gap-1">
                    {pagination.links.filter(link => !isNaN(Number(link.label))).map((link, idx) => (
                        <Button
                            key={idx}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            className="w-9 h-9 p-0"
                            asChild={!link.active && !!link.url}
                        >
                            {link.url && !link.active ? (
                                <Link href={link.url} preserveScroll={preserveScroll}>
                                    {link.label}
                                </Link>
                            ) : (
                                <span>{link.label}</span>
                            )}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    asChild={!!pagination.next_page_url}
                    disabled={!pagination.next_page_url}
                    className="gap-1"
                >
                    {pagination.next_page_url ? (
                        <Link href={pagination.next_page_url} preserveScroll={preserveScroll}>
                            {t('listings.grid.next')}
                            <ChevronRight size={16} />
                        </Link>
                    ) : (
                        <>
                            {t('listings.grid.next')}
                            <ChevronRight size={16} />
                        </>
                    )}
                </Button>
            </div>
        );
    };

    return (
        <BazaarLayout
            title={profileUser.name}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`${profileUser.store_name || profileUser.name} - ${t('marketplace.title')}`} />

            {profileUser.store_banner_url && (
                <div className="w-full h-48 sm:h-72 rounded-[32px] overflow-hidden mb-10 shadow-sm border border-[#edf2f9] relative">
                    <img
                        src={profileUser.store_banner_url}
                        alt={profileUser.store_name || profileUser.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Profile Overview Sidebar */}
                <div className="lg:w-[340px] flex flex-col gap-6 shrink-0">
                    <Card className="rounded-[32px] border-[#edf2f9] shadow-sm overflow-hidden p-8 bg-white">
                        <div className="flex flex-col items-center text-center gap-5">
                            <div className="relative">
                                <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                                    <AvatarImage src={profileUser.avatar_url} alt={profileUser.name} className="object-cover" />
                                    <AvatarFallback className="bg-[#f0f5fd] text-[#3a5670] text-4xl font-extrabold">
                                        {getInitials(profileUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm border border-[#f0f5fd]">
                                    <CheckCircle2 size={20} className="text-[#0d9488]" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-[#0b1b32] tracking-tight">
                                    {profileUser.store_name || profileUser.name}
                                </h1>
                                {profileUser.store_name && (
                                    <p className="text-sm text-[#5f6c84] font-medium">{profileUser.name}</p>
                                )}
                            </div>

                            <Separator className="bg-[#f0f2f5]" />

                            <div className="w-full flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#5f6c84] font-medium">{t('rating.score')}</span>
                                    <div className="flex items-center gap-1.5 font-bold text-[#0b1b32]">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    className={cn(
                                                        "transition-colors",
                                                        star <= Math.round(profileUser.average_rating || 0) ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg">{profileUser.average_rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#5f6c84] font-medium">{t('rating.title')}</span>
                                    <span className="font-bold text-[#0b1b32] text-lg">{profileUser.ratings_count}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-sm text-[#5f6c84] font-medium flex items-center gap-2">
                                        <Calendar size={16} className="text-[#5f6c84]" />
                                        {t('auth.profile.joined')}
                                    </span>
                                    <span className="font-bold text-[#1a263b] text-sm">
                                        {new Date(profileUser.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {profileUser.store_description && (
                        <Card className="rounded-[28px] border-[#edf2f9] shadow-sm p-7 bg-white">
                            <h3 className="text-xs font-black text-[#0b1b32] uppercase tracking-widest mb-4 opacity-50">
                                {t('Store Description')}
                            </h3>
                            <p className="text-[0.95rem] text-[#4a5568] leading-relaxed whitespace-pre-wrap font-medium">
                                {profileUser.store_description}
                            </p>
                        </Card>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <Tabs defaultValue="active" className="space-y-8">
                        <div className="bg-white p-1.5 rounded-2xl border border-[#edf2f9] shadow-sm inline-flex">
                            <TabsList className="bg-transparent h-12 gap-1 px-1">
                                <TabsTrigger 
                                    value="active" 
                                    className="rounded-xl px-6 h-9 font-bold data-[state=active]:bg-[#0d9488] data-[state=active]:text-white transition-all"
                                >
                                    <Package size={18} className="mr-2" />
                                    {t('profile.active_listings')}
                                    <Badge variant="secondary" className="ml-2 bg-slate-100 group-data-[state=active]:bg-white/20">
                                        {activeListings.total}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="sold" 
                                    className="rounded-xl px-6 h-9 font-bold data-[state=active]:bg-[#0d9488] data-[state=active]:text-white transition-all"
                                >
                                    <CheckCircle2 size={18} className="mr-2" />
                                    {t('profile.sold_listings')}
                                    <Badge variant="secondary" className="ml-2 bg-slate-100 group-data-[state=active]:bg-white/20">
                                        {soldListings.total}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="reviews" 
                                    className="rounded-xl px-6 h-9 font-bold data-[state=active]:bg-[#0d9488] data-[state=active]:text-white transition-all"
                                >
                                    <Star size={18} className="mr-2" />
                                    {t('rating.title')}
                                    <Badge variant="secondary" className="ml-2 bg-slate-100 group-data-[state=active]:bg-white/20">
                                        {profileUser.ratings_count}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="active" className="mt-0 focus-visible:outline-none">
                            {activeListings.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {activeListings.data.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                    <Pagination pagination={activeListings} />
                                </>
                            ) : (
                                <div className="bg-white rounded-[32px] border-2 border-dashed border-[#e2e8f0] p-20 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-[#f0f5fd] text-[#5f6c84] mb-4">
                                        <Package size={32} />
                                    </div>
                                    <p className="text-lg font-bold text-[#0b1b32]">{t('listing.show.no_listings')}</p>
                                    <p className="text-[#5f6c84] text-sm mt-1">{t('profile.no_active_listings_desc') || "This user hasn't posted any active listings yet."}</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sold" className="mt-0 focus-visible:outline-none">
                            {soldListings.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {soldListings.data.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                    <Pagination pagination={soldListings} />
                                </>
                            ) : (
                                <div className="bg-white rounded-[32px] border-2 border-dashed border-[#e2e8f0] p-20 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-[#f0f5fd] text-[#5f6c84] mb-4">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <p className="text-lg font-bold text-[#0b1b32]">{t('listing.show.no_listings')}</p>
                                    <p className="text-[#5f6c84] text-sm mt-1">{t('profile.no_sold_listings_desc') || "No items have been sold by this user yet."}</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-0 focus-visible:outline-none">
                            {profileUser.received_ratings.length > 0 ? (
                                <div className="grid grid-cols-1 gap-5">
                                    {profileUser.received_ratings.map((rating) => (
                                        <Card key={rating.id} className="rounded-[24px] border-[#edf2f9] shadow-sm p-6 bg-white hover:border-[#cbd5e1] transition-colors">
                                            <div className="flex gap-5">
                                                <Link href={`/users/${rating.rater.id}`}>
                                                    <Avatar className="h-12 w-12 border-2 border-[#f0f5fd]">
                                                        <AvatarImage src={rating.rater.avatar_url} alt={rating.rater.name} />
                                                        <AvatarFallback className="bg-[#f0f5fd] text-[#2b4b8f] font-bold">
                                                            {getInitials(rating.rater.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <Link href={`/users/${rating.rater.id}`} className="font-bold text-[#0b1b32] hover:text-[#0d9488] transition-colors">
                                                                {rating.rater.name}
                                                            </Link>
                                                            <div className="flex items-center gap-0.5 mt-1">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star
                                                                        key={s}
                                                                        size={14}
                                                                        className={cn(
                                                                            "transition-colors",
                                                                            s <= rating.score ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-[#8ca1b9] flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-full">
                                                            <Clock size={14} />
                                                            {new Date(rating.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="text-[0.95rem] text-[#2d3748] leading-relaxed mt-3 bg-[#f8fbfe] p-4 rounded-2xl border border-[#f0f5fd] font-medium">
                                                            {rating.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[32px] border-2 border-dashed border-[#e2e8f0] p-20 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-[#f0f5fd] text-[#5f6c84] mb-4">
                                        <Star size={32} />
                                    </div>
                                    <p className="text-lg font-bold text-[#0b1b32]">{t('listing.show.no_ratings')}</p>
                                    <p className="text-[#5f6c84] text-sm mt-1">{t('profile.no_ratings_desc') || "This user hasn't received any ratings yet."}</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </BazaarLayout>
    );
}
