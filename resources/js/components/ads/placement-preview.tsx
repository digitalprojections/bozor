import { cn } from '@/lib/utils';

type PlacementPreviewProps = {
    placement: string;
    label?: string;
    className?: string;
};

const placementCopy: Record<string, string> = {
    top_banner: 'Top of marketplace pages',
    right_rail: 'Right column on wide screens',
    sidebar: 'Left navigation column',
    footer: 'Near the page footer',
};

export function PlacementPreview({
    placement,
    label,
    className,
}: PlacementPreviewProps) {
    return (
        <div
            className={cn(
                'rounded border border-[#d8e2ee] bg-white p-2',
                className,
            )}
        >
            <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-semibold text-[#64748b]">
                <span className="truncate">{label ?? placementCopy[placement] ?? 'Ad placement'}</span>
                <span className="shrink-0 rounded-sm bg-[#e6f5f3] px-1.5 py-0.5 text-[#0f766e]">
                    Ad
                </span>
            </div>
            <div className="grid h-24 grid-cols-[0.7fr_1.45fr_0.85fr] grid-rows-[0.45fr_1fr_0.38fr] gap-1 rounded bg-[#edf3f8] p-1">
                <PreviewBlock className="col-span-3" active={placement === 'top_banner'} />
                <PreviewBlock active={placement === 'sidebar'} />
                <div className="grid gap-1">
                    <PreviewBlock />
                    <PreviewBlock />
                    <PreviewBlock />
                </div>
                <PreviewBlock active={placement === 'right_rail'} />
                <PreviewBlock className="col-span-3" active={placement === 'footer'} />
            </div>
        </div>
    );
}

function PreviewBlock({
    active = false,
    className,
}: {
    active?: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'rounded-sm bg-white',
                active && 'border border-[#0d9488] bg-[#ccfbf1] shadow-sm',
                className,
            )}
        />
    );
}
