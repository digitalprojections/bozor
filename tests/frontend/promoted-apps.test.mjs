import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { promotedApps } from '../../resources/js/lib/promoted-apps.ts';

test('promotions have unique identifiers and secure first-party or Store destinations', () => {
    assert.equal(
        new Set(promotedApps.map((app) => app.id)).size,
        promotedApps.length,
    );
    assert.equal(promotedApps.length, 23);
    for (const app of promotedApps) {
        const url = new URL(app.href);
        assert.equal(url.protocol, 'https:');
        assert.ok(
            [
                'genstudio.web.app',
                'apps.microsoft.com',
                'created.link',
                'halaal-store.web.app',
                'online-yakusoku.web.app',
                'jlptmastery.web.app',
                'battleship.created.link',
                'play.google.com',
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
            ...promotedApps.map((app) => app.id),
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

import {
    promotionIndicators,
    shouldLoadPromotion,
} from '../../resources/js/lib/promoted-apps.ts';
test('pagination stays compact and always includes the current ad', () => {
    assert.deepEqual(promotionIndicators(0, 3), [0, 1, 2]);
    assert.deepEqual(promotionIndicators(0, 23), [0, 1, 2, 3, 4]);
    assert.deepEqual(promotionIndicators(22, 23), [18, 19, 20, 21, 22]);
    assert.ok(promotionIndicators(12, 23).includes(12));
    assert.deepEqual(promotionIndicators(0, 0), []);
});
test('only images near the carousel window are requested', () => {
    assert.equal(shouldLoadPromotion(0, 0), true);
    assert.equal(shouldLoadPromotion(4, 0), true);
    assert.equal(shouldLoadPromotion(5, 0), false);
    assert.equal(shouldLoadPromotion(11, 12), true);
    assert.equal(shouldLoadPromotion(4, 12), false);
});
