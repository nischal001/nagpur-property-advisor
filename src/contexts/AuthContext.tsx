import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [loading, setLoading] = useState(true);

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
    // First restore session from local storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Build profile from user metadata as fallback
        const meta = session.user.user_metadata;
        if (meta?.name || meta?.full_name) {
          setProfile({
            name: meta.full_name || meta.name || '',
            email: session.user.email ?? null,
            phone: meta.phone ?? null,
          });
        }
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Then listen for subsequent auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const meta = session.user.user_metadata;
          if (meta?.name || meta?.full_name) {
            setProfile({
              name: meta.full_name || meta.name || '',
              email: session.user.email ?? null,
              phone: meta.phone ?? null,
            });
          }
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setRoles([]);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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
