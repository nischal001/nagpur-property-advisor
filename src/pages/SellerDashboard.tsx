import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, MessageSquare, TrendingUp, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/data';

const statusIcon: Record<string, any> = {
  pending: <Clock className="w-4 h-4 text-warning" />,
  approved: <CheckCircle className="w-4 h-4 text-success" />,
  rejected: <XCircle className="w-4 h-4 text-destructive" />,
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [propRes, inqRes] = await Promise.all([
        supabase.from('properties').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*, properties(title)').eq('properties.seller_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);
      setProperties(propRes.data || []);
      setInquiries(inqRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const stats = [
    { label: 'Total Listings', value: properties.length, icon: Home, color: 'text-navy' },
    { label: 'Approved', value: properties.filter(p => p.status === 'approved').length, icon: CheckCircle, color: 'text-success' },
    { label: 'Pending', value: properties.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-warning' },
    { label: 'Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-gold' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 mt-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Seller Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage your property listings and inquiries.</p>
            </div>
            <Button variant="gold" asChild>
              <Link to="/seller"><Plus className="w-4 h-4 mr-1" /> Add Property</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-card rounded-xl p-5 shadow-card border border-border/50">
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Properties Table */}
          <div className="bg-card rounded-xl shadow-card border border-border/50 mb-8">
            <div className="p-5 border-b border-border">
              <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" /> Your Properties
              </h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No properties yet. <Link to="/seller" className="text-gold hover:underline">List your first property</Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {properties.map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.location} • {formatPrice(p.price)}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {statusIcon[p.status]}
                      <span className="text-xs font-medium capitalize text-muted-foreground">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-card rounded-xl shadow-card border border-border/50">
            <div className="p-5 border-b border-border">
              <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" /> Recent Inquiries
              </h3>
            </div>
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No inquiries yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {inquiries.map(i => (
                  <div key={i.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground text-sm">{i.buyer_name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{i.buyer_phone} • {i.message?.slice(0, 80)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SellerDashboard;
