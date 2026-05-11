import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Upload, Loader2, Mail, Phone } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  property: any;
  seller: any;
  onSaved: (p: any) => void;
}

const EMPTY = {
  title: '', description: '', price: 0, location: '', property_type: '',
  area: 0, area_unit: 'sq ft', approval_type: '', status: 'pending',
  risk_level: 'Medium', verified: false, rera_registered: false,
  title_verified: false, possession_verified: false, visible: true, sold_out: false, images: [] as string[],
};

const EditPropertyDialog = ({ open, onClose, property, seller, onSaved }: Props) => {
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (property) setForm({ ...EMPTY, ...property, images: property.images || [] });
  }, [property]);

  if (!property) return null;

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const path = `${property.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const { error } = await supabase.storage.from('property-images').upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      set('images', [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    set('images', form.images.filter((_: any, i: number) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, updated_at, seller_id, ...updates } = form;
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, price: Number(updates.price), area: Number(updates.area) })
      .eq('id', property.id)
      .select()
      .single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Property updated');
    onSaved(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        {(seller || property?.submitter_name || property?.submitter_phone || property?.submitter_email) && (
          <div className="bg-muted rounded-lg p-3 text-sm space-y-2">
            {seller && (
              <div className="space-y-1">
                <div className="font-medium text-foreground">Seller Account: {seller.name || 'Unnamed'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {seller.email || '—'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {seller.phone || '—'}</div>
              </div>
            )}
            {(property?.submitter_name || property?.submitter_phone || property?.submitter_email) && (
              <div className="space-y-1 pt-2 border-t border-border/60">
                <div className="font-medium text-foreground">Submitted in Listing Form: {property.submitter_name || '—'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {property.submitter_email || '—'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {property.submitter_phone || '—'}</div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={4} value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <Label>Price (₹)</Label>
            <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div>
            <Label>Property Type</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.property_type} onChange={e => set('property_type', e.target.value)}>
              {['Plot', 'Apartment', 'Villa', 'Commercial', 'Agricultural', 'Independent House', 'Bungalow'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Approval Type</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.approval_type || ''} onChange={e => set('approval_type', e.target.value)}>
              <option value="">N/A</option>
              {['NMRDA', 'NIT', 'Gunthewari', 'Gram Panchayat', 'RERA', 'Other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Area</Label>
            <Input type="number" value={form.area} onChange={e => set('area', e.target.value)} />
          </div>
          <div>
            <Label>Area Unit</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.area_unit} onChange={e => set('area_unit', e.target.value)}>
              {['sq ft', 'sq m', 'acres', 'guntha'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.status} onChange={e => set('status', e.target.value)}>
              {['pending', 'approved', 'rejected'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label>Risk Level</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.risk_level} onChange={e => set('risk_level', e.target.value)}>
              {['Low', 'Medium', 'High'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 bg-muted/50 rounded-lg p-3">
            {[
              { k: 'verified', label: 'V-Audit Verified' },
              { k: 'rera_registered', label: 'RERA Registered' },
              { k: 'title_verified', label: 'Title Verified' },
              { k: 'possession_verified', label: 'Possession Verified' },
              { k: 'visible', label: 'Visible on Website' },
              { k: 'sold_out', label: 'Mark as Sold Out' },
            ].map(({ k, label }) => (
              <div key={k} className="flex items-center justify-between gap-2">
                <Label className="text-xs">{label}</Label>
                <Switch checked={!!form[k]} onCheckedChange={v => set(k, v)} />
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label>Photos ({form.images.length})</Label>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                <span className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Add Photos
                </span>
              </label>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {form.images.map((url: string, i: number) => (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-md" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="col-span-full text-center text-xs text-muted-foreground py-6 border border-dashed rounded-md">
                  No photos yet
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="gold" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyDialog;
