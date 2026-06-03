import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    AlertTriangle,
    ImageOff,
    Package,
    Sparkles,
    Upload,
    X,
} from 'lucide-react';
import { CategoryMultiSelect } from '@/components/category-multi-select';
import { useTranslations } from '@/hooks/use-translations';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    ImageCompressor,
    type CompressionResult,
} from '@/lib/image-compressor';
import { ShippingSettingsCard } from '@/components/listings/shipping-settings-card';
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
    reserve_price: number | null;
    buy_now_price: number | null;
    auction_end_date: string | null;
    shipping_payer: 'seller' | 'buyer';
    shipping_method: 'kuroneko_yamato';
    shipping_cost_type: 'free' | 'fixed' | 'location_based' | 'chakubarai';
    shipping_cost: number | null;
    images: string[] | null;
    all_image_urls: string[];
    categories: Array<{ id: number; name: string }>;
    bids_count?: number;
}

type ImageSlot =
    | {
          kind: 'existing';
          path: string;
          url: string;
          failed: boolean;
      }
    | {
          kind: 'new';
          file: File;
          previewUrl: string;
          stat: CompressionResult;
      }
    | {
          kind: 'empty';
      };

const MAX_IMAGES = 5;

const isKeptExistingImageSlot = (
    slot: ImageSlot,
): slot is Extract<ImageSlot, { kind: 'existing' }> =>
    slot.kind === 'existing' && !slot.failed;

const isNewImageSlot = (
    slot: ImageSlot,
): slot is Extract<ImageSlot, { kind: 'new' }> => slot.kind === 'new';

const buildInitialImageSlots = (listing: Listing): ImageSlot[] => {
    const existingPaths = (listing.images ?? [])
        .filter(Boolean)
        .slice(0, MAX_IMAGES);
    const existingSlots = existingPaths.map((path, index) => ({
        kind: 'existing' as const,
        path,
        url: listing.all_image_urls?.[index] ?? `/storage/${path}`,
        failed: false,
    }));

    return [
        ...existingSlots,
        ...Array.from({ length: MAX_IMAGES - existingSlots.length }, () => ({
            kind: 'empty' as const,
        })),
    ];
};

export default function EditListing({
    listing,
    categories,
    hasBids,
}: {
    listing: Listing;
    categories: Category[];
    hasBids?: boolean;
}) {
    const { t } = useTranslations();
    const listingHasBids = hasBids ?? (listing.bids_count ?? 0) > 0;
    const initialImageSlots = buildInitialImageSlots(listing);
    const { data, setData, post, processing, errors, transform } = useForm({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        categories: listing.categories.map((c) => c.id),
        location: listing.location || '',
        status: listing.status as 'draft' | 'active',
        condition: listing.condition,
        is_auction: listing.is_auction,
        reserve_price: listing.reserve_price?.toString() || '',
        buy_now_price: listing.buy_now_price?.toString() || '',
        auction_end_date: listing.auction_end_date
            ? listing.auction_end_date.slice(0, 16)
            : '',
        shipping_payer: listing.shipping_payer ?? 'seller',
        shipping_method: listing.shipping_method ?? 'kuroneko_yamato',
        shipping_cost_type: listing.shipping_cost_type ?? 'free',
        shipping_cost: listing.shipping_cost?.toString() || '',
        existing_images: initialImageSlots
            .filter(isKeptExistingImageSlot)
            .map((slot) => slot.path),
        images: [] as File[],
    });

    const statusRef = useRef<'draft' | 'active'>(
        listing.status as 'draft' | 'active',
    );
    const [imageSlots, setImageSlots] =
        useState<ImageSlot[]>(initialImageSlots);
    const [isCompressing, setIsCompressing] = useState(false);

    const syncImageData = (slots: ImageSlot[]) => {
        setData(
            'existing_images',
            slots.filter(isKeptExistingImageSlot).map((slot) => slot.path),
        );
        setData(
            'images',
            slots.filter(isNewImageSlot).map((slot) => slot.file),
        );
    };

    const updateImageSlots = (updater: (slots: ImageSlot[]) => ImageSlot[]) => {
        setImageSlots((currentSlots) => {
            const nextSlots = updater(currentSlots);
            syncImageData(nextSlots);
            return nextSlots;
        });
    };

    const handleImageSlotChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        e.target.value = '';

        if (!file) {
            return;
        }

        setIsCompressing(true);

        try {
            const result = await ImageCompressor.compress(file);

            updateImageSlots((slots) =>
                slots.map((slot, slotIndex) =>
                    slotIndex === index
                        ? {
                              kind: 'new',
                              file: result.file,
                              previewUrl: result.previewUrl,
                              stat: result,
                          }
                        : slot,
                ),
            );
        } catch (error) {
            console.error('Compression failed:', error);
            alert('Failed to process this image. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImageSlot = (index: number) => {
        updateImageSlots((slots) =>
            slots.map((slot, slotIndex) =>
                slotIndex === index ? { kind: 'empty' } : slot,
            ),
        );
    };

    const markImageBroken = (index: number) => {
        updateImageSlots((slots) =>
            slots.map((slot, slotIndex) =>
                slotIndex === index && slot.kind === 'existing'
                    ? { ...slot, failed: true }
                    : slot,
            ),
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('marketplace.title'), href: '/marketplace' },
        {
            title: t('listing.edit.title'),
            href: `/listings/${listing.id}/edit`,
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            listingHasBids &&
            !confirm(
                t('listing.edit.bid_warning_confirm') ||
                    'This listing already has bids. Changes may affect bidders and watchers. Save these changes?',
            )
        ) {
            return;
        }
        transform((data) => ({
            ...data,
            _method: 'PATCH',
            status: statusRef.current,
        }));
        post(`/listings/${listing.id}`, {
            forceFormData: true,
        });
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

                {listingHasBids && (
                    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>
                            {t('listing.edit.bid_warning_title') ||
                                'This listing has bids'}
                        </AlertTitle>
                        <AlertDescription className="text-amber-800">
                            {t('listing.edit.bid_warning_description') ||
                                'Review changes carefully before saving. Price and status changes can notify watchers and affect active bidders.'}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <Card className="p-4 sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                            {t('listing.create.basic_info')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">
                                    {t('listing.create.item_title')}{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="e.g., iPhone 13 Pro Max"
                                    className="mt-1"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">
                                    {t('listing.create.description')}{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Describe your item in detail..."
                                    rows={5}
                                    className="mt-1"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="price">
                                        {data.is_auction
                                            ? t('listing.create.starting_bid')
                                            : t('listing.create.price')}{' '}
                                        (¥){' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0"
                                        className="mt-1"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        {t('listing.create.categories')}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-1">
                                        <CategoryMultiSelect
                                            categories={categories}
                                            value={data.categories}
                                            onChange={(value) =>
                                                setData('categories', value)
                                            }
                                            maxSelections={5}
                                            error={errors.categories}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="condition">
                                        {t('listing.create.item_condition')}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {ITEM_CONDITIONS.map((condition) => (
                                            <Button
                                                key={condition.value}
                                                type="button"
                                                variant={
                                                    data.condition ===
                                                    condition.value
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setData(
                                                        'condition',
                                                        condition.value,
                                                    )
                                                }
                                                className="rounded-full"
                                            >
                                                {t(condition.labelKey)}
                                            </Button>
                                        ))}
                                    </div>
                                    {errors.condition && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.condition}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="location">
                                        {t('listing.create.location')}
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        placeholder="e.g., Tokyo, Shibuya"
                                        className="mt-1"
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">
                                            {t('listing.create.auction_mode')}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'listing.create.auction_mode_desc',
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={
                                            data.is_auction
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setData(
                                                'is_auction',
                                                !data.is_auction,
                                            )
                                        }
                                    >
                                        {data.is_auction
                                            ? t('listing.create.enabled')
                                            : t('listing.create.disabled')}
                                    </Button>
                                </div>

                                {data.is_auction && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="reserve_price">
                                                {t(
                                                    'listing.create.reserve_price',
                                                )}{' '}
                                                (¥)
                                            </Label>
                                            <Input
                                                id="reserve_price"
                                                type="number"
                                                step="1"
                                                min="1"
                                                value={data.reserve_price}
                                                onChange={(e) =>
                                                    setData(
                                                        'reserve_price',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0"
                                                className="mt-1"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t(
                                                    'listing.create.reserve_price_help',
                                                )}
                                            </p>
                                            {errors.reserve_price && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.reserve_price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="auction_end_date">
                                                {t(
                                                    'listing.create.auction_end_date',
                                                )}
                                            </Label>
                                            <Input
                                                id="auction_end_date"
                                                type="datetime-local"
                                                value={data.auction_end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'auction_end_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t(
                                                    'listing.create.date_help',
                                                ) ||
                                                    'Leave blank for default 30-day duration.'}
                                            </p>
                                            {errors.auction_end_date && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.auction_end_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="buy_now_price">
                                        {t('listing.create.buy_now_price')} (¥)
                                    </Label>
                                    <Input
                                        id="buy_now_price"
                                        type="number"
                                        min="0"
                                        value={data.buy_now_price}
                                        onChange={(e) =>
                                            setData(
                                                'buy_now_price',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'listing.create.buy_now_placeholder',
                                        )}
                                        className="mt-1"
                                    />
                                    {errors.buy_now_price && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.buy_now_price}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <ShippingSettingsCard
                        data={{
                            shipping_payer: data.shipping_payer,
                            shipping_method: data.shipping_method,
                            shipping_cost_type: data.shipping_cost_type,
                            shipping_cost: data.shipping_cost,
                        }}
                        errors={errors}
                        setData={setData}
                    />

                    <Card className="p-4 sm:p-6">
                        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold sm:text-xl">
                                    {t('listing.create.images_title') ||
                                        'Photos'}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Add or replace photos. Empty and broken
                                    slots are not kept unless you add a new
                                    photo.
                                </p>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {
                                    imageSlots.filter(
                                        (slot) =>
                                            slot.kind !== 'empty' &&
                                            !(
                                                slot.kind === 'existing' &&
                                                slot.failed
                                            ),
                                    ).length
                                }
                                /{MAX_IMAGES}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {imageSlots.map((slot, index) => {
                                const inputId = `image-slot-${index}`;
                                const hasImage =
                                    slot.kind === 'existing' ||
                                    slot.kind === 'new';
                                const previewUrl =
                                    slot.kind === 'existing'
                                        ? slot.url
                                        : slot.kind === 'new'
                                          ? slot.previewUrl
                                          : null;
                                const isBroken =
                                    slot.kind === 'existing' && slot.failed;

                                return (
                                    <div
                                        key={inputId}
                                        className="group relative aspect-square overflow-hidden rounded-lg border border-dashed border-[#cfddee] bg-[#f7f9fc]"
                                    >
                                        {previewUrl && !isBroken ? (
                                            <img
                                                src={previewUrl}
                                                alt={`Photo ${index + 1}`}
                                                onError={() =>
                                                    markImageBroken(index)
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <label
                                                htmlFor={inputId}
                                                className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-3 text-center text-sm font-medium text-[#5f6c84] transition hover:bg-[#eef5fb]"
                                            >
                                                {isBroken ? (
                                                    <ImageOff className="h-7 w-7 text-[#b42318]" />
                                                ) : (
                                                    <Upload className="h-7 w-7 text-[#8ca2b8]" />
                                                )}
                                                <span>
                                                    {isBroken
                                                        ? 'Replace photo'
                                                        : 'Add photo'}
                                                </span>
                                            </label>
                                        )}

                                        {hasImage && (
                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                                                <label
                                                    htmlFor={inputId}
                                                    className="cursor-pointer font-semibold hover:underline"
                                                >
                                                    {isBroken
                                                        ? 'Replace'
                                                        : 'Change'}
                                                </label>
                                                {slot.kind === 'new' && (
                                                    <span className="flex items-center gap-1 text-green-300">
                                                        <Sparkles className="h-2.5 w-2.5" />
                                                        -
                                                        {
                                                            slot.stat
                                                                .savingPercent
                                                        }
                                                        %
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {hasImage && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImageSlot(index)
                                                }
                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-100 shadow-sm transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                                                aria-label={`Remove photo ${index + 1}`}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}

                                        <input
                                            id={inputId}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleImageSlotChange(index, e)
                                            }
                                            className="hidden"
                                            disabled={isCompressing}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {isCompressing && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                {t('listing.create.compressing') ||
                                    'Processing image...'}
                            </div>
                        )}

                        {(errors.images || errors.existing_images) && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.images || errors.existing_images}
                            </p>
                        )}
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
                            onClick={() => {
                                statusRef.current = 'draft';
                            }}
                            className="w-full sm:w-auto"
                        >
                            {t('listing.create.save_draft')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={() => {
                                statusRef.current = 'active';
                            }}
                            className="w-full sm:w-auto"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {processing
                                ? t('listing.edit.updating')
                                : t('listing.edit.update')}
                        </Button>
                    </div>
                </form>
            </div>
        </BazaarLayout>
    );
}
