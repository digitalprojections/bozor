import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import {
    ChevronDown,
    Eye,
    Flag,
    Search,
    ShieldCheck,
    Trash2,
    UserX,
} from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { BreadcrumbItem } from '@/types';

type UserSummary = {
    id: number;
    name: string;
    email: string;
    disabled_at?: string | null;
    is_verified?: boolean;
    email_verified_at?: string | null;
};

type ListingSummary = {
    id: number;
    title: string;
    status: string;
    price: number;
    deleted_at?: string | null;
    created_at?: string | null;
};

type ListingReport = {
    id: number;
    reason: string;
    details: string;
    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
    admin_notes?: string | null;
    created_at: string;
    reviewed_at?: string | null;
    listing: ListingSummary | null;
    reporter: UserSummary;
    reported_user: UserSummary;
    reviewer?: UserSummary | null;
};

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedReports = {
    data: ListingReport[];
    links: PageLink[];
    from: number | null;
    to: number | null;
    total: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin reports', href: '/admin/reports' },
];

const reasonLabels: Record<string, string> = {
    prohibited_item: 'Prohibited item',
    counterfeit: 'Counterfeit or fake',
    fraud_or_scam: 'Fraud or scam',
    misleading_information: 'Misleading information',
    unsafe_or_illegal: 'Unsafe or illegal',
    wrong_category: 'Wrong category',
    other: 'Other',
};

export default function AdminReportsIndex({
    reports,
    filters,
    counts,
}: {
    reports: PaginatedReports;
    filters: { status?: string; search?: string };
    counts: Record<string, number>;
}) {
    const { errors, flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'open');
    const [openReport, setOpenReport] = useState<number | null>(
        reports.data[0]?.id ?? null,
    );

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/reports',
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <BazaarLayout title="Reports" breadcrumbs={breadcrumbs} showTitle>
            <Head title="Reports" />

            <div className="space-y-4">
                {(flash?.success || errors?.account) && (
                    <div
                        className={
                            errors?.account
                                ? 'rounded border border-[#f1c7c7] bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#b42318]'
                                : 'rounded border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm font-medium text-[#166534]'
                        }
                    >
                        {errors?.account ?? flash?.success}
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-4">
                    <Stat label="Pending" value={counts.pending ?? 0} />
                    <Stat label="Reviewing" value={counts.reviewing ?? 0} />
                    <Stat label="Resolved" value={counts.resolved ?? 0} />
                    <Stat label="Dismissed" value={counts.dismissed ?? 0} />
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-col gap-2 rounded border border-[#dce5ef] bg-white p-3 shadow-sm md:flex-row"
                >
                    <div className="relative flex-1">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#718096]"
                            size={16}
                        />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-9"
                            placeholder="Search reports, listings, or accounts"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm"
                    >
                        <option value="open">Open reports</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                        <option value="all">All reports</option>
                    </select>
                    <Button type="submit" className="rounded-[4px]">
                        Search
                    </Button>
                </form>

                <div className="space-y-3">
                    {reports.data.map((report) => (
                        <ReportRow
                            key={report.id}
                            report={report}
                            open={openReport === report.id}
                            onOpenChange={(open) =>
                                setOpenReport(open ? report.id : null)
                            }
                        />
                    ))}
                </div>

                {reports.data.length === 0 && (
                    <div className="rounded border border-[#dce5ef] bg-white px-4 py-10 text-center text-sm text-[#667085]">
                        No reports found.
                    </div>
                )}

                <div className="flex flex-wrap gap-2 rounded border border-[#dce5ef] bg-white px-3 py-2">
                    {reports.links.map((link, index) => (
                        <Button
                            key={`${link.label}-${index}`}
                            asChild={!!link.url}
                            disabled={!link.url}
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                            className="h-8 rounded-[4px]"
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </BazaarLayout>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded border border-[#dce5ef] bg-white p-3 shadow-sm">
            <div className="text-xs font-semibold tracking-wide text-[#667085] uppercase">
                {label}
            </div>
            <div className="mt-1 text-2xl font-bold text-[#0b1b32]">
                {value}
            </div>
        </div>
    );
}

function ReportRow({
    report,
    open,
    onOpenChange,
}: {
    report: ListingReport;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [reviewStatus, setReviewStatus] = useState(report.status);
    const [adminNotes, setAdminNotes] = useState(report.admin_notes ?? '');

    const updateReport = () => {
        router.patch(
            `/admin/reports/${report.id}`,
            {
                status: reviewStatus,
                admin_notes: adminNotes,
            },
            { preserveScroll: true },
        );
    };

    const listingAction = (action: string) => {
        if (
            action === 'delete' &&
            !confirm('Delete this listing? This soft-deletes the listing.')
        ) {
            return;
        }

        router.post(
            `/admin/reports/${report.id}/listing-action`,
            { action },
            { preserveScroll: true },
        );
    };

    return (
        <Collapsible
            open={open}
            onOpenChange={onOpenChange}
            className="rounded border border-[#dce5ef] bg-white shadow-sm"
        >
            <CollapsibleTrigger asChild>
                <button className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left hover:bg-[#fbfdff]">
                    <div className="flex min-w-0 gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-red-50 text-red-600">
                            <Flag size={17} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className={statusClass(report.status)}>
                                    {report.status}
                                </Badge>
                                <span className="text-xs font-semibold text-[#667085]">
                                    {reasonLabels[report.reason] ??
                                        report.reason}
                                </span>
                            </div>
                            <h2 className="mt-1 truncate text-sm font-bold text-[#0b1b32]">
                                {report.listing?.title ?? 'Deleted listing'}
                            </h2>
                            <p className="mt-0.5 text-xs text-[#667085]">
                                Reporter: {report.reporter.email} | Seller:{' '}
                                {report.reported_user.email}
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        size={18}
                        className={open ? 'mt-2 rotate-180' : 'mt-2'}
                    />
                </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="border-t border-[#edf2f7] p-3">
                <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr]">
                    <section className="space-y-3">
                        <Panel title="Report review">
                            <div className="rounded bg-[#f8fafc] p-3 text-sm leading-relaxed whitespace-pre-wrap text-[#334155]">
                                {report.details}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                                <select
                                    value={reviewStatus}
                                    onChange={(event) =>
                                        setReviewStatus(
                                            event.target
                                                .value as ListingReport['status'],
                                        )
                                    }
                                    className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                                <Textarea
                                    value={adminNotes}
                                    onChange={(event) =>
                                        setAdminNotes(event.target.value)
                                    }
                                    placeholder="Admin notes"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={updateReport}
                                className="h-8 rounded-[4px]"
                            >
                                Save review
                            </Button>
                        </Panel>

                        <Panel title="Listing control">
                            {report.listing ? (
                                <>
                                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                                        <Info label="ID" value={report.listing.id} />
                                        <Info
                                            label="Status"
                                            value={
                                                report.listing.deleted_at
                                                    ? 'deleted'
                                                    : report.listing.status
                                            }
                                        />
                                        <Info
                                            label="Price"
                                            value={`¥${report.listing.price.toLocaleString()}`}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                listingAction('activate')
                                            }
                                            className="h-8 rounded-[4px]"
                                        >
                                            Restore active
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                listingAction('take_down')
                                            }
                                            className="h-8 rounded-[4px]"
                                        >
                                            Temp take down
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                listingAction('disable')
                                            }
                                            className="h-8 rounded-[4px]"
                                        >
                                            Disable
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                listingAction('delete')
                                            }
                                            className="h-8 rounded-[4px] border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="h-8 rounded-[4px]"
                                        >
                                            <Link
                                                href={`/listings/${report.listing.id}`}
                                            >
                                                <Eye size={13} />
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-[#667085]">
                                    Listing no longer exists.
                                </div>
                            )}
                        </Panel>
                    </section>

                    <section className="space-y-3">
                        <AccountPanel
                            title="Reporter account"
                            reportId={report.id}
                            user={report.reporter}
                        />
                        <AccountPanel
                            title="Seller account"
                            reportId={report.id}
                            user={report.reported_user}
                        />
                    </section>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

function AccountPanel({
    title,
    reportId,
    user,
}: {
    title: string;
    reportId: number;
    user: UserSummary;
}) {
    const [disabledReason, setDisabledReason] = useState(
        user.disabled_at ? 'Account disabled from report review.' : '',
    );

    const action = (action: string) => {
        if (
            action === 'delete' &&
            !confirm(`Delete ${user.email}? This cannot be undone.`)
        ) {
            return;
        }

        router.post(
            `/admin/reports/${reportId}/users/${user.id}/action`,
            {
                action,
                disabled_reason: disabledReason,
            },
            { preserveScroll: true },
        );
    };

    return (
        <Panel title={title}>
            <div className="space-y-2">
                <div>
                    <div className="text-sm font-bold text-[#0b1b32]">
                        {user.name}
                    </div>
                    <div className="text-xs text-[#667085]">{user.email}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                    <Badge
                        variant="outline"
                        className={
                            user.disabled_at
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                        }
                    >
                        {user.disabled_at ? 'Disabled' : 'Enabled'}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={
                            user.is_verified
                                ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                                : 'border-[#dbe4f0] bg-[#f8fafc] text-[#475467]'
                        }
                    >
                        {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                </div>
            </div>
            <Textarea
                value={disabledReason}
                onChange={(event) => setDisabledReason(event.target.value)}
                placeholder="Disable reason"
                className="min-h-20"
            />
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => action('enable')}
                    className="h-8 rounded-[4px]"
                >
                    Enable
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => action('disable')}
                    className="h-8 rounded-[4px]"
                >
                    <UserX size={13} />
                    Disable
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => action('verify')}
                    className="h-8 rounded-[4px]"
                >
                    <ShieldCheck size={13} />
                    Verify
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => action('unverify')}
                    className="h-8 rounded-[4px]"
                >
                    Unverify
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => action('delete')}
                    className="h-8 rounded-[4px] border-red-200 text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={13} />
                    Delete
                </Button>
            </div>
        </Panel>
    );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-3 rounded border border-[#edf2f7] bg-white p-3">
            <h3 className="text-xs font-bold tracking-wide text-[#526173] uppercase">
                {title}
            </h3>
            {children}
        </div>
    );
}

function Info({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded bg-[#f8fafc] p-2">
            <div className="text-[10px] font-bold tracking-wide text-[#667085] uppercase">
                {label}
            </div>
            <div className="truncate text-sm font-semibold text-[#0b1b32]">
                {value}
            </div>
        </div>
    );
}

function statusClass(status: string) {
    if (status === 'pending') {
        return 'border-amber-200 bg-amber-50 px-1.5 py-0 text-[11px] text-amber-700';
    }

    if (status === 'reviewing') {
        return 'border-blue-200 bg-blue-50 px-1.5 py-0 text-[11px] text-blue-700';
    }

    if (status === 'resolved') {
        return 'border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0 text-[11px] text-[#166534]';
    }

    return 'border-[#dbe4f0] bg-[#f8fafc] px-1.5 py-0 text-[11px] text-[#475467]';
}
