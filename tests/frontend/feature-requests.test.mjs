import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const translations = Object.fromEntries(['en', 'ja', 'uz', 'ru'].map(locale => [
    locale, JSON.parse(readFileSync(new URL(`../../lang/${locale}.json`, import.meta.url), 'utf8')),
]));

test('all feature request copy is translated in every supported language', () => {
    const sources = ['resources/js/pages/feature-requests/create.tsx', 'resources/js/pages/feature-requests/index.tsx', 'app/Http/Requests/StoreFeatureRequest.php', 'app/Http/Controllers/FeatureRequestController.php', 'resources/js/layouts/bazaar-layout.tsx'];
    const keys = new Set(sources.flatMap(path => [...readFileSync(new URL('../../' + path, import.meta.url), 'utf8').matchAll(/'(feature_requests\.[a-z_]+)'/g)].map(match => match[1])));
    assert.ok(keys.size >= 19);
    for (const [locale, strings] of Object.entries(translations)) {
        for (const key of keys) {
            assert.ok(typeof strings[key] === 'string' && strings[key].trim(), `${locale}: missing ${key}`);
            if (locale !== 'en') assert.notEqual(strings[key], translations.en[key], `${locale}: untranslated ${key}`);
        }
    }
});
