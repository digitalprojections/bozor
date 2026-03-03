export type AvatarConfig = {
    characterType: 'blob' | 'vehicle' | 'alien' | 'salesman';
    bodyColor: string;
    eyeType: 'round' | 'oval' | 'happy' | 'squint';
    mouthType: 'smile' | 'laugh' | 'neutral' | 'surprised';
    accessoryType: 'none' | 'hat' | 'glasses' | 'bowtie';
    accessoryColor: string;
    skinTone: string;
    size: number;
};

export const CHARACTER_TYPES = ['blob', 'vehicle', 'alien', 'salesman'] as const;
export const EYE_TYPES = ['round', 'oval', 'happy', 'squint'] as const;
export const MOUTH_TYPES = ['smile', 'laugh', 'neutral', 'surprised'] as const;
export const ACCESSORY_TYPES = ['none', 'hat', 'glasses', 'bowtie'] as const;

export const DEFAULT_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A', '#85C1E9'
];

export const SKIN_TONES = [
    '#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'
];
