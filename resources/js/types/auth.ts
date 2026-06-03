export type User = {
    id: number;
    name: string;
    masked_name: string;
    email: string;
    avatar?: string;
    google_avatar?: string;
    avatar_url?: string;
    avatar_source?: 'uploaded' | 'mascot' | 'generated' | 'google';
    avatar_style?: string;
    avatar_seed?: string;
    gender?: 'male' | 'female' | 'other' | 'unspecified';
    email_verified_at: string | null;
    average_rating?: number | string;
    ratings_count?: number;
    two_factor_enabled?: boolean;
    has_local_password?: boolean;
    is_guest?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    logged_in_with_google?: boolean;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
