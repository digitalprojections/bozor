import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/auth';
import { useTranslations } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';
import { ChevronRight, Star, User as UserIcon, CheckCircle2, Settings } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { edit } from '@/routes/profile';

interface DashboardProfileCardProps {
    user: User;
    isVerified: boolean;
    rating?: string;
    reviewCount?: number;
}

export function DashboardProfileCard({ user, isVerified, rating = '5.0', reviewCount = 0 }: DashboardProfileCardProps) {
    const { t } = useTranslations();
    const getInitials = useInitials();

    return (
        <Card className="overflow-hidden rounded-[4px] border-[#f0f2f5] bg-white shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16 border border-[#e1e9f2]">
                        <AvatarImage src={user.avatar_url || undefined} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-[#f0f2f5] text-[#3a5670] text-xl font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Identity Info */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight text-[#0b1a31]">{user.name}</h2>
                            <Button variant="outline" size="sm" className="h-7 rounded-sm border-[#cfddee] px-2 text-[0.75rem] font-medium text-[#1f2a3f] hover:bg-[#f8fafd]" asChild>
                                <Link href={edit().url}>
                                    {t('common.edit')}
                                    <ChevronRight size={12} className="ml-1" />
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 text-[0.85rem]">
                            <div className="flex items-center gap-1.5 font-medium text-[#0066cc]">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            className={cn(
                                                star <= Math.round(user.average_rating || 0)
                                                    ? "fill-[#f5b342] text-[#f5b342]"
                                                    : "text-[#d1e2f3]"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="ml-1">{t('listing.sidebar.rating')} {(user.average_rating || 0).toFixed(1)}</span>
                                <span className="ml-1 text-[#7f8fa4] font-normal">({user.ratings_count || 0})</span>
                            </div>

                            {isVerified && (
                                <div className="flex items-center gap-1 text-[#0066cc] font-medium">
                                    <CheckCircle2 size={14} className="text-[#0066cc]" />
                                    <span>{t('verification.status.approved')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
