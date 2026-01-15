export type Quote = {
    id: string;
    text: string;
    author: string;
    category: string;
    created_at: string;
    is_favorite?: boolean;
    user_id?: string;
    background_image?: string;
};

export type Collection = {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
};

export type Favorite = {
    id: string;
    user_id: string;
    quote_id: string;
    created_at: string;
    quote?: Quote; // For joined queries
};

export type CollectionItem = {
    id: string;
    collection_id: string;
    quote_id: string;
    created_at: string;
    quote?: Quote; // For joined queries
};

export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    updated_at: string;
};