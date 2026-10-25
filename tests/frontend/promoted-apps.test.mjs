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
            ...promotedApps.flatMap((app) => [app.id, `${app.id}_cta`]),
        ]) {
            assert.ok(
                strings[`promoted_apps.${key}`]?.trim(),
                `${locale}: ${key}`,
            );
        }
    }
});
