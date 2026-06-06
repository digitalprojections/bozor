<?php

return [
    'placements' => [
        'top_banner' => [
            'label' => 'Top banner',
            'limit' => 2,
            'creative' => 'horizontal',
        ],
        'right_rail' => [
            'label' => 'Right rail',
            'limit' => 3,
            'creative' => '4:3',
        ],
        'sidebar' => [
            'label' => 'Sidebar',
            'limit' => 3,
            'creative' => '4:3',
        ],
        'footer' => [
            'label' => 'Footer',
            'limit' => 2,
            'creative' => 'horizontal',
        ],
    ],

    'packages' => [
        'top_banner_week' => [
            'placement' => 'top_banner',
            'label' => 'Top banner - 1 week',
            'duration_days' => 7,
            'price_jpy' => 9800,
        ],
        'top_banner_month' => [
            'placement' => 'top_banner',
            'label' => 'Top banner - 1 month',
            'duration_days' => 30,
            'price_jpy' => 29800,
        ],
        'right_rail_week' => [
            'placement' => 'right_rail',
            'label' => 'Right rail - 1 week',
            'duration_days' => 7,
            'price_jpy' => 6800,
        ],
        'right_rail_month' => [
            'placement' => 'right_rail',
            'label' => 'Right rail - 1 month',
            'duration_days' => 30,
            'price_jpy' => 19800,
        ],
        'sidebar_week' => [
            'placement' => 'sidebar',
            'label' => 'Sidebar - 1 week',
            'duration_days' => 7,
            'price_jpy' => 3800,
        ],
        'sidebar_month' => [
            'placement' => 'sidebar',
            'label' => 'Sidebar - 1 month',
            'duration_days' => 30,
            'price_jpy' => 9800,
        ],
        'footer_week' => [
            'placement' => 'footer',
            'label' => 'Footer - 1 week',
            'duration_days' => 7,
            'price_jpy' => 2000,
        ],
        'footer_month' => [
            'placement' => 'footer',
            'label' => 'Footer - 1 month',
            'duration_days' => 30,
            'price_jpy' => 5800,
        ],
    ],
];
