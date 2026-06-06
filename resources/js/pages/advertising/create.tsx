import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ImagePlus } from 'lucide-react';
import BazaarLayout from '@/layouts/bazaar-layout';
import { PlacementPreview } from '@/components/ads/placement-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Advertising', href: '/advertising' },
    { title: 'New ad request', href: '/advertising/campaigns/create' },
];

export default function AdvertisingCreate({
    packages,
    placements,
}: {
    packages: Record<string, { label: string; price_jpy: number; duration_days: number; placement: string }>;
    placements: Record<string, { label: string; creative: string }>;
}) {
    const { errors } = usePage().props as any;
    const packageKeys = Object.keys(packages);
    const [packageKey, setPackageKey] = useState(packageKeys[0] ?? '');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [startsAt, setStartsAt] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const selectedPackage = packages[packageKey];
    const selectedPlacement = selectedPackage ? placements[selectedPackage.placement] : null;
    const previewUrl = useMemo(() => image ? URL.createObjectURL(image) : null, [image]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.post('/advertising/campaigns', {
            title,
            description,
            target_url: targetUrl,
            package_key: packageKey,
            starts_at: startsAt,
            ...(image ? { image } : {}),
        }, { forceFormData: true });
    };

    return (
        <BazaarLayout title="New ad request" breadcrumbs={breadcrumbs} showTitle>
            <Head title="New ad request" />

            <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <section className="space-y-3 rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                    <Field label="Package" error={errors?.package_key}>
                        <select
                            value={packageKey}
                            onChange={(event) => setPackageKey(event.target.value)}
                            className="h-9 rounded-md border border-[#cbd5e1] bg-white px-3 text-sm"
                            required
                        >
                            {Object.entries(packages).map(([key, pkg]) => (
                                <option key={key} value={key}>
                                    {pkg.label} - ¥{pkg.price_jpy.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Ad title" error={errors?.title}>
                            <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
                        </Field>
                        <Field label="Destination URL" error={errors?.target_url}>
                            <Input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://example.com" required />
                        </Field>
                    </div>

                    <Field label="Ad text shown to users" error={errors?.description}>
                        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} className="min-h-28" required />
                    </Field>

                    <Field label="Preferred start date" error={errors?.starts_at}>
                        <Input type="date" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
                    </Field>

                    <Field label="Creative image" error={errors?.image}>
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-[#b8c6d8] bg-[#f8fafc] px-4 py-8 text-center text-sm text-[#5f6c84] hover:bg-[#f2f6fb]">
                            <ImagePlus size={24} className="text-[#3a5f8b]" />
                            <span>{image ? image.name : 'Upload JPG, PNG, or WebP up to 2MB'}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                            />
                        </label>
                    </Field>

                    <Button type="submit" className="rounded-[4px]">
                        Create ad request
                    </Button>
                </section>

                <aside className="space-y-3">
                    <div className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-[#0b1b32]">Selected package</h2>
                        {selectedPackage && (
                            <div className="mt-3 space-y-2 text-sm text-[#5f6c84]">
                                <div className="font-semibold text-[#0b1b32]">{selectedPackage.label}</div>
                                <div>Placement: {selectedPlacement?.label ?? selectedPackage.placement}</div>
                                <div>Ad format: {selectedPlacement?.creative ?? 'standard'}</div>
                                <div>Duration: {selectedPackage.duration_days} days</div>
                                <div className="text-lg font-bold text-[#0f766e]">
                                    ¥{selectedPackage.price_jpy.toLocaleString()}
                                </div>
                                <PlacementPreview
                                    placement={selectedPackage.placement}
                                    label="Where this ad appears"
                                />
                                <p className="text-xs leading-relaxed text-[#64748b]">
                                    All active paid ads in the same placement rotate every 8 seconds.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded border border-[#dce5ef] bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-[#0b1b32]">Preview image</h2>
                        <div className="mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded border border-[#d8e2ee] bg-[#f0f5fd]">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Ad preview" className="h-full w-full object-cover" />
                            ) : (
                                <ImagePlus className="text-[#a3b6cc]" size={28} />
                            )}
                        </div>
                    </div>
                </aside>
            </form>
        </BazaarLayout>
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
