<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supported locales
    |--------------------------------------------------------------------------
    |
    | Add or remove locales here. Each entry is used for the locale switcher
    | and for validating the requested locale. 'code' is the ISO 639-1
    | language code; 'name' and 'native' are display labels in the UI.
    |
    | To add a new language: add an entry below and create lang/{code}.json
    | with the same keys as lang/en.json (fallback). Keys use dot notation
    | e.g. "common.dashboard", "welcome.title".
    |
    */

    'supported' => [
        'en' => ['name' => 'English', 'native' => 'English'],
        'ja' => ['name' => 'Japanese', 'native' => '日本語'],
        'uz' => ['name' => 'Uzbek', 'native' => 'O\'zbekcha'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback locale
    |--------------------------------------------------------------------------
    |
    | Used when a translation key is missing in the current locale.
    |
    */

    'fallback' => 'en',

];
