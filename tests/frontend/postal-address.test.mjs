import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    normalizePostalCode,
    lookupPostalAddresses,
    mergePostalAddress,
} from '../../resources/js/lib/postal-address.ts';

const address = { prefecture: '東京都', city: '新宿区', town: '西新宿' };
const response =
    (body, ok = true) =>
    async () => ({ ok, json: async () => body });

test('normalizes Japanese full-width digits and postal punctuation', () => {
    assert.equal(normalizePostalCode('〒１６０－００２３'), '1600023');
    assert.equal(normalizePostalCode('160-0023'), '1600023');
    assert.equal(normalizePostalCode('abc1600023'), null);
    assert.equal(normalizePostalCode('160002'), null);
    assert.equal(normalizePostalCode('16000230'), null);
});

test('does not request incomplete or invalid postal codes', async () => {
    await assert.rejects(
        () =>
            lookupPostalAddresses('123', new AbortController().signal, () => {
                throw new Error('must not fetch');
            }),
        /postal code/,
    );
});

test('maps and deduplicates all matching areas without selecting one', async () => {
    const row = {
        zipcode: '1600023',
        address1: address.prefecture,
        address2: address.city,
        address3: address.town,
    };
    let requested;
    const fetcher = async (url, options) => {
        requested = { url, options };
        return response({
            status: 200,
            results: [row, row, { ...row, address3: '新宿' }],
        })();
    };
    const signal = new AbortController().signal;
    assert.deepEqual(await lookupPostalAddresses('160-0023', signal, fetcher), [
        address,
        { ...address, town: '新宿' },
    ]);
    assert.match(requested.url, /zipcode=1600023/);
    assert.equal(requested.options.signal, signal);
    assert.equal(requested.options.credentials, 'omit');
});

test('distinguishes no match from service, HTTP, and malformed-response errors', async () => {
    const signal = new AbortController().signal;
    assert.deepEqual(
        await lookupPostalAddresses(
            '0000000',
            signal,
            response({ status: 200, results: null }),
        ),
        [],
    );
    for (const body of [
        { status: 500 },
        {},
        { status: 200, results: [{}] },
        {
            status: 200,
            results: [
                {
                    zipcode: '9999999',
                    address1: 'X',
                    address2: 'Y',
                    address3: 'Z',
                },
            ],
        },
    ]) {
        await assert.rejects(() =>
            lookupPostalAddresses('1600023', signal, response(body)),
        );
    }
    await assert.rejects(() =>
        lookupPostalAddresses('1600023', signal, response({}, false)),
    );
});

test('fills area fields and town while leaving building details and phone untouched', () => {
    const current = {
        prefecture: '',
        city: '',
        address_line1: '',
        address_line2: 'Room 201',
        phone: '0300000000',
    };
    assert.deepEqual(mergePostalAddress(current, current, address, ''), {
        ...current,
        prefecture: address.prefecture,
        city: address.city,
        address_line1: address.town,
    });
});

test('preserves manually entered street numbers and edits made during lookup', () => {
    const start = { prefecture: '', city: '', address_line1: '西新宿2-8-1' };
    const current = { ...start, city: 'Manual city' };
    assert.deepEqual(mergePostalAddress(current, start, address, ''), {
        ...current,
        prefecture: address.prefecture,
    });
});

test('replaces the previous autofilled town when the postal code changes', () => {
    const start = {
        prefecture: 'Old prefecture',
        city: 'Old city',
        address_line1: 'Old town',
    };
    assert.deepEqual(mergePostalAddress(start, start, address, 'Old town'), {
        prefecture: address.prefecture,
        city: address.city,
        address_line1: address.town,
    });
});

test('propagates network failures and request cancellation', async () => {
    const controller = new AbortController();
    const networkError = new Error('offline');
    await assert.rejects(
        () =>
            lookupPostalAddresses('1600023', controller.signal, async () => {
                throw networkError;
            }),
        (error) => error === networkError,
    );
    controller.abort();
    await assert.rejects(
        () =>
            lookupPostalAddresses(
                '1600023',
                controller.signal,
                async (_url, { signal }) => {
                    signal.throwIfAborted();
                },
            ),
        { name: 'AbortError' },
    );
});
