import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle, Upload, X, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryMultiSelect } from '@/components/category-multi-select';
import { ImageCompressor, type CompressionResult } from '@/lib/image-compressor';
import { synth } from '@/lib/synth-service';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';
import { useTranslations } from '@/hooks/use-translations';
import { ShippingSettingsCard } from '@/components/listings/shipping-settings-card';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marketplace',
        href: '/marketplace',
    },
    {
        title: 'Create Listing',
        href: '/listings/create',
    },
];

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

export default function CreateListing({
    categories,
    profileSetupComplete = true,
    missingProfileFields = [],
}: {
    categories: Category[];
    profileSetupComplete?: boolean;
    missingProfileFields?: string[];
}) {
    const { t } = useTranslations();
    const { auth } = usePage().props as any;
    const defaultLocation = [auth.user?.prefecture, auth.user?.city]
        .filter(Boolean)
        .join(', ');
    const { data, setData, post, processing, errors, transform } = useForm({
        title: '',
        description: '',
        price: '',
        categories: [] as number[],
        location: defaultLocation,
        public_prefecture: auth.user?.prefecture || '',
        public_city: auth.user?.city || '',
        images: [] as File[],
        status: 'draft',
        condition: '' as ItemCondition | '',
        is_auction: false,
        reserve_price: '',
        buy_now_price: '',
        auction_end_date: '',
        auction_timezone_offset: new Date().getTimezoneOffset(),
        shipping_payer: 'seller' as 'seller' | 'buyer',
        shipping_method: 'kuroneko_yamato' as const,
        shipping_cost_type: 'free' as
            | 'free'
            | 'fixed'
            | 'location_based'
            | 'chakubarai',
        shipping_cost: '',
        terms_accepted: false,
    });

    const statusRef = useRef<'draft' | 'active'>('draft');

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [compressionStats, setCompressionStats] = useState<CompressionResult[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const isProfileLocked = !profileSetupComplete;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + data.images.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setIsCompressing(true);

        try {
            const results = await Promise.all(
                files.map((file) => ImageCompressor.compress(file))
            );

            const compressedFiles = results.map((r) => r.file);
            const newPreviews = results.map((r) => r.previewUrl);

            setData('images', [...data.images, ...compressedFiles]);
            setImagePreviews((prev) => [...prev, ...newPreviews]);
            setCompressionStats((prev) => [...prev, ...results]);

            // Audio feedback
            synth.playSuccess();
        } catch (error) {
            console.error('Compression failed:', error);
            alert('Failed to process some images. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, i) => i !== index)
        );
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setCompressionStats((prev) => prev.filter((_, i) => i !== index));

        // Audio feedback
        synth.playPop();
    };

    const setAuctionMode = (enabled: boolean) => {
        setData('is_auction', enabled);

        if (!enabled) {
            setData('reserve_price', '');
            setData('buy_now_price', '');
            setData('auction_end_date', '');
        }
    };

    const updatePublicLocation = (
        field: 'public_prefecture' | 'public_city',
        value: string,
    ) => {
        const nextPrefecture =
            field === 'public_prefecture' ? value : data.public_prefecture;
        const nextCity = field === 'public_city' ? value : data.public_city;

        setData(field, value);
        setData('location', [nextPrefecture, nextCity].filter(Boolean).join(', '));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isProfileLocked) {
            return;
        }
        
        if (!data.terms_accepted) {
            alert(t('terms.must_accept'));
            return;
        }

        synth.playFanfare();
        transform((data) => ({
            ...data,
            status: statusRef.current,
            auction_timezone_offset: new Date().getTimezoneOffset(),
        }));
        post('/listings');
    };

    return (
        <BazaarLayout
            title={t('listing.create.title')}
            breadcrumbs={breadcrumbs}
            flushMobile
        >
            <Head title={t('listing.create.title')} />

            <div className="mx-auto w-full max-w-full space-y-4 px-0 py-2 sm:space-y-6 sm:p-6 lg:max-w-4xl xl:max-w-5xl">
                <div className="px-3 sm:px-0">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {t('listing.create.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                        {t('listing.create.subtitle')}
                    </p>
                </div>

                {isProfileLocked && (
                    <Card className="rounded-none border-x-0 border-amber-200 bg-amber-50 p-4 shadow-sm sm:rounded-lg sm:border-x sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-3">
                                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-base font-bold text-amber-950 sm:text-lg">
                                        {t('listing.create.profile_required_title')}
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-relaxed text-amber-900">
                                        {t('listing.create.profile_required_desc')}
                                    </p>
                                    {missingProfileFields.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {missingProfileFields.map((field) => (
                                                <span
                                                    key={field}
                                                    className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200"
                                                >
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                asChild
                                className="shrink-0 bg-amber-700 text-white hover:bg-amber-800"
                            >
                                <Link href="/settings/profile">
                                    {t('listing.create.update_profile')}
                                </Link>
                            </Button>
                        </div>
                    </Card>
                )}

                <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                    <fieldset
                        disabled={isProfileLocked}
                        className={isProfileLocked ? 'pointer-events-none space-y-4 opacity-60 sm:space-y-6' : 'space-y-4 sm:space-y-6'}
                    >
                    {/* Basic Information */}
                    <Card className="rounded-none border-x-0 p-3 sm:rounded-lg sm:border-x sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                            {t('listing.create.basic_info')}
                        </h2>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title">
                                    {t('listing.create.item_title')} <span className="text-red-500">*</span>
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

                            {/* Description */}
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

                            {/* Price and Category */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="price">
                                        {data.is_auction ? t('listing.create.starting_bid') : t('listing.create.price')}{' (¥)'}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="1"
                                        min="0"
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

                            {/* Condition and Location */}
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
                                    {errors.condition && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.condition}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="public_prefecture">{t('Prefecture')}</Label>
                                        <Input
                                            id="public_prefecture"
                                            type="text"
                                            value={data.public_prefecture}
                                            onChange={(e) =>
                                                updatePublicLocation('public_prefecture', e.target.value)
                                            }
                                            placeholder="Tokyo"
                                            className="mt-1"
                                        />
                                        {errors.public_prefecture && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.public_prefecture}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="public_city">{t('City')}</Label>
                                        <Input
                                            id="public_city"
                                            type="text"
                                            value={data.public_city}
                                            onChange={(e) =>
                                                updatePublicLocation('public_city', e.target.value)
                                            }
                                            placeholder="Shibuya"
                                            className="mt-1"
                                        />
                                        {errors.public_city && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.public_city}
                                            </p>
                                        )}
                                    </div>
                                    <input type="hidden" name="location" value={data.location} />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-500 sm:col-span-2">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {data.location && (
                                <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                    {t('listing.create.location')}: {data.location}
                                </div>
                            )}

                            {/* Auction and Buy Now */}
                            <div className="space-y-4 rounded-lg border bg-muted/30 p-3 sm:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{t('listing.create.auction_mode')}</h3>
                                        <p className="text-sm text-muted-foreground">{t('listing.create.auction_mode_desc')}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={data.is_auction ? 'default' : 'outline'}
                                        onClick={() => setAuctionMode(!data.is_auction)}
                                    >
                                        {data.is_auction ? t('listing.create.enabled') : t('listing.create.disabled')}
                                    </Button>
                                </div>

                                {data.is_auction && (
                                    <div className="grid gap-4 md:grid-cols-3">
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
                                                <Label htmlFor="auction_end_date">{t('listing.create.auction_end_date')}</Label>
                                                <Input
                                                    id="auction_end_date"
                                                    type="datetime-local"
                                                    value={data.auction_end_date}
                                                    onChange={(e) => setData('auction_end_date', e.target.value)}
                                                    className="mt-1"
                                                />
                                                <p className="mt-1 text-xs text-muted-foreground">{t('listing.create.date_help') || 'Leave blank for default 30-day duration.'}</p>
                                                {errors.auction_end_date && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.auction_end_date}</p>
                                                )}
                                        </div>
                                        <div>
                                            <Label htmlFor="buy_now_price">
                                                {t(
                                                    'listing.create.buy_now_price',
                                                )}{' '}
                                                (¥)
                                            </Label>
                                            <Input
                                                id="buy_now_price"
                                                type="number"
                                                min="1"
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
                                )}
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

                    {/* Images */}
                    <Card className="rounded-none border-x-0 p-3 sm:rounded-lg sm:border-x sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold sm:text-xl">{t('listing.create.images_title')}</h2>

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <Label>
                                    {t('listing.create.upload_images')}
                                </Label>
                                <div className="mt-2">
                                    <label
                                        htmlFor="images"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition hover:border-gray-400 sm:p-6 dark:border-gray-700 dark:hover:border-gray-600"
                                    >
                                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('listing.create.click_to_upload')}
                                        </span>
                                        <span className="mt-1 text-xs text-gray-500">
                                            {t('listing.create.file_types')}
                                        </span>
                                    </label>
                                    <input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={data.images.length >= 5 || isCompressing}
                                    />
                                    <AnimatePresence>
                                        {isCompressing && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-2 flex items-center justify-center gap-2 overflow-hidden text-sm text-muted-foreground"
                                            >
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                {t('listing.create.compressing')}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {errors.images && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.images}
                                    </p>
                                )}
                            </div>

                            {/* Image Previews */}
                            <AnimatePresence mode="popLayout">
                                {imagePreviews.length > 0 && (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5"
                                    >
                                        {imagePreviews.map((preview, index) => {
                                            const stat = compressionStats[index];
                                            return (
                                                <motion.div
                                                    key={preview}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="group relative aspect-square overflow-hidden rounded-lg border"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />

                                                    {/* Compression Badge */}
                                                    {stat && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 text-[10px] text-white backdrop-blur-sm transition group-hover:bg-black/80">
                                                            <div className="flex items-center justify-between">
                                                                <span className="flex items-center gap-1 font-medium text-green-400">
                                                                    <Sparkles className="h-2.5 w-2.5" />
                                                                    -{stat.savingPercent}%
                                                                </span>
                                                                <span className="opacity-80">
                                                                    {ImageCompressor.formatBytes(stat.compressedSize)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Total Traffic Saved */}
                            <AnimatePresence>
                                {compressionStats.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="rounded-lg bg-green-50 p-3 text-xs text-green-700 shadow-sm dark:bg-green-950/30 dark:text-green-400"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-green-500" />
                                            <span>
                                                {t('listing.create.optimization')}: Compressed{' '}
                                                <span className="font-bold">
                                                    {ImageCompressor.formatBytes(
                                                        compressionStats.reduce((acc, curr) => acc + curr.originalSize, 0)
                                                    )}
                                                </span>{' '}
                                                down to{' '}
                                                <span className="font-bold">
                                                    {ImageCompressor.formatBytes(
                                                        compressionStats.reduce((acc, curr) => acc + curr.compressedSize, 0)
                                                    )}
                                                </span>.
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                    <div className="flex flex-col space-y-4 px-3 sm:px-1">
                        <div className="flex items-start space-x-3">
                            <Checkbox 
                                id="terms_accepted" 
                                checked={data.terms_accepted}
                                onCheckedChange={(checked) => setData('terms_accepted', !!checked)}
                                className="mt-1 border-[#cfddee]"
                            />
                            <Label htmlFor="terms_accepted" className="text-sm font-normal leading-relaxed text-[#1a263b] cursor-pointer">
                                {t('terms.accept_checkbox')}{' '}
                                <Link href="/terms" className="text-[#0d9488] font-bold hover:underline" target="_blank">
                                    {t('layout.footer.terms')}
                                </Link>
                                {' & '}
                                <Link href="/privacy" className="text-[#0d9488] font-bold hover:underline" target="_blank">
                                    {t('layout.footer.privacy')}
                                </Link>
                            </Label>
                        </div>
                        {errors.terms_accepted && (
                            <p className="text-sm text-red-500 font-medium">{errors.terms_accepted}</p>
                        )}
                        <p className="text-xs text-[#5f6c84] italic pl-7 border-l-2 border-[#edf2f9]">
                            {t('terms.platform_free_notice')}
                        </p>
                    </div>
                    </fieldset>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 px-3 sm:flex-row sm:items-center sm:justify-end sm:px-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                (window.location.href = '/marketplace')
                            }
                            className="w-full sm:w-auto"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={processing || isProfileLocked}
                            onClick={() => { statusRef.current = 'draft'; }}
                            className="w-full sm:w-auto"
                        >
                            {t('listing.create.save_draft')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || isProfileLocked}
                            onClick={() => { statusRef.current = 'active'; }}
                            className="w-full sm:w-auto"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {processing ? t('listing.create.publishing') : t('listing.create.publish')}
                        </Button>
                    </div>
                </form>
            </div>
        </BazaarLayout>
    );
}
