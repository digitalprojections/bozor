import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Star, Package, MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface ProfileProps {
    profileUser: {
        id: number;
        name: string;
        avatar_url: string;
        created_at: string;
        average_rating: number;
        ratings_count: number;
        received_ratings: Rating[];
        listings: Listing[];
    };
}

export default function Show({ profileUser }: ProfileProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        { title: profileUser.name, href: '#' },
    ];

    return (
        <BazaarLayout
            title={profileUser.name}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`${profileUser.name} - ${t('marketplace.title')}`} />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Overview Sidebar */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <Card className="rounded-[24px] border-[#edf2f9] shadow-sm overflow-hidden p-8">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Avatar className="h-24 w-24 border-4 border-[#f0f5fd] shadow-sm">
                                <AvatarImage src={profileUser.avatar_url} alt={profileUser.name} className="object-cover" />
                                <AvatarFallback className="bg-[#d3e0f0] text-[#3a5670] text-3xl font-bold">
                                    {getInitials(profileUser.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-[#0b1b32]">{profileUser.name}</h1>
                                <div className="flex items-center justify-center gap-1 text-[#0d9488] font-medium text-sm">
                                    <CheckCircle2 size={16} />
                                    {t('verification.status.approved')}
                                </div>
                            </div>

                            <Separator className="bg-[#f0f2f5]" />

                            <div className="w-full flex flex-col gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('rating.score')}</span>
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
                                        <span>{profileUser.average_rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#5f6c84]">{t('rating.title')}</span>
                                    <span className="font-bold text-[#0b1b32]">{profileUser.ratings_count}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm pt-2">
                                    <span className="text-[#5f6c84] flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {t('auth.profile.joined')}
                                    </span>
                                    <span className="font-medium text-[#1a263b]">
                                        {new Date(profileUser.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="lg:w-2/3 flex flex-col gap-8">
                    {/* Active Listings */}
                    <div>
                        <h2 className="text-xl font-bold text-[#0b1b32] mb-4 flex items-center gap-2">
                            <Package size={20} className="text-[#0d9488]" />
                            {t('marketplace.active_listings')}
                        </h2>
                        {profileUser.listings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profileUser.listings.map((listing) => (
                                    <Link key={listing.id} href={`/listings/${listing.id}`}>
                                        <Card className="rounded-[20px] border-[#edf2f9] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                            <div className="aspect-video bg-[#f0f5fd] relative overflow-hidden">
                                                {listing.images && listing.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${listing.images[0]}`}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                                        <Package size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-3 left-3">
                                                    <Badge className="bg-white/90 text-[#0b1b32] hover:bg-white border-none font-bold shadow-sm">
                                                        ¥{listing.price.toLocaleString()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-[#0b1b32] truncate">{listing.title}</h3>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#f8fbfe] rounded-[24px] border border-dashed border-[#d1e2fc] p-12 text-center text-[#5f6c84]">
                                {t('listing.show.no_listings')}
                            </div>
                        )}
                    </div>

                    <Separator className="bg-[#f0f2f5]" />

                    {/* Ratings Section */}
                    <div>
                        <h2 className="text-xl font-bold text-[#0b1b32] mb-4 flex items-center gap-2">
                            <Star size={20} className="text-amber-500 fill-amber-500" />
                            {t('rating.title')}
                        </h2>
                        {profileUser.received_ratings.length > 0 ? (
                            <div className="space-y-4">
                                {profileUser.received_ratings.map((rating) => (
                                    <Card key={rating.id} className="rounded-[20px] border-[#edf2f9] shadow-sm p-5">
                                        <div className="flex gap-4">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarImage src={rating.rater.avatar_url} alt={rating.rater.name} />
                                                <AvatarFallback className="bg-[#f3f9ff] text-[#2b4b8f]">
                                                    {getInitials(rating.rater.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <Link href={`/users/${rating.rater.id}`} className="font-bold text-[#0b1b32] hover:underline">
                                                            {rating.rater.name}
                                                        </Link>
                                                        <div className="flex items-center gap-0.5 mt-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    size={12}
                                                                    className={cn(
                                                                        "transition-colors",
                                                                        s <= rating.score ? "text-amber-500 fill-amber-500" : "text-slate-200"
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-[#8ca1b9] flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(rating.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {rating.comment && (
                                                    <p className="text-sm text-[#1a263b] leading-relaxed mt-2 bg-[#f8fbfe] p-3 rounded-[14px] border border-[#f0f5fd]">
                                                        {rating.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#f8fbfe] rounded-[24px] border border-dashed border-[#d1e2fc] p-12 text-center text-[#5f6c84]">
                                {t('listing.show.no_ratings')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BazaarLayout>
    );
}
