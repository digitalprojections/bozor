import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { promotedApps } from '../../resources/js/lib/promoted-apps.ts';

test('promotions have unique identifiers and secure first-party or Store destinations', () => {
    assert.equal(
        new Set(promotedApps.map((app) => app.id)).size,
        promotedApps.length,
    );
    assert.equal(promotedApps.length, 3);
    for (const app of promotedApps) {
        const url = new URL(app.href);
        assert.equal(url.protocol, 'https:');
        assert.ok(
            [
                'genstudio.web.app',
                'apps.microsoft.com',
                'created.link',
            ].includes(url.hostname),
        );
        assert.ok(app.name.trim());
    }
});

test('every supported locale supplies all promotion copy', () => {
    for (const locale of ['en', 'ja', 'uz', 'ru']) {
        const strings = JSON.parse(
            readFileSync(
                new URL(`../../lang/${locale}.json`, import.meta.url),
                'utf8',
            ),
        );
        for (const key of [
            'title',
            'new_tab',
            'carousel',
            'previous',
            'next',
            'pause',
            'play',
            ...promotedApps.flatMap((app) => [app.id, `${app.id}_cta`]),
        ]) {
            assert.ok(
                strings[`promoted_apps.${key}`]?.trim(),
                `${locale}: ${key}`,
            );
        }
    }
});

import { nextPromotionIndex } from '../../resources/js/lib/promoted-apps.ts';
test('carousel advances and wraps in either direction', () => {
    assert.equal(nextPromotionIndex(0, 1, 3), 1);
    assert.equal(nextPromotionIndex(2, 1, 3), 0);
    assert.equal(nextPromotionIndex(0, -1, 3), 2);
    assert.equal(nextPromotionIndex(1, 1, 0), 0);
});
test('every banner has a local optimized image', () => {
    for (const app of promotedApps) {
        assert.match(app.image, /^\/images\/ads\/.+\.webp$/);
        assert.ok(
            readFileSync(new URL(`../../public${app.image}`, import.meta.url))
                .length < 150000,
        );
    }
});
