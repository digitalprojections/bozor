export const promotedApps = [
    {
        id: 'genstudio',
        name: 'GenStudio',
        image: '/images/ads/genstudio.webp',
        href: 'https://genstudio.web.app/',
    },
    {
        id: 'localscribe',
        image: '/images/ads/localscribe.webp',
        name: 'LocalScribe',
        href: 'https://apps.microsoft.com/detail/9MXR5VG0WV5W',
    },
    {
        id: 'checkers',
        image: '/images/ads/checkers.webp',
        name: 'Created Checkers',
        href: 'https://created.link/checkers/',
    },
] as const;

export function nextPromotionIndex(
    current: number,
    direction: number,
    count: number,
): number {
    return count > 0 ? (((current + direction) % count) + count) % count : 0;
}
