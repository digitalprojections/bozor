import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Package, Sparkles } from 'lucide-react';
import { CategoryMultiSelect } from '@/components/category-multi-select';
import { useTranslations } from '@/hooks/use-translations';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string | null;
    status: string;
    condition: ItemCondition;
    is_auction: boolean;
    buy_now_price: number | null;
    auction_end_date: string | null;
    categories: Array<{ id: number; name: string }>;
}

export default function EditListing({
    listing,
    categories,
}: {
    listing: Listing;
    categories: Category[];
}) {
    const { t } = useTranslations();
    const { data, setData, patch, processing, errors, transform } = useForm({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        categories: listing.categories.map((c) => c.id),
        location: listing.location || '',
        status: listing.status as 'draft' | 'active',
        condition: listing.condition,
        is_auction: listing.is_auction,
        buy_now_price: listing.buy_now_price?.toString() || '',
        auction_end_date: listing.auction_end_date ? listing.auction_end_date.slice(0, 16) : '',
    });

    const statusRef = useRef<'draft' | 'active'>(listing.status as 'draft' | 'active');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        { title: t('listing.edit.title'), href: `/listings/${listing.id}/edit` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            status: statusRef.current,
        }));
        patch(`/listings/${listing.id}`);
    };

    return (
        <BazaarLayout title={t('listing.edit.title')} breadcrumbs={breadcrumbs}>
            <Head title={t('listing.edit.title')} />

            <div className="space-y-6 p-4 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {t('listing.edit.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                        {t('listing.edit.subtitle')}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card className="p-4 sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                            {t('listing.create.basic_info')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">
                                    {t('listing.create.item_title')} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., iPhone 13 Pro Max"
                                    className="mt-1"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">
                                    {t('listing.create.description')} <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe your item in detail..."
                                    rows={5}
                                    className="mt-1"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="price">
                                        {data.is_auction ? t('listing.create.starting_bid') : t('listing.create.price')} (¥) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0"
                                        className="mt-1"
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div>
                                    <Label>{t('listing.create.categories')} <span className="text-red-500">*</span></Label>
                                    <div className="mt-1">
                                        <CategoryMultiSelect
                                            categories={categories}
                                            value={data.categories}
                                            onChange={(value) => setData('categories', value)}
                                            maxSelections={5}
                                            error={errors.categories}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="condition">
                                        {t('listing.create.item_condition')} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {ITEM_CONDITIONS.map((condition) => (
                                            <Button
                                                key={condition.value}
                                                type="button"
                                                variant={data.condition === condition.value ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setData('condition', condition.value)}
                                                className="rounded-full"
                                            >
                                                {t(condition.labelKey)}
                                            </Button>
                                        ))}
                                    </div>
                                    {errors.condition && <p className="mt-1 text-sm text-red-500">{errors.condition}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="location">{t('listing.create.location')}</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g., Tokyo, Shibuya"
                                        className="mt-1"
                                    />
                                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{t('listing.create.auction_mode')}</h3>
                                        <p className="text-sm text-muted-foreground">{t('listing.create.auction_mode_desc')}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={data.is_auction ? 'default' : 'outline'}
                                        onClick={() => setData('is_auction', !data.is_auction)}
                                    >
                                        {data.is_auction ? t('listing.create.enabled') : t('listing.create.disabled')}
                                    </Button>
                                </div>

                                {data.is_auction && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="auction_end_date">{t('listing.create.auction_end_date')}</Label>
                                            <Input
                                                id="auction_end_date"
                                                type="datetime-local"
                                                value={data.auction_end_date}
                                                onChange={(e) => setData('auction_end_date', e.target.value)}
                                                className="mt-1"
                                            />
                                            {errors.auction_end_date && <p className="mt-1 text-sm text-red-500">{errors.auction_end_date}</p>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="buy_now_price">{t('listing.create.buy_now_price')} (¥)</Label>
                                    <Input
                                        id="buy_now_price"
                                        type="number"
                                        min="0"
                                        value={data.buy_now_price}
                                        onChange={(e) => setData('buy_now_price', e.target.value)}
                                        placeholder={t('listing.create.buy_now_placeholder')}
                                        className="mt-1"
                                    />
                                    {errors.buy_now_price && <p className="mt-1 text-sm text-red-500">{errors.buy_now_price}</p>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={processing}
                            onClick={() => { statusRef.current = 'draft'; }}
                            className="w-full sm:w-auto"
                        >
                            {t('listing.create.save_draft')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={() => { statusRef.current = 'active'; }}
                            className="w-full sm:w-auto"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {processing ? t('listing.edit.updating') : t('listing.edit.update')}
                        </Button>
                    </div>
                </form>
            </div>
        </BazaarLayout>
    );
}
