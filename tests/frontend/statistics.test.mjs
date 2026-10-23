import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
const strings = Object.fromEntries(['en','ja','uz','ru'].map(locale => [locale, JSON.parse(readFileSync(new URL('../../lang/'+locale+'.json',import.meta.url),'utf8'))]));
test('every statistics label, metric and status is translated in all supported languages', () => {
    const keys=Object.keys(strings.en).filter(key=>key.startsWith('stats.'));
    assert.ok(keys.length >= 70);
    for(const locale of ['ja','uz','ru']) for(const key of keys) {
        assert.ok(strings[locale][key]?.trim(), locale+': '+key);
        assert.notEqual(strings[locale][key], strings.en[key], locale+': '+key);
    }
});
