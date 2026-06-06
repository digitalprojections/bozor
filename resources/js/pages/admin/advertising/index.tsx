import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, CreditCard, Megaphone, ShieldCheck } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PageLink[];
};

type Profile = {
    id: number;
    business_name: string;
    website_url?: string | null;
    contact_email: string;
    contact_phone?: string | null;
    business_description?: string | null;
    status: string;
    admin_notes?: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        is_verified?: boolean;
        email_verified_at?: string | null;
    };
};

type Campaign = {
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
    priority: number;
    price_jpy: number;
    admin_notes?: string | null;
    advertiser_profile: {
        id: number;
        business_name: string;
        user?: { id: number; name: string; email: string };
    };
    order?: {
        id: number;
        amount_jpy: number;
        status: string;
        payment_reference?: string | null;
        paid_at?: string | null;
    } | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin ads', href: '/admin/advertising' }];

export default function AdminAdvertisingIndex({
    profiles,
    campaigns,
    filters,
    packages,
    placements,
}: {
    profiles: Paginated<Profile>;
    campaigns: Paginated<Campaign>;
    filters: { profile_status: string; campaign_status: string };
    packages: Record<string, { label: string; price_jpy: number; duration_days: number; placement: string }>;
    placements: Record<string, { label: string; creative: string }>;
}) {
    const { flash } = usePage().props as any;
    const [profileStatus, setProfileStatus] = useState(filters.profile_status ?? 'pending');
    const [campaignStatus, setCampaignStatus] = useState(filters.campaign_status ?? 'open');

    const applyFilters = () => {
        router.get('/admin/advertising', {
            profile_status: profileStatus,
            campaign_status: campaignStatus,
        }, { preserveState: true, replace: true });
    };

    return (
        <BazaarLayout title="Admin Ads" breadcrumbs={breadcrumbs} showTitle>
            <Head title="Admin Ads" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm font-medium text-[#166534]">
                        {flash.success}
                    </div>
                )}

                <section className="rounded border border-[#dce5ef] bg-white p-3 shadow-sm">
                    <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                        <TinyField label="Advertiser applications">
                            <select value={profileStatus} onChange={(event) => setProfileStatus(event.target.value)} className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm">
                                <option value="pending">Pending profiles</option>
                                <option value="approved">Approved profiles</option>
                                <option value="rejected">Rejected profiles</option>
                                <option value="suspended">Suspended profiles</option>
                                <option value="all">All profiles</option>
                            </select>
                        </TinyField>
                        <TinyField label="Ad campaigns">
                            <select value={campaignStatus} onChange={(event) => setCampaignStatus(event.target.value)} className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm">
                                <option value="open">Open campaigns</option>
                                <option value="pending_payment">Pending payment</option>
                                <option value="pending_review">Pending review</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                                <option value="all">All campaigns</option>
                            </select>
                        </TinyField>
                        <Button type="button" onClick={applyFilters} className="self-end rounded-[4px]">Filter</Button>
                    </div>
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldCheck size={18} className="text-[#0d9488]" />
                        <h2 className="text-lg font-bold text-[#0b1b32]">Advertiser applications</h2>
                    </div>
                    {profiles.data.length === 0 ? (
                        <Empty text="No advertiser applications found." />
                    ) : (
                        profiles.data.map((profile) => <ProfileRow key={profile.id} profile={profile} />)
                    )}
                    <Pagination links={profiles.links} />
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Megaphone size={18} className="text-[#0d9488]" />
                        <h2 className="text-lg font-bold text-[#0b1b32]">Ad campaigns</h2>
                    </div>
                    {campaigns.data.length === 0 ? (
                        <Empty text="No ad campaigns found." />
                    ) : (
                        campaigns.data.map((campaign) => (
                            <CampaignRow
                                key={campaign.id}
                                campaign={campaign}
                                packages={packages}
                                placements={placements}
                            />
                        ))
                    )}
                    <Pagination links={campaigns.links} />
                </section>
            </div>
        </BazaarLayout>
    );
}

function ProfileRow({ profile }: { profile: Profile }) {
    const [status, setStatus] = useState(profile.status);
    const [adminNotes, setAdminNotes] = useState(profile.admin_notes ?? '');

    const save = () => {
        router.patch(`/admin/advertising/profiles/${profile.id}`, {
            status,
            admin_notes: adminNotes,
        }, { preserveScroll: true });
    };

    return (
        <div className="rounded border border-[#dce5ef] bg-white p-3 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={statusClass(profile.status)}>{formatStatus(profile.status)}</Badge>
                        {profile.user.is_verified && <Badge className={statusClass('approved')}>Marketplace verified</Badge>}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-[#0b1b32]">{profile.business_name}</h3>
                    <p className="text-sm text-[#667085]">{profile.user.email} | {profile.contact_email}</p>
                    {profile.website_url && (
                        <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm font-medium text-[#2b4b8f] hover:underline">
                            {profile.website_url}
                        </a>
                    )}
                    {profile.business_description && (
                        <p className="mt-2 line-clamp-3 text-sm text-[#5f6c84]">{profile.business_description}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <TinyField label="Application status">
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm">
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </TinyField>
                    <TinyField label="Admin notes">
                        <Textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} className="min-h-20" />
                    </TinyField>
                    <Button type="button" size="sm" onClick={save} className="h-8 rounded-[4px]">Save profile</Button>
                </div>
            </div>
        </div>
    );
}

function CampaignRow({
    campaign,
    packages,
    placements,
}: {
    campaign: Campaign;
    packages: Record<string, { label: string; placement: string }>;
    placements: Record<string, { label: string; creative: string }>;
}) {
    const [status, setStatus] = useState(campaign.status);
    const [orderStatus, setOrderStatus] = useState(campaign.order?.status ?? 'unpaid');
    const [startsAt, setStartsAt] = useState(toInputDateTime(campaign.starts_at));
    const [endsAt, setEndsAt] = useState(toInputDateTime(campaign.ends_at));
    const [priority, setPriority] = useState(String(campaign.priority ?? 0));
    const [adminNotes, setAdminNotes] = useState(campaign.admin_notes ?? '');
    const pkg = packages[campaign.package_key];
    const placement = placements[campaign.placement] ?? placements[pkg?.placement ?? ''];

    const save = () => {
        router.patch(`/admin/advertising/campaigns/${campaign.id}`, {
            status,
            order_status: orderStatus,
            starts_at: startsAt,
            ends_at: endsAt,
            priority,
            admin_notes: adminNotes,
        }, { preserveScroll: true });
    };

    return (
        <div className="rounded border border-[#dce5ef] bg-white p-3 shadow-sm">
            <div className="grid gap-3 xl:grid-cols-[1fr_340px]">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded border border-[#d8e2ee] bg-[#f0f5fd] md:w-40">
                        {campaign.image_url ? (
                            <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                        ) : (
                            <Megaphone className="text-[#a3b6cc]" size={28} />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={statusClass(campaign.status)}>{formatStatus(campaign.status)}</Badge>
                            <Badge className={statusClass(campaign.order?.status ?? 'unpaid')}>{formatStatus(campaign.order?.status ?? 'unpaid')}</Badge>
                        </div>
                        <h3 className="mt-2 truncate text-base font-bold text-[#0b1b32]">{campaign.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-[#5f6c84]">{campaign.description}</p>
                        <a href={campaign.target_url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm font-medium text-[#2b4b8f] hover:underline">
                            {campaign.target_url}
                        </a>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">
                            <span>{campaign.advertiser_profile.business_name}</span>
                            <span>{pkg?.label ?? campaign.package_key}</span>
                            <span>{placement?.label ?? campaign.placement} | {placement?.creative ?? 'standard'} ad format</span>
                            <span>¥{campaign.price_jpy.toLocaleString()}</span>
                            {campaign.order?.payment_reference && (
                                <span className="flex items-center gap-1">
                                    <CreditCard size={12} />
                                    {campaign.order.payment_reference}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <CalendarDays size={12} />
                                {campaign.starts_at ? formatDate(campaign.starts_at) : 'No start date'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <TinyField label="Campaign status">
                            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm">
                                <option value="pending_payment">Pending payment</option>
                                <option value="pending_review">Pending review</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                            </select>
                        </TinyField>
                        <TinyField label="Payment status">
                            <select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)} className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm">
                                <option value="unpaid">Unpaid</option>
                                <option value="pending_confirmation">Pending confirmation</option>
                                <option value="paid">Paid</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </TinyField>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <TinyField label="Starts at">
                            <Input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
                        </TinyField>
                        <TinyField label="Ends at">
                            <Input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
                        </TinyField>
                    </div>
                    <TinyField label="Display priority">
                        <Input type="number" min="0" max="1000" value={priority} onChange={(event) => setPriority(event.target.value)} />
                    </TinyField>
                    <TinyField label="Admin notes">
                        <Textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} className="min-h-20" />
                    </TinyField>
                    <Button type="button" size="sm" onClick={save} className="h-8 rounded-[4px]">Save campaign</Button>
                </div>
            </div>
        </div>
    );
}

function Pagination({ links }: { links: PageLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 rounded border border-[#dce5ef] bg-white px-3 py-2">
            {links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    asChild={!!link.url}
                    disabled={!link.url}
                    size="sm"
                    variant={link.active ? 'default' : 'outline'}
                    className="h-8 rounded-[4px]"
                >
                    {link.url ? (
                        <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                </Button>
            ))}
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <div className="rounded border border-[#dce5ef] bg-white px-4 py-10 text-center text-sm text-[#667085]">
            {text}
        </div>
    );
}

function TinyField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="grid gap-1 text-[11px] font-semibold text-[#64748b]">
            <span>{label}</span>
            {children}
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

function toInputDateTime(date?: string | null) {
    if (!date) {
        return '';
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }
    return parsed.toISOString().slice(0, 16);
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
