import { useAuth } from '@/src/context/AuthProvider';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseConfig';
import { Quote } from '../../types/Quote.types';

type FavoritesContextType = {
    favoriteIds: Set<string>;
    toggleFavorite: (quote: Quote) => Promise<boolean>;
    isFavorite: (quoteId: string) => boolean;
    refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshFavorites();
    }, [session]);

    const refreshFavorites = async () => {
        if (!session?.user) {
            setFavoriteIds(new Set());
            return;
        }

        try {
            const { data } = await supabase
                .from('favorites')
                .select('quote_id')
                .eq('user_id', session.user.id);

            if (data) {
                setFavoriteIds(new Set(data.map((item: any) => item.quote_id)));
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const isFavorite = (quoteId: string) => favoriteIds.has(quoteId);

    const toggleFavorite = async (quote: Quote): Promise<boolean> => {
        if (!session?.user) return false;
        const isCurrentlyFav = favoriteIds.has(quote.id);
        const newFavorites = new Set(favoriteIds);
        if (isCurrentlyFav) {
            newFavorites.delete(quote.id);
        } else {
            newFavorites.add(quote.id);
        }
        setFavoriteIds(newFavorites);

        try {
            if (isCurrentlyFav) {
                const { error: favError } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', session.user.id)
                    .eq('quote_id', quote.id);

                if (favError) throw favError;
                const { data: userCollections } = await supabase
                    .from('collections')
                    .select('id')
                    .eq('user_id', session.user.id);

                if (userCollections && userCollections.length > 0) {
                    const collectionIds = userCollections.map(c => c.id);
                    await supabase
                        .from('collection_items')
                        .delete()
                        .eq('quote_id', quote.id)
                        .in('collection_id', collectionIds);
                }

                return false;
            } else {
                await supabase
                    .from('favorites')
                    .insert({
                        user_id: session.user.id,
                        quote_id: quote.id,
                    });
                return true;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            refreshFavorites();
            return isCurrentlyFav;
        }
    };

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
