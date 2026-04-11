import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { name, role },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        // Add seller role if selected
        if (role === 'seller') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('user_roles').insert({ user_id: user.id, role: 'seller' });
          }
        }
        toast.success('Account created! Check your email to verify.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 rounded-lg border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-gold/30 outline-none";
  const labelClass = "text-sm font-medium text-foreground mb-1.5 block";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? 'Sign in to your Nagpur Property account' : 'Join our trusted property platform'}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 md:p-8 shadow-card border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                  </div>
                  <div>
                    <label className={labelClass}>I want to</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['buyer', 'seller'] as const).map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                            role === r
                              ? 'border-gold bg-gold/10 text-foreground'
                              : 'border-input text-muted-foreground hover:border-gold/40'
                          }`}
                        >
                          {r === 'buyer' ? '🏠 Buy Property' : '📋 Sell Property'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input className={inputClass} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              <Button variant="gold" className="w-full" size="lg" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="text-gold font-medium">{isLogin ? 'Sign Up' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
