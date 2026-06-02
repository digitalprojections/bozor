export interface LayoutAd {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    target_url: string;
    placement: string;
    advertiser?: string | null;
    ends_at?: string | null;
}

export type LayoutAds = Record<string, LayoutAd[] | undefined>;
