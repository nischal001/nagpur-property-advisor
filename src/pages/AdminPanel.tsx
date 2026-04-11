import { useEffect, useState } from 'react';
import { BarChart3, Users, Home, CheckCircle, XCircle, Clock, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/data';
import { toast } from 'sonner';

type Tab = 'overview' | 'properties' | 'leads' | 'transactions';

const AdminPanel = () => {
  const { hasRole } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [propRes, inqRes, txRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      ]);
      setProperties(propRes.data || []);
      setInquiries(inqRes.data || []);
      setTransactions(txRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('properties').update({ status: 'approved', verified: true }).eq('id', id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', verified: true } : p));
    toast.success('Property approved');
  };

  const handleReject = async (id: string) => {
    await supabase.from('properties').update({ status: 'rejected' }).eq('id', id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    toast.success('Property rejected');
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast.success('Lead status updated');
  };

  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const newLeads = inquiries.filter(i => i.status === 'new').length;
  const totalBrokerage = transactions.reduce((sum, t) => sum + Number(t.brokerage_amount || 0), 0);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'transactions', label: 'Revenue', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 mt-4">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Admin CRM</h1>
            <p className="text-muted-foreground text-sm">Manage properties, leads, and transactions.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  tab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* Overview */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Properties', value: properties.length, icon: Home, color: 'text-navy' },
                      { label: 'Pending Approval', value: pendingCount, icon: Clock, color: 'text-warning' },
                      { label: 'New Leads', value: newLeads, icon: Users, color: 'text-gold' },
                      { label: 'Total Brokerage', value: formatPrice(totalBrokerage), icon: TrendingUp, color: 'text-success' },
                    ].map(s => (
                      <div key={s.label} className="bg-card rounded-xl p-5 shadow-card border border-border/50">
                        <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                        <div className="text-xl font-bold text-foreground">{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent pending */}
                  <div className="bg-card rounded-xl shadow-card border border-border/50">
                    <div className="p-5 border-b border-border">
                      <h3 className="font-semibold text-foreground">Pending Approvals</h3>
                    </div>
                    {properties.filter(p => p.status === 'pending').length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground text-sm">No pending properties</div>
                    ) : (
                      <div className="divide-y divide-border">
                        {properties.filter(p => p.status === 'pending').slice(0, 5).map(p => (
                          <div key={p.id} className="p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground text-sm">{p.title}</div>
                              <div className="text-xs text-muted-foreground">{p.location} • {formatPrice(p.price)}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="gold" onClick={() => handleApprove(p.id)}>Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(p.id)}>Reject</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Properties */}
              {tab === 'properties' && (
                <div className="bg-card rounded-xl shadow-card border border-border/50">
                  <div className="divide-y divide-border">
                    {properties.map(p => (
                      <div key={p.id} className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.location} • {formatPrice(p.price)} • {p.property_type}</div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            p.status === 'approved' ? 'bg-success/10 text-success'
                              : p.status === 'rejected' ? 'bg-destructive/10 text-destructive'
                              : 'bg-warning/10 text-warning'
                          }`}>{p.status}</span>
                          {p.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="gold" onClick={() => handleApprove(p.id)}>✓</Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(p.id)}>✗</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && <div className="p-8 text-center text-muted-foreground">No properties</div>}
                  </div>
                </div>
              )}

              {/* Leads */}
              {tab === 'leads' && (
                <div className="bg-card rounded-xl shadow-card border border-border/50">
                  <div className="divide-y divide-border">
                    {inquiries.map(i => (
                      <div key={i.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-foreground text-sm">{i.buyer_name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{i.buyer_phone}</span>
                          </div>
                          <select
                            className="text-xs border border-input rounded-md px-2 py-1 bg-background"
                            value={i.status}
                            onChange={e => updateLeadStatus(i.id, e.target.value)}
                          >
                            {['new', 'contacted', 'site_visit', 'negotiation', 'closed', 'lost'].map(s => (
                              <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-muted-foreground">{i.message || 'No message'}</div>
                      </div>
                    ))}
                    {inquiries.length === 0 && <div className="p-8 text-center text-muted-foreground">No leads yet</div>}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {tab === 'transactions' && (
                <div className="bg-card rounded-xl shadow-card border border-border/50">
                  <div className="divide-y divide-border">
                    {transactions.map(t => (
                      <div key={t.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">Sale: {formatPrice(t.sale_amount)}</div>
                          <div className="text-xs text-muted-foreground">Brokerage: {formatPrice(t.brokerage_amount)} • {t.status}</div>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {transactions.length === 0 && <div className="p-8 text-center text-muted-foreground">No transactions yet</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
