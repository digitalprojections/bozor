import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { listingEntryHref } from '../../resources/js/lib/listing-entry.ts';

test('members start a listing even when registration is closed', () => {
    assert.equal(
        listingEntryHref({ is_guest: false }, false),
        '/listings/create',
    );
});
test('visitors and guest accounts can join before posting', () => {
    assert.equal(listingEntryHref(null, true), '/register');
    assert.equal(listingEntryHref({ is_guest: true }, true), '/register');
});
test('closed registration directs existing members to sign in', () => {
    assert.equal(listingEntryHref(null, false), '/login');
    assert.equal(listingEntryHref({ is_guest: true }, false), '/login');
});
test('every locale explains free business listings and labels examples', () => {
    for (const locale of ['en', 'uz', 'ja', 'ru']) {
        const strings = JSON.parse(
            readFileSync(
                new URL(`../../lang/${locale}.json`, import.meta.url),
                'utf8',
            ),
        );
        for (const key of [
            'welcome.free_note',
            'welcome.examples_label',
            'welcome.examples_note',
            'welcome.example_service_title',
            'welcome.example_announcement_title',
            'welcome.meta_description',
        ]) {
            assert.ok(strings[key]?.trim(), `${locale}: ${key}`);
        }
    }
});
