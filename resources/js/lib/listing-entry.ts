/** The server retains responsibility for email verification and profile checks. */
export function listingEntryHref(
    user: { is_guest?: boolean } | null | undefined,
    canRegister: boolean,
): string {
    if (user && !user.is_guest) return '/listings/create';
    return canRegister ? '/register' : '/login';
}
