export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
}

export interface Listing {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: number;
    status: 'draft' | 'active' | 'sold' | 'archived';
    images: string[];
    location?: string;
    views: number;
    created_at: string;
    main_image_url: string | null;
    categories: Category[];
}

export interface Transaction {
    id: number;
    listing_id: number;
    buyer_id: number;
    seller_id: number;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    completed_at?: string;
    created_at: string;
    updated_at: string;
    listing: Listing;
    buyer: {
        id: number;
        name: string;
        email: string;
    };
    seller: {
        id: number;
        name: string;
        email: string;
    };
}

export interface DashboardStats {
    total_listings: number;
    active_listings: number;
    total_sales: number;
    pending_transactions: number;
    total_views: number;
    total_revenue: number;
}
