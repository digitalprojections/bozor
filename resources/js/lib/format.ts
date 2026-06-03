export function formatRating(
    rating: number | string | null | undefined,
): string {
    const value = Number(rating ?? 0);

    return Number.isFinite(value) ? value.toFixed(1) : '0.0';
}

export function roundedRating(
    rating: number | string | null | undefined,
): number {
    const value = Number(rating ?? 0);

    return Number.isFinite(value) ? Math.round(value) : 0;
}
