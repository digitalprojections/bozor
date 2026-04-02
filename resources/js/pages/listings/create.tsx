import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, X, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryMultiSelect } from '@/components/category-multi-select';
import { ImageCompressor, type CompressionResult } from '@/lib/image-compressor';
import { synth } from '@/lib/synth-service';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';
import { useTranslations } from '@/hooks/use-translations';
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
}: {
    categories: Category[];
}) {
    const { t } = useTranslations();
    const { data, setData, post, processing, errors, transform } = useForm({
        title: '',
        description: '',
        price: '',
        categories: [] as number[],
        location: '',
        images: [] as File[],
        status: 'draft',
        condition: '' as ItemCondition | '',
        is_auction: false,
        buy_now_price: '',
        auction_end_date: '',
        terms_accepted: false,
    });

    const statusRef = useRef<'draft' | 'active'>('draft');

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [compressionStats, setCompressionStats] = useState<CompressionResult[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);

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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.terms_accepted) {
            alert(t('terms.must_accept'));
            return;
        }

        synth.playFanfare();
        transform((data) => ({
            ...data,
            status: statusRef.current,
        }));
        post('/listings');
    };

    return (
        <BazaarLayout title={t('listing.create.title')} breadcrumbs={breadcrumbs}>
            <Head title={t('listing.create.title')} />

            <div className="space-y-6 p-4 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {t('listing.create.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                        {t('listing.create.subtitle')}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="p-4 sm:p-6">
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

                                <div>
                                    <Label htmlFor="location">{t('listing.create.location')}</Label>
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

                            {/* Auction and Buy Now */}
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
                                                <p className="mt-1 text-xs text-muted-foreground">{t('listing.create.date_help') || 'Leave blank for default 30-day duration.'}</p>
                                                {errors.auction_end_date && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.auction_end_date}</p>
                                                )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="buy_now_price">{t('listing.create.buy_now_price')}{' (¥)'}</Label>
                                    <Input
                                        id="buy_now_price"
                                        type="number"
                                        value={data.buy_now_price}
                                        onChange={(e) => setData('buy_now_price', e.target.value)}
                                        placeholder={t('listing.create.buy_now_placeholder')}
                                        className="mt-1"
                                    />
                                    {errors.buy_now_price && (
                                        <p className="mt-1 text-sm text-red-500">{errors.buy_now_price}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Images */}
                    <Card className="p-4 sm:p-6">
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
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
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
                                        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
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
                    <div className="flex flex-col space-y-4 px-1">
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

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
                            {processing ? t('listing.create.publishing') : t('listing.create.publish')}
                        </Button>
                    </div>
                </form>
            </div>
        </BazaarLayout>
    );
}
