export type User = {
    id: number;
    name: string;
    masked_name: string;
    email: string;
    avatar?: string;
    avatar_url?: string;
    avatar_style?: string;
    avatar_seed?: string;
    gender?: 'male' | 'female' | 'other' | 'unspecified';
    email_verified_at: string | null;
    average_rating?: number;
    ratings_count?: number;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
