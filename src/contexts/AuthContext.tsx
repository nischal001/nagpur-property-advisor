import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'buyer' | 'seller' | 'admin';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  roles: UserRole[];
  profile: { name: string; email: string | null; phone: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null, user: null, roles: [], profile: null, loading: true,
  signOut: async () => {}, hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const hasOAuthCallbackParams = () => {
  if (typeof window === 'undefined') return false;

  const url = new URL(window.location.href);
  return (
    url.searchParams.has('code') ||
    url.searchParams.has('access_token') ||
    url.hash.includes('access_token') ||
    url.hash.includes('refresh_token')
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [loading, setLoading] = useState(true);
  const initialAuthResolved = useRef(false);

  const fetchUserData = async (userId: string) => {
    try {
      const [rolesRes, profileRes] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', userId),
        supabase.from('profiles').select('name, email, phone').eq('user_id', userId).single(),
      ]);
      if (rolesRes.data) setRoles(rolesRes.data.map(r => r.role as UserRole));
      if (profileRes.data) setProfile(profileRes.data);
    } catch (err) {
      console.warn('Failed to fetch user data:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const applySession = (nextSession: Session | null) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        const meta = nextSession.user.user_metadata;
        setRoles([]);
        setProfile({
          name: meta?.full_name || meta?.name || '',
          email: nextSession.user.email ?? null,
          phone: typeof meta?.phone === 'string' ? meta.phone : null,
        });
        setTimeout(() => {
          void fetchUserData(nextSession.user.id);
        }, 0);
      } else {
        setRoles([]);
        setProfile(null);
      }

      setLoading(false);
    };

    const syncSession = async (withRetry = false) => {
      const attempts = withRetry ? 6 : 1;

      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const { data: { session: nextSession } } = await supabase.auth.getSession();

        if (nextSession?.user || attempt === attempts - 1) {
          initialAuthResolved.current = true;
          applySession(nextSession);
          return;
        }

        await wait(250);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        initialAuthResolved.current = true;
        applySession(nextSession);
      }
    );

    void syncSession(hasOAuthCallbackParams());

    const handleWindowFocus = () => {
      if (!initialAuthResolved.current) return;
      void syncSession(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleWindowFocus();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRoles([]);
    setProfile(null);
  };

  const hasRole = (role: UserRole) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ session, user, roles, profile, loading, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};