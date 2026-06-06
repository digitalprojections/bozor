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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Advertising', href: '/advertising' }];

export default function AdvertisingIndex({
    advertiserProfile,
    packages,
    placements,
}: {
    advertiserProfile?: AdvertiserProfile | null;
    packages: Record<string, { label: string; price_jpy: number; duration_days: number; placement: string }>;
    placements: Record<string, { label: string; creative: string }>;
}) {
    const { errors, flash, auth } = usePage().props as any;
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
        <BazaarLayout title="Advertising" breadcrumbs={breadcrumbs} showTitle>
            <Head title="Advertising" />

            <div className="space-y-4">
                {(flash?.success || errors?.advertiser) && (
                    <div className={errors?.advertiser ? errorNotice : successNotice}>
                        {errors?.advertiser ?? flash?.success}
                    </div>
                )}

                <section className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <Megaphone size={18} className="text-[#0d9488]" />
                                <h2 className="text-lg font-bold text-[#0b1b32]">
                                    Advertiser account
                                </h2>
                            </div>
                            <p className="mt-1 max-w-2xl text-sm text-[#5f6c84]">
                                Apply once, then create fixed-price campaign requests for admin review.
                            </p>
                        </div>
                        {advertiserProfile && (
                            <Badge className={statusClass(advertiserProfile.status)}>
                                {formatStatus(advertiserProfile.status)}
                            </Badge>
                        )}
                    </div>

                    {!isApproved && (
                        <form onSubmit={apply} className="mt-4 grid gap-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Business name" error={errors?.business_name}>
                                    <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} required />
                                </Field>
                                <Field label="Website URL" error={errors?.website_url}>
                                    <Input value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} placeholder="https://example.com" />
                                </Field>
                                <Field label="Contact email" error={errors?.contact_email}>
                                    <Input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} required />
                                </Field>
                                <Field label="Contact phone" error={errors?.contact_phone}>
                                    <Input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} required />
                                </Field>
                            </div>
                            <Field label="Business description" error={errors?.business_description}>
                                <Textarea value={businessDescription} onChange={(event) => setBusinessDescription(event.target.value)} className="min-h-24" required />
                            </Field>
                            {advertiserProfile?.admin_notes && (
                                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                    {advertiserProfile.admin_notes}
                                </div>
                            )}
                            <Button type="submit" className="w-fit rounded-[4px]">
                                {advertiserProfile ? 'Resubmit application' : 'Apply for advertiser account'}
                            </Button>
                        </form>
                    )}
                </section>

                {isApproved && (
                    <>
                        <section className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-[#0b1b32]">Packages</h2>
                                    <p className="mt-1 text-sm text-[#5f6c84]">
                                        Fixed-duration, single-payment placements for launch.
                                        All active paid campaigns in the same placement rotate every 8 seconds.
                                    </p>
                                </div>
                                <Button asChild className="rounded-[4px]">
                                    <Link href="/advertising/campaigns/create">
                                        <Plus size={15} />
                                        New ad request
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-4 grid gap-2 lg:grid-cols-2">
                                {Object.entries(packages).map(([key, pkg]) => (
                                    <div key={key} className="grid gap-3 rounded border border-[#edf2f7] bg-[#fbfdff] p-3 sm:grid-cols-[1fr_180px]">
                                        <div>
                                            <div className="text-sm font-bold text-[#0b1b32]">{pkg.label}</div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                {placements[pkg.placement]?.label ?? pkg.placement} · {placements[pkg.placement]?.creative ?? 'standard'} ad format
                                            </div>
                                            <div className="mt-1 text-xs text-[#667085]">
                                                Rotates with all other active paid ads in this placement.
                                            </div>
                                            <div className="mt-2 text-lg font-bold text-[#0f766e]">
                                                ¥{pkg.price_jpy.toLocaleString()}
                                            </div>
                                        </div>
                                        <PlacementPreview
                                            placement={pkg.placement}
                                            label="Placement preview"
                                            className="self-start"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="px-1 text-lg font-bold text-[#0b1b32]">Your ad requests</h2>
                            {(advertiserProfile.campaigns ?? []).length === 0 ? (
                                <div className="rounded border border-[#dce5ef] bg-white px-4 py-10 text-center text-sm text-[#667085]">
                                    No ad requests yet.
                                </div>
                            ) : (
                                advertiserProfile.campaigns?.map((campaign) => (
                                    <CampaignRow key={campaign.id} campaign={campaign} packages={packages} />
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
}: {
    campaign: AdCampaign;
    packages: Record<string, { label: string; placement: string }>;
}) {
    const [paymentReference, setPaymentReference] = useState(campaign.order?.payment_reference ?? '');

    const submitPayment = () => {
        router.post(`/advertising/campaigns/${campaign.id}/payment`, {
            payment_reference: paymentReference,
        }, { preserveScroll: true });
    };

    const deleteCampaign = () => {
        if (!confirm(`Delete "${campaign.title}"?`)) {
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
                        <Badge className={statusClass(campaign.status)}>{formatStatus(campaign.status)}</Badge>
                        {campaign.order && <Badge className={statusClass(campaign.order.status)}>{formatStatus(campaign.order.status)}</Badge>}
                    </div>
                    <h3 className="mt-2 truncate text-base font-bold text-[#0b1b32]">{campaign.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#5f6c84]">{campaign.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">
                        <span>{packages[campaign.package_key]?.label ?? campaign.package_key}</span>
                        <span>¥{campaign.price_jpy.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {campaign.starts_at ? formatDate(campaign.starts_at) : 'Admin scheduled'}
                        </span>
                        {campaign.ends_at && (
                            <span>Ends {formatDate(campaign.ends_at)}</span>
                        )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#64748b]">
                        {visibilityMessage(campaign)}
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
                                placeholder="Payment reference"
                            />
                            <Button type="button" size="sm" onClick={submitPayment} className="h-8 rounded-[4px]">
                                <CreditCard size={14} />
                                Submit payment reference
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
                            Delete
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

function formatStatus(status: string) {
    return status.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

function visibilityMessage(campaign: AdCampaign) {
    const now = Date.now();
    const startsAt = campaign.starts_at ? new Date(campaign.starts_at).getTime() : null;
    const endsAt = campaign.ends_at ? new Date(campaign.ends_at).getTime() : null;

    if (campaign.status !== 'active') {
        return `Not live yet: campaign status is ${formatStatus(campaign.status)}.`;
    }

    if (campaign.order?.status !== 'paid') {
        return `Not live yet: payment status is ${formatStatus(campaign.order?.status ?? 'unpaid')}.`;
    }

    if (startsAt && startsAt > now) {
        return `Scheduled: starts ${formatDate(campaign.starts_at as string)}.`;
    }

    if (endsAt && endsAt < now) {
        return `Not live: campaign ended ${formatDate(campaign.ends_at as string)}.`;
    }

    return 'Live now: active, paid, and inside its scheduled dates. It rotates with all ads in the same placement.';
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

const successNotice = 'rounded border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm font-medium text-[#166534]';
const errorNotice = 'rounded border border-[#f1c7c7] bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#b42318]';
