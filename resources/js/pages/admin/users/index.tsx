import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Edit3, Search, ShieldCheck, Store, Trash2, UserRound } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    store_name?: string | null;
    is_guest?: boolean;
    is_verified?: boolean;
    email_verified_at?: string | null;
    created_at?: string;
    listings_count?: number;
    sold_listings_count?: number;
    purchases_count?: number;
    sales_count?: number;
    verification_requests_count?: number;
};

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedUsers = {
    data: AdminUser[];
    links: PageLink[];
    from: number | null;
    to: number | null;
    total: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin users',
        href: '/admin/users',
    },
];

export default function AdminUsersIndex({
    users,
    filters,
}: {
    users: PaginatedUsers;
    filters: { search?: string };
}) {
    const { errors, flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search ?? '');

    const submit = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            '/admin/users',
            { search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const formatDate = (value?: string) =>
        value
            ? new Intl.DateTimeFormat(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              }).format(new Date(value))
            : 'Unknown';

    const deleteUser = (user: AdminUser) => {
        if (
            !confirm(
                `Delete ${user.name} (${user.email})? This cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(`/admin/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <BazaarLayout title="Admin Users" breadcrumbs={breadcrumbs}>
            <Head title="Admin Users" />

            <div className="space-y-4">
                {(flash?.success || errors?.delete) && (
                    <div
                        className={
                            errors?.delete
                                ? 'rounded border border-[#f1c7c7] bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#b42318]'
                                : 'rounded border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm font-medium text-[#166534]'
                        }
                    >
                        {errors?.delete ?? flash?.success}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="flex flex-col gap-2 rounded border border-[#dce5ef] bg-white p-3 shadow-sm sm:flex-row"
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
                            placeholder="Search by name, email, store, or phone"
                        />
                    </div>
                    <Button type="submit" className="rounded-[4px]">
                        Search
                    </Button>
                </form>

                <div className="overflow-hidden rounded border border-[#dce5ef] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#edf2f7] px-3 py-2">
                        <div>
                            <h2 className="text-sm font-semibold text-[#0b1b32]">
                                Accounts
                            </h2>
                            <p className="text-xs text-[#667085]">
                                Showing {users.from ?? 0}-{users.to ?? 0} of{' '}
                                {users.total}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-xs">
                            <thead className="bg-[#f8fafc] text-xs font-semibold tracking-wide text-[#526173] uppercase">
                                <tr>
                                    <th className="px-3 py-2">User</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Activity</th>
                                    <th className="px-3 py-2">Joined</th>
                                    <th className="px-3 py-2 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf2f7]">
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="align-top hover:bg-[#fbfdff]"
                                    >
                                        <td className="px-3 py-2">
                                            <div className="flex min-w-0 gap-2">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#e7f2f1] text-[#0f766e]">
                                                    <UserRound size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate font-semibold leading-4 text-[#16233a]">
                                                        {user.name}
                                                    </div>
                                                    <div className="truncate leading-4 text-[#667085]">
                                                        {user.email}
                                                    </div>
                                                    {user.store_name && (
                                                        <div className="flex items-center gap-1 text-[11px] leading-4 text-[#667085]">
                                                            <Store size={11} />
                                                            <span className="truncate">
                                                                {
                                                                    user.store_name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex flex-wrap gap-1">
                                                <Badge
                                                    className={
                                                        user.email_verified_at
                                                            ? 'border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0 text-[11px] text-[#166534]'
                                                            : 'border-[#fed7aa] bg-[#fff7ed] px-1.5 py-0 text-[11px] text-[#9a3412]'
                                                    }
                                                    variant="outline"
                                                >
                                                    {user.email_verified_at
                                                        ? 'Email ok'
                                                        : 'Email no'}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        user.is_verified
                                                            ? 'border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0 text-[11px] text-[#166534]'
                                                            : 'border-[#dbe4f0] bg-[#f8fafc] px-1.5 py-0 text-[11px] text-[#475467]'
                                                    }
                                                    variant="outline"
                                                >
                                                    <ShieldCheck size={11} />
                                                    {user.is_verified
                                                        ? 'Verified'
                                                        : 'Unverified'}
                                                </Badge>
                                                {user.is_guest && (
                                                    <Badge variant="secondary" className="px-1.5 py-0 text-[11px]">
                                                        Guest
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-[#526173]">
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                                                <span>
                                                    Listings:{' '}
                                                    {user.listings_count ?? 0}
                                                </span>
                                                <span>
                                                    Sold:{' '}
                                                    {user.sold_listings_count ??
                                                        0}
                                                </span>
                                                <span>
                                                    Buys:{' '}
                                                    {user.purchases_count ?? 0}
                                                </span>
                                                <span>
                                                    Sales:{' '}
                                                    {user.sales_count ?? 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-[#526173]">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 rounded-[4px] px-2 text-xs"
                                                >
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                    >
                                                        <Edit3 size={13} />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        deleteUser(user)
                                                    }
                                                    className="h-7 rounded-[4px] border-[#f1c7c7] px-2 text-xs text-[#b42318] hover:bg-[#fff1f1] hover:text-[#8a1f15]"
                                                >
                                                    <Trash2 size={13} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.data.length === 0 && (
                        <div className="px-4 py-10 text-center text-sm text-[#667085]">
                            No accounts found.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-[#edf2f7] px-3 py-2">
                        {users.links.map((link, index) => (
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
            </div>
        </BazaarLayout>
    );
}
