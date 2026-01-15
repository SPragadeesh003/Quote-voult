import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseConfig';

type AuthContextType = {
  loading: boolean;
  session: Session | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true, signOut: async () => { } });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      try {
        if (url.includes('access_token') && url.includes('refresh_token')) {
          const fragment = url.split('#')[1] || url.split('?')[1];
          if (fragment) {
            const params = new URLSearchParams(fragment);
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token && refresh_token) {
              await supabase.auth.setSession({
                access_token,
                refresh_token,
              });
            }
          }
        }
      } catch (e) {
        console.error('Error parsing deep link:', e);
      }
    };

    const initAuth = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && (initialUrl.includes('access_token') || initialUrl.includes('refresh_token'))) {
          await handleDeepLink(initialUrl);
        } else {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleUrlEvent = ({ url }: { url: string }) => {
      if (url.includes('access_token') || url.includes('refresh_token')) {
        setLoading(true);
        handleDeepLink(url).finally(() => setLoading(false));
      }
    };

    const linkingSubscription = Linking.addEventListener('url', handleUrlEvent);

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};