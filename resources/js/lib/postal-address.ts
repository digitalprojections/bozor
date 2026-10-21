export type PostalAddress = { prefecture: string; city: string; town: string };
export type AddressFields = {
    prefecture: string;
    city: string;
    address_line1: string;
};

export function normalizePostalCode(value: string): string | null {
    const normalized = value.normalize('NFKC').replace(/[〒\s-]/g, '');
    return /^\d{7}$/.test(normalized) ? normalized : null;
}

export async function lookupPostalAddresses(
    value: string,
    signal: AbortSignal,
    fetcher: typeof fetch = fetch,
): Promise<PostalAddress[]> {
    const code = normalizePostalCode(value);
    if (!code) throw new Error('Invalid postal code');
    const response = await fetcher(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}&limit=100`,
        {
            signal,
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
        },
    );
    if (!response.ok) throw new Error('Postal lookup unavailable');
    const body: unknown = await response.json();
    if (
        !body ||
        typeof body !== 'object' ||
        !('status' in body) ||
        body.status !== 200 ||
        !('results' in body)
    ) {
        throw new Error('Invalid postal lookup response');
    }
    if (body.results === null) return [];
    if (!Array.isArray(body.results))
        throw new Error('Invalid postal lookup results');
    const addresses: PostalAddress[] = [];
    for (const row of body.results) {
        if (
            !row ||
            row.zipcode !== code ||
            typeof row.address1 !== 'string' ||
            !row.address1 ||
            typeof row.address2 !== 'string' ||
            !row.address2 ||
            typeof row.address3 !== 'string'
        ) {
            throw new Error('Invalid postal address');
        }
        const address = {
            prefecture: row.address1,
            city: row.address2,
            town: row.address3,
        };
        if (
            !addresses.some(
                (item) =>
                    item.prefecture === address.prefecture &&
                    item.city === address.city &&
                    item.town === address.town,
            )
        )
            addresses.push(address);
    }
    return addresses;
}

export function mergePostalAddress<T extends AddressFields>(
    current: T,
    started: AddressFields,
    address: PostalAddress,
    previousTown: string,
): T {
    return {
        ...current,
        ...(current.prefecture === started.prefecture
            ? { prefecture: address.prefecture }
            : {}),
        ...(current.city === started.city ? { city: address.city } : {}),
        ...(current.address_line1 === started.address_line1 &&
        (!current.address_line1 || current.address_line1 === previousTown)
            ? { address_line1: address.town }
            : {}),
    };
}
