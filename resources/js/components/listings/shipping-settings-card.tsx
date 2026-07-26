import { ExternalLink, MapPin, PackageCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FreeShippingBadge } from '@/components/listings/free-shipping-badge';
import { useTranslations } from '@/hooks/use-translations';

export const YAMATO_RATE_TABLE_URL =
    'https://www.kuronekoyamato.co.jp/ytc/en/search/estimate/all_list.html';

type ShippingPayer = 'seller' | 'buyer';
type ShippingCostType = 'free' | 'fixed' | 'location_based' | 'chakubarai';

interface ShippingSettingsData {
    shipping_payer: ShippingPayer;
    shipping_method: 'kuroneko_yamato';
    shipping_cost_type: ShippingCostType;
    shipping_cost: string;
}

interface ShippingSettingsCardProps {
    data: ShippingSettingsData;
    errors: Partial<Record<keyof ShippingSettingsData, string>>;
    setData: <K extends keyof ShippingSettingsData>(
        key: K,
        value: ShippingSettingsData[K],
    ) => void;
}

const yamatoSizes = [
    {
        size: '60',
        dimensionsKey: 'listing.create.yamato_size_60',
        weightKey: 'listing.create.yamato_weight_2',
    },
    {
        size: '80',
        dimensionsKey: 'listing.create.yamato_size_80',
        weightKey: 'listing.create.yamato_weight_5',
    },
    {
        size: '100',
        dimensionsKey: 'listing.create.yamato_size_100',
        weightKey: 'listing.create.yamato_weight_10',
    },
    {
        size: '120',
        dimensionsKey: 'listing.create.yamato_size_120',
        weightKey: 'listing.create.yamato_weight_15',
    },
    {
        size: '140',
        dimensionsKey: 'listing.create.yamato_size_140',
        weightKey: 'listing.create.yamato_weight_20',
    },
    {
        size: '160',
        dimensionsKey: 'listing.create.yamato_size_160',
        weightKey: 'listing.create.yamato_weight_25',
    },
    {
        size: '180',
        dimensionsKey: 'listing.create.yamato_size_180',
        weightKey: 'listing.create.yamato_weight_30',
    },
    {
        size: '200',
        dimensionsKey: 'listing.create.yamato_size_200',
        weightKey: 'listing.create.yamato_weight_30',
    },
];

export function ShippingSettingsCard({
    data,
    errors,
    setData,
}: ShippingSettingsCardProps) {
    const { t } = useTranslations();

    const chooseFreeShipping = () => {
        setData('shipping_payer', 'seller');
        setData('shipping_cost_type', 'free');
        setData('shipping_cost', '');
    };

    const chooseBuyerPays = (costType: Exclude<ShippingCostType, 'free'>) => {
        setData('shipping_payer', 'buyer');
        setData('shipping_cost_type', costType);
        if (costType !== 'fixed') {
            setData('shipping_cost', '');
        }
    };

    return (
        <Card className="w-full max-w-full overflow-hidden rounded-none border-x-0 p-3 sm:rounded-lg sm:border-x sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="text-xs font-bold tracking-wide text-[#0f766e] uppercase">
                        {t('listing.create.step_2')}
                    </div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0b1b32] sm:text-xl">
                        <Truck className="h-5 w-5 text-[#0d9488]" />
                        {t('listing.create.shipping_settings')}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('listing.create.shipping_settings_desc')}
                    </p>
                </div>
                <a
                    href={YAMATO_RATE_TABLE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#cbd5e1] px-4 text-sm font-semibold text-[#0f766e] transition hover:bg-[#f0fdfa] sm:w-auto"
                >
                    {t('listing.create.check_yamato_rates')}
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>

            <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
                <div className="space-y-3 sm:space-y-4">
                    <div className="rounded-lg border border-[#dbe7f3] bg-[#f8fbfe] p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dff7f3] text-[#0f766e]">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-[#0b1b32]">
                                    {t('listing.create.yamato_service')}
                                </div>
                                <div className="text-xs text-[#5f6c84]">
                                    {t('listing.create.yamato_service_desc')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
                        <Button
                            type="button"
                            variant={
                                data.shipping_payer === 'seller'
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={chooseFreeShipping}
                            className="h-auto justify-start rounded-lg p-3 text-left whitespace-normal sm:p-4"
                        >
                            <span className="min-w-0">
                                <span className="mb-2 flex flex-wrap items-center gap-2 font-bold">
                                    <FreeShippingBadge />
                                </span>
                                <span className="block text-xs opacity-80">
                                    {t(
                                        'listing.create.seller_pays_shipping_desc',
                                    )}
                                </span>
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant={
                                data.shipping_payer === 'buyer'
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => chooseBuyerPays('fixed')}
                            className="h-auto justify-start rounded-lg p-3 text-left whitespace-normal sm:p-4"
                        >
                            <span className="min-w-0">
                                <span className="block font-bold">
                                    {t('listing.create.buyer_pays_shipping')}
                                </span>
                                <span className="block text-xs opacity-80">
                                    {t(
                                        'listing.create.buyer_pays_shipping_desc',
                                    )}
                                </span>
                            </span>
                        </Button>
                    </div>

                    {data.shipping_payer === 'buyer' && (
                        <div className="space-y-3 rounded-lg border bg-muted/30 p-3 sm:space-y-4 sm:p-4">
                            <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
                                <Button
                                    type="button"
                                    variant={
                                        data.shipping_cost_type === 'fixed'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => chooseBuyerPays('fixed')}
                                    className="h-auto rounded-lg p-3 whitespace-normal"
                                >
                                    {t('listing.create.fixed_shipping_cost')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        data.shipping_cost_type ===
                                        'location_based'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        chooseBuyerPays('location_based')
                                    }
                                    className="h-auto rounded-lg p-3 whitespace-normal"
                                >
                                    {t(
                                        'listing.create.location_based_shipping',
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        data.shipping_cost_type === 'chakubarai'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        chooseBuyerPays('chakubarai')
                                    }
                                    className="h-auto rounded-lg p-3 whitespace-normal"
                                >
                                    {t('listing.create.chakubarai_shipping')}
                                </Button>
                            </div>

                            {data.shipping_cost_type === 'fixed' && (
                                <div>
                                    <Label htmlFor="shipping_cost">
                                        {t('listing.create.shipping_cost_yen')}
                                    </Label>
                                    <Input
                                        id="shipping_cost"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.shipping_cost}
                                        onChange={(e) =>
                                            setData(
                                                'shipping_cost',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0"
                                        className="mt-1"
                                    />
                                    {errors.shipping_cost && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.shipping_cost}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.shipping_cost_type === 'location_based' && (
                                <div className="flex gap-3 rounded-lg border border-dashed border-[#cbd5e1] bg-white p-3 text-sm text-[#334155]">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]" />
                                    <span className="min-w-0">
                                        {t(
                                            'listing.create.location_based_shipping_desc',
                                        )}
                                    </span>
                                </div>
                            )}

                            {data.shipping_cost_type === 'chakubarai' && (
                                <div className="flex gap-3 rounded-lg border border-dashed border-[#cbd5e1] bg-white p-3 text-sm text-[#334155]">
                                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]" />
                                    <span className="min-w-0">
                                        {t(
                                            'listing.create.chakubarai_shipping_desc',
                                        )}
                                    </span>
                                </div>
                            )}

                            {errors.shipping_cost_type && (
                                <p className="text-sm text-red-500">
                                    {errors.shipping_cost_type}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border border-[#dbe7f3]">
                    <div className="border-b border-[#dbe7f3] bg-[#f8fbfe] px-3 py-3 sm:px-4">
                        <div className="text-sm font-bold text-[#0b1b32]">
                            {t('listing.create.yamato_size_table')}
                        </div>
                        <div className="text-xs text-[#5f6c84]">
                            {t('listing.create.yamato_size_table_desc')}
                        </div>
                    </div>
                    <div className="max-h-[320px] overflow-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-white text-[#5f6c84]">
                                <tr>
                                    <th className="px-3 py-2 font-semibold sm:px-4">
                                        {t('listing.create.yamato_table_size')}
                                    </th>
                                    <th className="px-3 py-2 font-semibold sm:px-4">
                                        {t(
                                            'listing.create.yamato_table_parcel',
                                        )}
                                    </th>
                                    <th className="px-3 py-2 font-semibold sm:px-4">
                                        {t(
                                            'listing.create.yamato_table_weight',
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {yamatoSizes.map((row) => (
                                    <tr
                                        key={row.size}
                                        className="border-t border-[#edf2f9]"
                                    >
                                        <td className="px-3 py-2 font-bold text-[#0f766e] sm:px-4">
                                            {row.size}
                                        </td>
                                        <td className="px-3 py-2 text-[#1a263b] sm:px-4">
                                            {t(row.dimensionsKey)}
                                        </td>
                                        <td className="px-3 py-2 text-[#1a263b] sm:px-4">
                                            {t(row.weightKey)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {(errors.shipping_payer || errors.shipping_method) && (
                <p className="mt-3 text-sm text-red-500">
                    {errors.shipping_payer || errors.shipping_method}
                </p>
            )}
        </Card>
    );
}
