import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { ComponentType, FormEvent, ReactNode } from 'react';
import {
    ArrowLeft,
    MailCheck,
    Package,
    ReceiptText,
    Save,
    ShieldCheck,
    Star,
} from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type Account = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    is_verified?: boolean;
    verified_at?: string | null;
    is_guest?: boolean;
    store_name?: string | null;
    store_description?: string | null;
    postal_code?: string | null;
    prefecture?: string | null;
    city?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    phone?: string | null;
    gender?: string | null;
    avatar_source?: string | null;
    avatar_style?: string | null;
    avatar_seed?: string | null;
    average_rating?: number;
    ratings_count?: number;
    listings_count?: number;
    sold_listings_count?: number;
    purchases_count?: number;
    sales_count?: number;
    verification_requests_count?: number;
    latest_verification_request?: {
        status: string;
        created_at: string;
        admin_notes?: string | null;
    } | null;
};

type FormData = {
    name: string;
    email: string;
    email_verified: boolean;
    is_verified: boolean;
    is_guest: boolean;
    store_name: string;
    store_description: string;
    postal_code: string;
    prefecture: string;
    city: string;
    address_line1: string;
    address_line2: string;
    phone: string;
    gender: string;
    avatar_source: string;
    avatar_style: string;
    avatar_seed: string;
};

export default function AdminUsersEdit({ account }: { account: Account }) {
    const { flash } = usePage().props as any;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin users',
            href: '/admin/users',
        },
        {
            title: account.name,
            href: `/admin/users/${account.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm<FormData>({
            name: account.name ?? '',
            email: account.email ?? '',
            email_verified: !!account.email_verified_at,
            is_verified: !!account.is_verified,
            is_guest: !!account.is_guest,
            store_name: account.store_name ?? '',
            store_description: account.store_description ?? '',
            postal_code: account.postal_code ?? '',
            prefecture: account.prefecture ?? '',
            city: account.city ?? '',
            address_line1: account.address_line1 ?? '',
            address_line2: account.address_line2 ?? '',
            phone: account.phone ?? '',
            gender: account.gender ?? 'unspecified',
            avatar_source: account.avatar_source ?? 'generated',
            avatar_style: account.avatar_style ?? 'initials',
            avatar_seed: account.avatar_seed ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(`/admin/users/${account.id}`, {
            preserveScroll: true,
        });
    };

    const formatDate = (value?: string | null) =>
        value
            ? new Intl.DateTimeFormat(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              }).format(new Date(value))
            : 'Not set';

    return (
        <BazaarLayout
            title={`Edit ${account.name}`}
            breadcrumbs={breadcrumbs}
            showTitle
        >
            <Head title={`Edit ${account.name}`} />

            <div className="mb-1">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-[4px] text-[#526173]"
                >
                    <Link href="/admin/users">
                        <ArrowLeft size={14} />
                        Back to users
                    </Link>
                </Button>
            </div>

            {(flash?.success || recentlySuccessful) && (
                <div className="rounded border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm font-medium text-[#166534]">
                    {flash?.success ?? 'Saved'}
                </div>
            )}

            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded border border-[#dce5ef] bg-white p-4 shadow-sm"
                >
                    <section className="space-y-4">
                        <div>
                            <h2 className="font-semibold text-[#0b1b32]">
                                Account
                            </h2>
                            <p className="text-sm text-[#667085]">
                                Identity and verification state.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Name" error={errors.name}>
                                <Input
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                />
                            </Field>

                            <Field label="Email" error={errors.email}>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <ToggleField
                                label="Email verified"
                                checked={data.email_verified}
                                onCheckedChange={(checked) =>
                                    setData('email_verified', checked)
                                }
                                icon={MailCheck}
                            />
                            <ToggleField
                                label="Marketplace verified"
                                checked={data.is_verified}
                                onCheckedChange={(checked) =>
                                    setData('is_verified', checked)
                                }
                                icon={ShieldCheck}
                            />
                            <ToggleField
                                label="Guest account"
                                checked={data.is_guest}
                                onCheckedChange={(checked) =>
                                    setData('is_guest', checked)
                                }
                            />
                        </div>
                    </section>

                    <SectionDivider />

                    <section className="space-y-4">
                        <div>
                            <h2 className="font-semibold text-[#0b1b32]">
                                Store
                            </h2>
                            <p className="text-sm text-[#667085]">
                                Public seller profile details.
                            </p>
                        </div>

                        <Field label="Store name" error={errors.store_name}>
                            <Input
                                value={data.store_name}
                                onChange={(event) =>
                                    setData('store_name', event.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Store description"
                            error={errors.store_description}
                        >
                            <Textarea
                                rows={4}
                                value={data.store_description}
                                onChange={(event) =>
                                    setData(
                                        'store_description',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                    </section>

                    <SectionDivider />

                    <section className="space-y-4">
                        <div>
                            <h2 className="font-semibold text-[#0b1b32]">
                                Contact And Address
                            </h2>
                            <p className="text-sm text-[#667085]">
                                Private fulfillment details.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Postal code" error={errors.postal_code}>
                                <Input
                                    value={data.postal_code}
                                    onChange={(event) =>
                                        setData(
                                            'postal_code',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Prefecture" error={errors.prefecture}>
                                <Input
                                    value={data.prefecture}
                                    onChange={(event) =>
                                        setData('prefecture', event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="City" error={errors.city}>
                                <Input
                                    value={data.city}
                                    onChange={(event) =>
                                        setData('city', event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Phone" error={errors.phone}>
                                <Input
                                    value={data.phone}
                                    onChange={(event) =>
                                        setData('phone', event.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <Field
                            label="Address line 1"
                            error={errors.address_line1}
                        >
                            <Input
                                value={data.address_line1}
                                onChange={(event) =>
                                    setData('address_line1', event.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Address line 2"
                            error={errors.address_line2}
                        >
                            <Input
                                value={data.address_line2}
                                onChange={(event) =>
                                    setData('address_line2', event.target.value)
                                }
                            />
                        </Field>
                    </section>

                    <SectionDivider />

                    <section className="space-y-4">
                        <div>
                            <h2 className="font-semibold text-[#0b1b32]">
                                Avatar Metadata
                            </h2>
                            <p className="text-sm text-[#667085]">
                                Source and generated-avatar settings.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="Gender" error={errors.gender}>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData('gender', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unspecified">
                                            Unspecified
                                        </SelectItem>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Avatar source"
                                error={errors.avatar_source}
                            >
                                <Select
                                    value={data.avatar_source}
                                    onValueChange={(value) =>
                                        setData('avatar_source', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="generated">
                                            Generated
                                        </SelectItem>
                                        <SelectItem value="uploaded">
                                            Uploaded
                                        </SelectItem>
                                        <SelectItem value="mascot">
                                            Mascot
                                        </SelectItem>
                                        <SelectItem value="google">
                                            Google
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Avatar style"
                                error={errors.avatar_style}
                            >
                                <Input
                                    value={data.avatar_style}
                                    onChange={(event) =>
                                        setData(
                                            'avatar_style',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <Field label="Avatar seed" error={errors.avatar_seed}>
                            <Input
                                value={data.avatar_seed}
                                onChange={(event) =>
                                    setData('avatar_seed', event.target.value)
                                }
                            />
                        </Field>
                    </section>

                    <div className="flex items-center gap-3 border-t border-[#edf2f7] pt-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-[4px]"
                        >
                            <Save size={16} />
                            Save account
                        </Button>
                        {recentlySuccessful && (
                            <span className="text-sm text-[#166534]">
                                Saved
                            </span>
                        )}
                    </div>
                </form>

                <aside className="space-y-4">
                    <div className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold text-[#0b1b32]">
                            Account Context
                        </h2>
                        <div className="space-y-3 text-sm text-[#526173]">
                            <Metric
                                icon={Package}
                                label="Listings"
                                value={account.listings_count ?? 0}
                            />
                            <Metric
                                icon={Package}
                                label="Sold listings"
                                value={account.sold_listings_count ?? 0}
                            />
                            <Metric
                                icon={ReceiptText}
                                label="Purchases"
                                value={account.purchases_count ?? 0}
                            />
                            <Metric
                                icon={ReceiptText}
                                label="Sales"
                                value={account.sales_count ?? 0}
                            />
                            <Metric
                                icon={Star}
                                label="Rating"
                                value={`${Number(account.average_rating ?? 0).toFixed(1)} (${account.ratings_count ?? 0})`}
                            />
                        </div>
                    </div>

                    <div className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold text-[#0b1b32]">
                            Verification
                        </h2>
                        <div className="space-y-2 text-sm text-[#526173]">
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    className={
                                        account.email_verified_at
                                            ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                                            : 'border-[#fed7aa] bg-[#fff7ed] text-[#9a3412]'
                                    }
                                    variant="outline"
                                >
                                    Email: {formatDate(account.email_verified_at)}
                                </Badge>
                                <Badge
                                    className={
                                        account.is_verified
                                            ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                                            : 'border-[#dbe4f0] bg-[#f8fafc] text-[#475467]'
                                    }
                                    variant="outline"
                                >
                                    Marketplace:{' '}
                                    {formatDate(account.verified_at)}
                                </Badge>
                            </div>

                            {account.latest_verification_request ? (
                                <div className="rounded bg-[#f8fafc] p-3">
                                    <div className="font-medium text-[#16233a]">
                                        Latest request:{' '}
                                        {
                                            account.latest_verification_request
                                                .status
                                        }
                                    </div>
                                    <div>
                                        {formatDate(
                                            account.latest_verification_request
                                                .created_at,
                                        )}
                                    </div>
                                    {account.latest_verification_request
                                        .admin_notes && (
                                        <p className="mt-2">
                                            {
                                                account
                                                    .latest_verification_request
                                                    .admin_notes
                                            }
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p>No verification request submitted.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </BazaarLayout>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function ToggleField({
    label,
    checked,
    onCheckedChange,
    icon: Icon,
}: {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    icon?: ComponentType<{ size?: number; className?: string }>;
}) {
    return (
        <label className="flex min-h-11 items-center gap-3 rounded border border-[#dce5ef] px-3 py-2 text-sm font-medium text-[#16233a]">
            <Checkbox
                checked={checked}
                onCheckedChange={(value) => onCheckedChange(value === true)}
            />
            {Icon && <Icon size={16} className="text-[#0f766e]" />}
            <span>{label}</span>
        </label>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: number | string;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
                <Icon size={15} className="text-[#0f766e]" />
                {label}
            </span>
            <span className="font-semibold text-[#16233a]">{value}</span>
        </div>
    );
}

function SectionDivider() {
    return <div className="border-t border-[#edf2f7]" />;
}
