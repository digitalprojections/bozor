export const promotedApps = [
    {
        id: 'genstudio',
        name: 'GenStudio',
        image: '/images/ads/genstudio.webp',
        href: 'https://genstudio.web.app/',
    },
    {
        id: 'localscribe',
        name: 'LocalScribe',
        image: '/images/ads/localscribe.webp',
        href: 'https://apps.microsoft.com/detail/9MXR5VG0WV5W',
    },
    {
        id: 'checkers',
        name: 'Created Checkers',
        image: '/images/ads/checkers.webp',
        href: 'https://created.link/checkers/',
    },
    {
        id: 'asset-master',
        name: 'Asset Master',
        image: '/images/ads/asset-master.webp',
        href: 'https://created.link/assetmaster',
    },
    {
        id: 'jawahir',
        name: 'Jawahir Halaal Store',
        image: '/images/ads/jawahir.webp',
        href: 'https://halaal-store.web.app/',
    },
    {
        id: 'reserve-flow',
        name: 'Reserve Flow',
        image: '/images/ads/reserve-flow.webp',
        href: 'https://online-yakusoku.web.app/',
    },
    {
        id: 'treasure',
        name: 'Treasure Cartographer',
        image: '/images/ads/treasure.webp',
        href: 'https://created.link/treasuremaps/',
    },
    {
        id: 'video-chat',
        name: 'Aloqa Video Chat',
        image: '/images/ads/video-chat.webp',
        href: 'https://created.link/videochat/',
    },
    {
        id: 'mahjong',
        name: 'Mahjong Zen',
        image: '/images/ads/mahjong.webp',
        href: 'https://created.link/mahjongzen/',
    },
    {
        id: 'note-sense',
        name: 'Note Sense',
        image: '/images/ads/note-sense.webp',
        href: 'https://created.link/notesense/',
    },
    {
        id: 'animate-frames',
        name: 'Animate Frames',
        image: '/images/ads/animate-frames.webp',
        href: 'https://created.link/animateframes/',
    },
    {
        id: 'jlpt',
        name: 'JLPT N2–N1',
        image: '/images/ads/jlpt.webp',
        href: 'https://jlptmastery.web.app/',
    },
    {
        id: 'tile-puzzle',
        name: '15 Tile Puzzle',
        image: '/images/ads/tile-puzzle.webp',
        href: 'https://created.link/15tilepuzzle',
    },
    {
        id: 'posbon',
        name: 'Posbon',
        image: '/images/ads/posbon.webp',
        href: 'https://created.link/guardia/',
    },
    {
        id: 'nurul-quran',
        name: 'Nurul Quran',
        image: '/images/ads/nurul-quran.webp',
        href: 'https://created.link/quran_editor/',
    },
    {
        id: 'battleship',
        name: 'Neon Battleship',
        image: '/images/ads/battleship.webp',
        href: 'https://battleship.created.link/',
    },
    {
        id: 'audio-slice',
        name: 'AudioSlice',
        image: '/images/ads/audio-slice.webp',
        href: 'https://created.link/audioslicer/',
    },
    {
        id: 'quantum',
        name: '1024 Quantum Flux',
        image: '/images/ads/quantum.webp',
        href: 'https://created.link/2048/',
    },
    {
        id: 'audio-visualizer',
        name: 'Audio Visualizer',
        image: '/images/ads/audio-visualizer.webp',
        href: 'https://created.link/audio-visualizer/',
    },
    {
        id: 'firebase-pulse',
        name: 'Firebase Pulse',
        image: '/images/ads/firebase-pulse.webp',
        href: 'https://play.google.com/store/apps/details?id=link.created.firebasepulse',
    },
    {
        id: 'list-share',
        name: 'List Share',
        image: '/images/ads/list-share.webp',
        href: 'https://play.google.com/store/apps/details?id=link.created.sharedlist',
    },
    {
        id: 'tadabbur',
        name: 'Tadabbur',
        image: '/images/ads/tadabbur.webp',
        href: 'https://play.google.com/store/apps/details?id=link.created.tadabbur',
    },
    {
        id: 'audio-quran',
        name: 'Audio Quran',
        image: '/images/ads/audio-quran.webp',
        href: 'https://play.google.com/store/apps/details?id=furqon.io.github.mobilproject',
    },
] as const;

export function nextPromotionIndex(
    current: number,
    direction: number,
    count: number,
): number {
    return count > 0 ? (((current + direction) % count) + count) % count : 0;
}
export function promotionIndicators(current: number, count: number): number[] {
    const length = Math.min(5, count);
    const start = Math.max(0, Math.min(current - 2, count - length));
    return Array.from({ length }, (_, index) => start + index);
}
export function shouldLoadPromotion(
    slideIndex: number,
    current: number,
): boolean {
    return slideIndex >= current - 1 && slideIndex < current + 5;
}
