import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, CreditCard, Megaphone, Plus, Trash2 } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { PlacementPreview } from '@/components/ads/placement-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';
import type { BreadcrumbItem } from '@/types';

type AdvertiserProfile = {
    id: number;
    business_name: string;
    website_url?: string | null;
    contact_email: string;
    contact_phone?: string | null;
    business_description?: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    admin_notes?: string | null;
    campaigns?: AdCampaign[];
};

type AdOrder = {
    id: number;
    amount_jpy: number;
    status: 'unpaid' | 'pending_confirmation' | 'paid' | 'cancelled' | 'refunded';
    payment_reference?: string | null;
};

type AdCampaign = {
    id: number;
    title: string;
    description: string;
    image_url?: string | null;
    target_url: string;
    placement: string;
    package_key: string;
    status: string;
    starts_at?: string | null;
    ends_at?: string | null;
    price_jpy: number;
    admin_notes?: string | null;
    order?: AdOrder | null;
};

export default function AdvertisingIndex({
    advertiserProfile,
    packages,
    placements,
}: {
    advertiserProfile?: AdvertiserProfile | null;
    packages: Record<string, { label: string; price_jpy: number; duration_days: number; placement: string }>;
    placements: Record<string, { label: string; creative: string }>;
}) {
    const { t } = useTranslations();
    const { errors, auth } = usePage().props as any;
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('advertising.title'), href: '/advertising' }];
    const [businessName, setBusinessName] = useState(advertiserProfile?.business_name ?? auth.user?.store_name ?? '');
    const [websiteUrl, setWebsiteUrl] = useState(advertiserProfile?.website_url ?? '');
    const [contactEmail, setContactEmail] = useState(advertiserProfile?.contact_email ?? auth.user?.email ?? '');
    const [contactPhone, setContactPhone] = useState(advertiserProfile?.contact_phone ?? auth.user?.phone ?? '');
    const [businessDescription, setBusinessDescription] = useState(advertiserProfile?.business_description ?? '');

    const apply = (event: FormEvent) => {
        event.preventDefault();
        router.post('/advertising/apply', {
            business_name: businessName,
            website_url: websiteUrl,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            business_description: businessDescription,
        });
    };

    const isApproved = advertiserProfile?.status === 'approved';

    return (
        <BazaarLayout title={t('advertising.title')} breadcrumbs={breadcrumbs} showTitle>
            <Head title={t('advertising.title')} />

            <div className="space-y-4">
                {errors?.advertiser && (
                    <div className={errorNotice}>
                        {errors.advertiser}
                    </div>
                )}

                <section className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <Megaphone size={18} className="text-[#0d9488]" />
                                <h2 className="text-lg font-bold text-[#0b1b32]">
                                    {t('advertising.account.title')}
                                </h2>
                            </div>
                            <p className="mt-1 max-w-2xl text-sm text-[#5f6c84]">
                                {t('advertising.account.description')}
                            </p>
                        </div>
                        {advertiserProfile && (
                            <Badge className={statusClass(advertiserProfile.status)}>
                                {formatStatus(advertiserProfile.status, t)}
                            </Badge>
                        )}
                    </div>

                    {!isApproved && (
                        <form onSubmit={apply} className="mt-4 grid gap-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label={t('advertising.fields.business_name')} error={errors?.business_name}>
                                    <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} required />
                                </Field>
                                <Field label={t('advertising.fields.website_url')} error={errors?.website_url}>
                                    <Input value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} placeholder="https://example.com" />
                                </Field>
                                <Field label={t('advertising.fields.contact_email')} error={errors?.contact_email}>
                                    <Input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} required />
                                </Field>
                                <Field label={t('advertising.fields.contact_phone')} error={errors?.contact_phone}>
                                    <Input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} required />
                                </Field>
                            </div>
                            <Field label={t('advertising.fields.business_description')} error={errors?.business_description}>
                                <Textarea value={businessDescription} onChange={(event) => setBusinessDescription(event.target.value)} className="min-h-24" required />
                            </Field>
                            {advertiserProfile?.admin_notes && (
                                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                    {advertiserProfile.admin_notes}
                                </div>
                            )}
                            <Button type="submit" className="w-fit rounded-[4px]">
                                {advertiserProfile ? t('advertising.account.resubmit') : t('advertising.account.apply')}
                            </Button>
                        </form>
                    )}
                </section>

                {isApproved && (
                    <>
                        <section className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-[#0b1b32]">{t('advertising.packages.title')}</h2>
                                    <p className="mt-1 text-sm text-[#5f6c84]">
                                        {t('advertising.packages.description')}
                                    </p>
                                </div>
                                <Button asChild className="rounded-[4px]">
                                    <Link href="/advertising/campaigns/create">
                                        <Plus size={15} />
                                        {t('advertising.campaigns.new_request')}
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-4 grid gap-2 lg:grid-cols-2">
                                {Object.entries(packages).map(([key, pkg]) => (
                                    <div key={key} className="grid gap-3 rounded border border-[#edf2f7] bg-[#fbfdff] p-3 sm:grid-cols-[1fr_180px]">
                                        <div>
                                            <div className="text-sm font-bold text-[#0b1b32]">{pkg.label}</div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                {placements[pkg.placement]?.label ?? pkg.placement} · {t('advertising.packages.ad_format', { format: placements[pkg.placement]?.creative ?? t('advertising.format.standard') })}
                                            </div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                {t('advertising.packages.rotates_notice')}
                                            </div>
                                            <div className="mt-2 text-lg font-bold text-[#0f766e]">
                                                ¥{pkg.price_jpy.toLocaleString()}
                                            </div>
                                        </div>
                                        <PlacementPreview
                                            placement={pkg.placement}
                                            label={t('advertising.placement_preview')}
                                            className="self-start"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="px-1 text-lg font-bold text-[#0b1b32]">{t('advertising.campaigns.your_requests')}</h2>
                            {(advertiserProfile.campaigns ?? []).length === 0 ? (
                                <div className="rounded border border-[#dce5ef] bg-white px-4 py-10 text-center text-sm text-[#667085]">
                                    {t('advertising.campaigns.empty')}
                                </div>
                            ) : (
                                advertiserProfile.campaigns?.map((campaign) => (
                                    <CampaignRow key={campaign.id} campaign={campaign} packages={packages} t={t} />
                                ))
                            )}
                        </section>
                    </>
                )}
            </div>
        </BazaarLayout>
    );
}

function CampaignRow({
    campaign,
    packages,
    t,
}: {
    campaign: AdCampaign;
    packages: Record<string, { label: string; placement: string }>;
    t: (key: string, replacements?: Record<string, any>) => string;
}) {
    const [paymentReference, setPaymentReference] = useState(campaign.order?.payment_reference ?? '');

    const submitPayment = () => {
        router.post(`/advertising/campaigns/${campaign.id}/payment`, {
            payment_reference: paymentReference,
        }, { preserveScroll: true });
    };

    const deleteCampaign = () => {
        if (!confirm(t('advertising.campaigns.delete_confirm', { title: campaign.title }))) {
            return;
        }
        router.delete(`/advertising/campaigns/${campaign.id}`, { preserveScroll: true });
    };

    return (
        <div className="rounded border border-[#dce5ef] bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded border border-[#d8e2ee] bg-[#f0f5fd] md:w-36">
                    {campaign.image_url ? (
                        <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                    ) : (
                        <Megaphone className="text-[#a3b6cc]" size={28} />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={statusClass(campaign.status)}>{formatStatus(campaign.status, t)}</Badge>
                        {campaign.order && <Badge className={statusClass(campaign.order.status)}>{formatStatus(campaign.order.status, t)}</Badge>}
                    </div>
                    <h3 className="mt-2 truncate text-base font-bold text-[#0b1b32]">{campaign.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#5f6c84]">{campaign.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">
                        <span>{packages[campaign.package_key]?.label ?? campaign.package_key}</span>
                        <span>¥{campaign.price_jpy.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {campaign.starts_at ? formatDate(campaign.starts_at) : t('advertising.campaigns.admin_scheduled')}
                        </span>
                        {campaign.ends_at && (
                            <span>{t('advertising.campaigns.ends', { date: formatDate(campaign.ends_at) })}</span>
                        )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#64748b]">
                        {visibilityMessage(campaign, t)}
                    </p>
                    {campaign.admin_notes && (
                        <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                            {campaign.admin_notes}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 md:w-64">
                    {campaign.order?.status !== 'paid' && (
                        <>
                            <Input
                                value={paymentReference}
                                onChange={(event) => setPaymentReference(event.target.value)}
                                placeholder={t('advertising.payment.reference')}
                            />
                            <Button type="button" size="sm" onClick={submitPayment} className="h-8 rounded-[4px]">
                                <CreditCard size={14} />
                                {t('advertising.payment.submit_reference')}
                            </Button>
                        </>
                    )}
                    {!['active', 'scheduled'].includes(campaign.status) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={deleteCampaign}
                            className="h-8 rounded-[4px] border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={14} />
                            {t('common.delete')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <label className="grid gap-1 text-sm font-medium text-[#334155]">
            <span>{label}</span>
            {children}
            {error && <span className="text-xs text-red-600">{error}</span>}
        </label>
    );
}

function formatStatus(status: string, t: (key: string) => string) {
    return t(`advertising.status.${status}`);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

function visibilityMessage(campaign: AdCampaign, t: (key: string, replacements?: Record<string, any>) => string) {
    const now = Date.now();
    const startsAt = campaign.starts_at ? new Date(campaign.starts_at).getTime() : null;
    const endsAt = campaign.ends_at ? new Date(campaign.ends_at).getTime() : null;

    if (campaign.status !== 'active') {
        return t('advertising.visibility.campaign_status', { status: formatStatus(campaign.status, t) });
    }

    if (campaign.order?.status !== 'paid') {
        return t('advertising.visibility.payment_status', { status: formatStatus(campaign.order?.status ?? 'unpaid', t) });
    }

    if (startsAt && startsAt > now) {
        return t('advertising.visibility.scheduled', { date: formatDate(campaign.starts_at as string) });
    }

    if (endsAt && endsAt < now) {
        return t('advertising.visibility.ended', { date: formatDate(campaign.ends_at as string) });
    }

    return t('advertising.visibility.live');
}

function statusClass(status: string) {
    if (['approved', 'active', 'paid'].includes(status)) {
        return 'border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0 text-[11px] text-[#166534]';
    }
    if (['pending', 'pending_payment', 'pending_confirmation', 'pending_review', 'scheduled'].includes(status)) {
        return 'border-amber-200 bg-amber-50 px-1.5 py-0 text-[11px] text-amber-700';
    }
    if (['rejected', 'suspended', 'cancelled', 'refunded'].includes(status)) {
        return 'border-red-200 bg-red-50 px-1.5 py-0 text-[11px] text-red-700';
    }
    return 'border-[#dbe4f0] bg-[#f8fafc] px-1.5 py-0 text-[11px] text-[#475467]';
}

const errorNotice = 'rounded border border-[#f1c7c7] bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#b42318]';
