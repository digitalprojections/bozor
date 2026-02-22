import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

interface Listing {
    id: number;
    title: string;
    price: number;
    images?: string[];
    main_image_url?: string;
}

interface RecommendationsSectionProps {
    recommendations: Listing[];
    title?: string;
}

export function RecommendationsSection({ recommendations, title }: RecommendationsSectionProps) {
    const { t } = useTranslations();

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold tracking-tight text-[#0b1a31]">
                    {title || t('dashboard.recommendations.title')}
                </h2>
            </div>

            <Card className="rounded-[4px] border-[#f0f2f5] shadow-sm">
                <CardContent className="p-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {recommendations.map((item) => (
                            <Link
                                key={item.id}
                                href={`/listings/${item.id}`}
                                className="min-w-[140px] flex flex-col gap-2 group cursor-pointer"
                            >
                                <div className="aspect-square w-full rounded-md bg-[#f0f5fd] flex items-center justify-center border border-[#e1e9f2] overflow-hidden group-hover:border-[#ced9e5] transition-colors">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={`/storage/${item.images[0]}`}
                                            alt={item.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <Package className="text-[#a3b6cc]" size={32} />
                                    )}
                                </div>
                                <span className="text-xs font-medium text-[#1a263b] line-clamp-2 group-hover:text-[#2b4b8f] transition-colors">
                                    {item.title}
                                </span>
                                <span className="text-sm font-bold text-[#b91c1c]">
                                    ¥ {item.price.toLocaleString()}
                                </span>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
