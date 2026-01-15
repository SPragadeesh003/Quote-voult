import { supabase } from '../../config/supabaseConfig';

export interface Profile {
    id: string;
    username: string | null;
    avatar_url: string | null;
    updated_at: string | null;
}

export const ProfileService = {
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error('Error fetching profile:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('Exception fetching profile:', e);
            return null;
        }
    },

    async getCollectionCount(userId: string): Promise<number> {
        try {
            const { count, error } = await supabase
                .from('collections')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching collection count:', error);
                return 0;
            }
            return count || 0;
        } catch (e) {
            console.error('Exception fetching collection count:', e);
            return 0;
        }
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });

            if (error) {
                throw error;
            }
        } catch (e) {
            console.error('Error updating profile:', e);
            throw e;
        }
    },

    async uploadAvatar(userId: string, imageUri: string): Promise<string | null> {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result instanceof ArrayBuffer) {
                        resolve(reader.result);
                    } else {
                        reject(new Error('Expected ArrayBuffer'));
                    }
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });

            const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = `avatars/${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('quick-volt-pragadeesh')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('quick-volt-pragadeesh')
                .getPublicUrl(filePath);

            return data.publicUrl;

        } catch (e) {
            console.error('Error uploading avatar:', e);
            throw e;
        }
    }
};
