import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    CircleDollarSign,
    FileText,
    Gavel,
    Info,
    MapPinned,
    Package,
    ShieldCheck,
    Sparkles,
    Star,
    Upload,
    X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryMultiSelect } from '@/components/category-multi-select';
import {
    ImageCompressor,
    UnsupportedImageFormatError,
    type CompressionResult,
} from '@/lib/image-compressor';
import { synth } from '@/lib/synth-service';
import { ITEM_CONDITIONS, type ItemCondition } from '@/types/item-conditions';
import { useTranslations } from '@/hooks/use-translations';
import { ShippingSettingsCard } from '@/components/listings/shipping-settings-card';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

const IMAGE_UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

function SectionHeading({
    icon: Icon,
    eyebrow,
    title,
    description,
}: {
    icon: React.ComponentType<{ className?: string }>;
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-5 flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#dff7f3] text-[#0f766e]">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <div className="text-xs font-bold tracking-wide text-[#0f766e] uppercase">
                    {eyebrow}
                </div>
                <h2 className="text-lg font-semibold text-[#0b1b32] sm:text-xl">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[#5f6c84]">
                    {description}
                </p>
            </div>
        </div>
    );
}

function OptionCard({
    selected,
    onClick,
    icon: Icon,
    title,
    description,
}: {
    selected: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-full min-h-24 w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
                selected
                    ? 'border-[#0d9488] bg-[#f0fdfa] shadow-sm ring-2 ring-[#99f6e4]'
                    : 'border-[#dbe7f3] bg-white hover:border-[#94a3b8] hover:bg-[#f8fbfe]'
            }`}
        >
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    selected
                        ? 'bg-[#0d9488] text-white'
                        : 'bg-[#edf2f9] text-[#475569]'
                }`}
            >
                <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-bold text-[#0b1b32]">
                    {title}
                    {selected && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0d9488]" />
                    )}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#5f6c84]">
                    {description}
                </span>
            </span>
        </button>
    );
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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('marketplace.title'),
            href: '/marketplace',
        },
        {
            title: t('listing.create.title'),
            href: '/listings/create',
        },
    ];
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
        main_image_index: null as number | null,
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
    const [compressionStats, setCompressionStats] = useState<
        CompressionResult[]
    >([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const isProfileLocked = !profileSetupComplete;

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(e.target.files || []);
        if (files.length + data.images.length > 5) {
            alert(t('listing.create.max_images_alert'));
            return;
        }

        setIsCompressing(true);

        try {
            const processedImages = await Promise.all(
                files.map(async (file) => {
                    try {
                        return {
                            result: await ImageCompressor.compress(file),
                            error: null,
                        };
                    } catch (error) {
                        return { result: null, error };
                    }
                }),
            );

            const results = processedImages
                .map((image) => image.result)
                .filter((result): result is CompressionResult => Boolean(result));
            const failedImages = processedImages.filter((image) => image.error);

            if (results.length > 0) {
                const compressedFiles = results.map((r) => r.file);
                const newPreviews = results.map((r) => r.previewUrl);

                setData('images', [...data.images, ...compressedFiles]);
                if (data.images.length === 0 && compressedFiles.length > 0) {
                    setData('main_image_index', 0);
                }
                setImagePreviews((prev) => [...prev, ...newPreviews]);
                setCompressionStats((prev) => [...prev, ...results]);

                // Audio feedback
                synth.playSuccess();
            }

            if (failedImages.length > 0) {
                const hasUnsupportedIphoneFormat = failedImages.some(
                    (image) => image.error instanceof UnsupportedImageFormatError,
                );
                alert(
                    hasUnsupportedIphoneFormat
                        ? t('listing.create.iphone_image_processing_failed')
                        : t('listing.create.image_processing_failed'),
                );
            }
        } catch (error) {
            console.error('Compression failed:', error);
            alert(t('listing.create.image_processing_failed'));
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index: number) => {
        const nextImages = data.images.filter((_, i) => i !== index);
        setData('images', nextImages);
        setData(
            'main_image_index',
            data.main_image_index === index
                ? nextImages.length > 0
                    ? 0
                    : null
                : data.main_image_index !== null &&
                    data.main_image_index > index
                  ? data.main_image_index - 1
                  : data.main_image_index,
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
        setData(
            'location',
            [nextPrefecture, nextCity].filter(Boolean).join(', '),
        );
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
            main_image_index:
                data.main_image_index ?? (data.images.length > 0 ? 0 : null),
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

            <div className="mx-auto w-full max-w-full space-y-4 bg-[#f8fafc] px-0 py-2 sm:space-y-6 sm:p-6 lg:max-w-4xl xl:max-w-5xl">
                <div className="border-b border-[#dbe7f3] bg-white px-3 py-4 sm:rounded-lg sm:border sm:px-5">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0b1b32] sm:text-3xl">
                        {t('listing.create.title')}
                    </h1>
                    <p className="mt-1 text-sm text-[#5f6c84] sm:text-base">
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
                                        {t(
                                            'listing.create.profile_required_title',
                                        )}
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-relaxed text-amber-900">
                                        {t(
                                            'listing.create.profile_required_desc',
                                        )}
                                    </p>
                                    {missingProfileFields.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {missingProfileFields.map(
                                                (field) => (
                                                    <span
                                                        key={field}
                                                        className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200"
                                                    >
                                                        {field}
                                                    </span>
                                                ),
                                            )}
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
                        className={
                            isProfileLocked
                                ? 'pointer-events-none space-y-4 opacity-60 sm:space-y-6'
                                : 'space-y-4 sm:space-y-6'
                        }
                    >
                        <Card className="overflow-hidden rounded-none border-x-0 border-[#dbe7f3] bg-white p-3 shadow-sm sm:rounded-lg sm:border-x sm:p-6">
                            <SectionHeading
                                icon={FileText}
                                eyebrow={t('listing.create.step_1')}
                                title={t('listing.create.basic_info')}
                                description={t(
                                    'listing.create.basic_info_help',
                                )}
                            />

                            <div className="space-y-4">
                                <div className="rounded-lg border border-[#dbe7f3] bg-[#f8fbfe] p-3 sm:p-4">
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
                                        placeholder={t(
                                            'listing.create.title_placeholder',
                                        )}
                                        className="mt-2 bg-white"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-lg border border-[#dbe7f3] bg-[#f8fbfe] p-3 sm:p-4">
                                    <Label htmlFor="description">
                                        {t('listing.create.description')}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'listing.create.description_placeholder',
                                        )}
                                        rows={5}
                                        className="mt-2 bg-white"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Price and Category */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-[#dbe7f3] bg-white p-3 sm:p-4">
                                        <Label htmlFor="price">
                                            {data.is_auction
                                                ? t(
                                                      'listing.create.starting_bid',
                                                  )
                                                : t('listing.create.price')}
                                            {' (¥)'}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
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
                                            className="mt-2"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg border border-[#dbe7f3] bg-white p-3 sm:p-4">
                                        <Label>
                                            {t('listing.create.categories')}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="mt-2">
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
                                    <div className="rounded-lg border border-[#dbe7f3] bg-white p-3 sm:p-4">
                                        <Label htmlFor="condition">
                                            {t('listing.create.item_condition')}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            {ITEM_CONDITIONS.map(
                                                (condition) => (
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
                                                        className="h-auto justify-start rounded-lg px-3 py-2 text-left whitespace-normal"
                                                    >
                                                        {t(condition.labelKey)}
                                                    </Button>
                                                ),
                                            )}
                                        </div>
                                        {errors.condition && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.condition}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg border border-[#dbe7f3] bg-white p-3 sm:p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <MapPinned className="h-4 w-4 text-[#0d9488]" />
                                            <Label>
                                                {t('listing.create.location')}
                                            </Label>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label
                                                    htmlFor="public_prefecture"
                                                    className="text-xs text-[#5f6c84]"
                                                >
                                                    {t('Prefecture')}
                                                </Label>
                                                <Input
                                                    id="public_prefecture"
                                                    type="text"
                                                    value={
                                                        data.public_prefecture
                                                    }
                                                    onChange={(e) =>
                                                        updatePublicLocation(
                                                            'public_prefecture',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'listing.create.prefecture_placeholder',
                                                    )}
                                                    className="mt-1"
                                                />
                                                {errors.public_prefecture && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors.public_prefecture
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="public_city"
                                                    className="text-xs text-[#5f6c84]"
                                                >
                                                    {t('City')}
                                                </Label>
                                                <Input
                                                    id="public_city"
                                                    type="text"
                                                    value={data.public_city}
                                                    onChange={(e) =>
                                                        updatePublicLocation(
                                                            'public_city',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'listing.create.city_placeholder',
                                                    )}
                                                    className="mt-1"
                                                />
                                                {errors.public_city && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.public_city}
                                                    </p>
                                                )}
                                            </div>
                                            <input
                                                type="hidden"
                                                name="location"
                                                value={data.location}
                                            />
                                            {errors.location && (
                                                <p className="mt-1 text-sm text-red-500 sm:col-span-2">
                                                    {errors.location}
                                                </p>
                                            )}
                                        </div>
                                        {data.location && (
                                            <div className="mt-3 rounded-md border border-[#cbd5e1] bg-[#f8fbfe] px-3 py-2 text-sm text-[#334155]">
                                                {data.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Auction and Buy Now */}
                                <div className="space-y-4 rounded-lg border border-[#dbe7f3] bg-[#f8fbfe] p-3 sm:p-4">
                                    <div>
                                        <h3 className="font-semibold text-[#0b1b32]">
                                            {t('listing.create.auction_mode')}
                                        </h3>
                                        <p className="text-sm text-[#5f6c84]">
                                            {t(
                                                'listing.create.auction_mode_desc',
                                            )}
                                        </p>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <OptionCard
                                            selected={!data.is_auction}
                                            onClick={() =>
                                                setAuctionMode(false)
                                            }
                                            icon={CircleDollarSign}
                                            title={t(
                                                'listing.create.fixed_price_option',
                                            )}
                                            description={t(
                                                'listing.create.fixed_price_option_desc',
                                            )}
                                        />
                                        <OptionCard
                                            selected={data.is_auction}
                                            onClick={() => setAuctionMode(true)}
                                            icon={Gavel}
                                            title={t(
                                                'listing.create.auction_mode',
                                            )}
                                            description={t(
                                                'listing.create.auction_option_desc',
                                            )}
                                        />
                                    </div>

                                    {data.is_auction && (
                                        <div className="grid gap-4 rounded-lg border border-[#99f6e4] bg-white p-3 md:grid-cols-3">
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
                                                    value={
                                                        data.auction_end_date
                                                    }
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
                                                    )}
                                                </p>
                                                {errors.auction_end_date && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {
                                                            errors.auction_end_date
                                                        }
                                                    </p>
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

                        <Card className="overflow-hidden rounded-none border-x-0 border-[#dbe7f3] bg-white p-3 shadow-sm sm:rounded-lg sm:border-x sm:p-6">
                            <SectionHeading
                                icon={Camera}
                                eyebrow={t('listing.create.step_3')}
                                title={t('listing.create.images_title')}
                                description={t('listing.create.images_help')}
                            />

                            <div className="space-y-4">
                                {/* Image Upload */}
                                <div className="rounded-lg border border-[#dbe7f3] bg-[#f8fbfe] p-3 sm:p-4">
                                    <Label className="font-semibold text-[#0b1b32]">
                                        {t('listing.create.upload_images')}
                                    </Label>
                                    <div className="mt-2">
                                        <label
                                            htmlFor="images"
                                            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#94a3b8] bg-white p-4 text-center transition hover:border-[#0d9488] hover:bg-[#f0fdfa] sm:p-6"
                                        >
                                            <Upload className="mb-2 h-9 w-9 text-[#0d9488]" />
                                            <span className="text-sm font-bold text-[#0b1b32]">
                                                {t(
                                                    'listing.create.click_to_upload',
                                                )}
                                            </span>
                                            <span className="mt-1 text-xs text-[#5f6c84]">
                                                {t('listing.create.file_types')}
                                            </span>
                                            <span className="mt-3 rounded-full bg-[#edf2f9] px-3 py-1 text-xs font-semibold text-[#334155]">
                                                {t(
                                                    'listing.create.images_selected_count',
                                                    {
                                                        count: data.images
                                                            .length,
                                                    },
                                                )}
                                            </span>
                                        </label>
                                        <input
                                            id="images"
                                            type="file"
                                            accept={IMAGE_UPLOAD_ACCEPT}
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={
                                                data.images.length >= 5 ||
                                                isCompressing
                                            }
                                        />
                                        <AnimatePresence>
                                            {isCompressing && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: 'auto',
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    className="mt-2 flex items-center justify-center gap-2 overflow-hidden text-sm text-muted-foreground"
                                                >
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                    {t(
                                                        'listing.create.compressing',
                                                    )}
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
                                            {imagePreviews.map(
                                                (preview, index) => {
                                                    const stat =
                                                        compressionStats[index];
                                                    return (
                                                        <motion.div
                                                            key={preview}
                                                            layout
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.5,
                                                            }}
                                                            className="group relative aspect-square overflow-hidden rounded-lg border border-[#dbe7f3] bg-[#f8fbfe]"
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={t(
                                                                    'listing.create.image_preview_alt',
                                                                    {
                                                                        number:
                                                                            index +
                                                                            1,
                                                                    },
                                                                )}
                                                                className="h-full w-full object-cover"
                                                            />

                                                            {/* Compression Badge */}
                                                            {stat && (
                                                                <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-1.5 py-1 text-[10px] text-white backdrop-blur-sm transition group-hover:bg-black/80">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="flex items-center gap-1 font-medium text-green-400">
                                                                            <Sparkles className="h-2.5 w-2.5" />
                                                                            -
                                                                            {
                                                                                stat.savingPercent
                                                                            }
                                                                            %
                                                                        </span>
                                                                        <span className="opacity-80">
                                                                            {ImageCompressor.formatBytes(
                                                                                stat.compressedSize,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        'main_image_index',
                                                                        index,
                                                                    )
                                                                }
                                                                className={`absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition ${
                                                                    data.main_image_index ===
                                                                    index
                                                                        ? 'bg-amber-400 text-[#3b2a00]'
                                                                        : 'bg-black/60 text-white opacity-100 hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100'
                                                                }`}
                                                                aria-label={t(
                                                                    'listing.create.set_main_image_label',
                                                                    {
                                                                        number:
                                                                            index +
                                                                            1,
                                                                    },
                                                                )}
                                                            >
                                                                <Star
                                                                    className="h-4 w-4"
                                                                    fill={
                                                                        data.main_image_index ===
                                                                        index
                                                                            ? 'currentColor'
                                                                            : 'none'
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeImage(
                                                                        index,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                                                                aria-label={t(
                                                                    'listing.create.remove_image_label',
                                                                    {
                                                                        number:
                                                                            index +
                                                                            1,
                                                                    },
                                                                )}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </motion.div>
                                                    );
                                                },
                                            )}
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
                                            className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {t(
                                                        'listing.create.optimization',
                                                    )}
                                                    :{' '}
                                                    {t(
                                                        'listing.create.compressed_from',
                                                    )}{' '}
                                                    <span className="font-bold">
                                                        {ImageCompressor.formatBytes(
                                                            compressionStats.reduce(
                                                                (acc, curr) =>
                                                                    acc +
                                                                    curr.originalSize,
                                                                0,
                                                            ),
                                                        )}
                                                    </span>{' '}
                                                    {t(
                                                        'listing.create.compressed_to',
                                                    )}{' '}
                                                    <span className="font-bold">
                                                        {ImageCompressor.formatBytes(
                                                            compressionStats.reduce(
                                                                (acc, curr) =>
                                                                    acc +
                                                                    curr.compressedSize,
                                                                0,
                                                            ),
                                                        )}
                                                    </span>
                                                    .
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                        <Card
                            className={`rounded-none border-x-0 p-3 shadow-sm transition sm:rounded-lg sm:border-x sm:p-5 ${
                                data.terms_accepted
                                    ? 'border-[#0d9488] bg-[#f0fdfa] ring-2 ring-[#99f6e4]'
                                    : 'border-[#dbe7f3] bg-white'
                            }`}
                        >
                            <div className="flex gap-4">
                                <Checkbox
                                    id="terms_accepted"
                                    checked={data.terms_accepted}
                                    onCheckedChange={(checked) =>
                                        setData('terms_accepted', !!checked)
                                    }
                                    className="mt-0.5 size-7 rounded-md border-2 border-[#64748b] bg-white data-[state=checked]:border-[#0d9488] data-[state=checked]:bg-[#0d9488] [&_svg]:size-5"
                                />
                                <div className="min-w-0">
                                    <Label
                                        htmlFor="terms_accepted"
                                        className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#0b1b32]"
                                    >
                                        <ShieldCheck className="h-4 w-4 text-[#0d9488]" />
                                        {t(
                                            'listing.create.confirm_before_publishing',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm leading-relaxed text-[#1a263b]">
                                        {t('terms.accept_checkbox')}{' '}
                                        <Link
                                            href="/terms"
                                            className="font-bold text-[#0d9488] hover:underline"
                                            target="_blank"
                                        >
                                            {t('layout.footer.terms')}
                                        </Link>
                                        {' & '}
                                        <Link
                                            href="/privacy"
                                            className="font-bold text-[#0d9488] hover:underline"
                                            target="_blank"
                                        >
                                            {t('layout.footer.privacy')}
                                        </Link>
                                    </p>
                                    <p className="mt-3 flex gap-2 rounded-lg border border-[#dbe7f3] bg-white px-3 py-2 text-xs leading-relaxed text-[#5f6c84]">
                                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0d9488]" />
                                        {t('terms.platform_free_notice')}
                                    </p>
                                </div>
                            </div>
                            {errors.terms_accepted && (
                                <p className="mt-3 text-sm font-medium text-red-500">
                                    {errors.terms_accepted}
                                </p>
                            )}
                        </Card>
                    </fieldset>

                    {/* Actions */}
                    <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-[#dbe7f3] bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:static sm:flex-row sm:items-center sm:justify-end sm:rounded-lg sm:border sm:px-4">
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
                            onClick={() => {
                                statusRef.current = 'draft';
                            }}
                            className="w-full sm:w-auto"
                        >
                            {t('listing.create.save_draft')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || isProfileLocked}
                            onClick={() => {
                                statusRef.current = 'active';
                            }}
                            className="w-full sm:w-auto"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {processing
                                ? t('listing.create.publishing')
                                : t('listing.create.publish')}
                        </Button>
                    </div>
                </form>
            </div>
        </BazaarLayout>
    );
}
