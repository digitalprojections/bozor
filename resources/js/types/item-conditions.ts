export type ItemCondition = 'new' | 'like_new' | 'used_good' | 'used_fair' | 'for_parts';

export const ITEM_CONDITIONS: { value: ItemCondition; labelKey: string }[] = [
    { value: 'new', labelKey: 'dashboard.condition.new' },
    { value: 'like_new', labelKey: 'dashboard.condition.like_new' },
    { value: 'used_good', labelKey: 'dashboard.condition.used_good' },
    { value: 'used_fair', labelKey: 'dashboard.condition.used_fair' },
    { value: 'for_parts', labelKey: 'dashboard.condition.for_parts' },
];
