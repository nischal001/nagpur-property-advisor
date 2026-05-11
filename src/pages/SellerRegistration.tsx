import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { LOCATIONS, PROPERTY_TYPES, APPROVAL_TYPES } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const steps = ['Basic Info', 'Property Details', 'Documents', 'Pricing & Contact'];

const DOC_TYPES = ['7/12 Extract', 'RERA Certificate', 'Layout Approval', 'Sale Deed'] as const;
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_DOC_SIZE = 20 * 1024 * 1024;

const formatINR = (val: string) => {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-IN');
};

const inrToWords = (val: string) => {
  const n = Number(val.replace(/\D/g, ''));
  if (!n) return '';
  if (n >= 1e7) return `₹ ${(n / 1e7).toFixed(2)} Crore`;
  if (n >= 1e5) return `₹ ${(n / 1e5).toFixed(2)} Lakh`;
  if (n >= 1e3) return `₹ ${(n / 1e3).toFixed(2)} Thousand`;
  return `₹ ${n}`;
};

const SellerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    title: '', description: '', propertyType: '', location: '', area: '', approvalType: '',
    price: '', contactPhone: '',
  });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleImagesUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploadingImages(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 10MB`);
          continue;
        }
        const folder = user?.id || 'submissions';
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/\s+/g, '-')}`;
        const { error } = await supabase.storage.from('property-images').upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      if (urls.length) {
        setPropertyImages(prev => [...prev, ...urls]);
        toast.success(`${urls.length} photo${urls.length > 1 ? 's' : ''} added`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const removePropertyImage = (idx: number) =>
    setPropertyImages(prev => prev.filter((_, i) => i !== idx));

  const handleDocUpload = async (docType: string, file: File) => {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    if (file.size > MAX_DOC_SIZE) {
      toast.error('File size must be under 20MB');
      return;
    }

    setUploadingDoc(docType);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('docType', docType);
      if (user?.id) {
        formData.append('sellerId', user.id);
      }

      const { data, error } = await supabase.functions.invoke('upload-property-document', {
        body: formData,
      });

      if (error) throw error;
      if (data?.error || !data?.path) {
        throw new Error(data?.error || 'Upload failed');
      }

      setUploadedDocs(prev => ({ ...prev, [docType]: data.path }));
      toast.success(`${docType} uploaded successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingDoc(null);
    }
  };

  const submit = async () => {
    // Validate required fields before submitting
    const missing: string[] = [];
    if (!form.title.trim()) missing.push('Property Title');
    if (!form.location) missing.push('Location');
    if (!form.propertyType) missing.push('Property Type');
    if (!form.area || Number.isNaN(Number(form.area)) || Number(form.area) <= 0) missing.push('Area');
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) <= 0) missing.push('Price');
    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      // Use edge function to bypass any client-side blockers (extensions, ad-blockers
      // intercepting Supabase REST URLs). Service-role insert handles property + docs atomically.
      const documents = Object.entries(uploadedDocs).map(([type, file_url]) => ({ type, file_url }));
      const { data, error: fnError } = await supabase.functions.invoke('submit-property', {
        body: {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          location: form.location,
          property_type: form.propertyType,
          area: Number(form.area),
          approval_type: form.approvalType || null,
          seller_id: user?.id ?? null,
          submitter_name: form.name || null,
          submitter_phone: form.contactPhone || form.phone || null,
          submitter_email: form.email || null,
          images: propertyImages,
          documents,
        },
      });

      if (fnError) {
        console.error('submit-property error:', fnError);
        throw fnError;
      }
      if (data?.error) throw new Error(data.error);

      // Ensure seller role for signed-in users
      if (user) {
        await supabase.from('user_roles').upsert(
          { user_id: user.id, role: 'seller' as const },
          { onConflict: 'user_id,role' }
        );
      }

      toast.success('Property submitted for review! Our team will contact you within 24 hours.');
      navigate(user ? '/dashboard' : '/');
    } catch (err: any) {
      console.error('Submission error:', err);
      const msg = err?.message === 'Failed to fetch'
        ? 'Network error — please check your internet connection or try disabling ad-blockers.'
        : (err?.message || 'Submission failed');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full h-11 rounded-lg border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-gold/30 outline-none";
  const labelClass = "text-sm font-medium text-foreground mb-1.5 block";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">List Your Property</h1>
            <p className="text-muted-foreground">Get access to verified buyers and our managed brokerage service.</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i <= step ? 'bg-gold text-navy-dark' : 'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className="hidden sm:block text-xs ml-2 text-muted-foreground">{s}</span>
                {i < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-gold' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 md:p-8 shadow-card border border-border/50">
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Basic Information</h3>
                <div><label className={labelClass}>Full Name</label><input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" /></div>
                <div><label className={labelClass}>Email</label><input className={inputClass} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" /></div>
                <div><label className={labelClass}>Phone</label><input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Property Details</h3>
                <div><label className={labelClass}>Property Title</label><input className={inputClass} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. 2BHK Flat in Dharampeth" /></div>
                <div><label className={labelClass}>Description</label><textarea className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none min-h-[100px]" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your property..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Type</label>
                    <select className={inputClass} value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                      <option value="">Select</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <select
                      className={inputClass}
                      value={LOCATIONS.includes(form.location as any) ? form.location : (form.location ? '__other__' : '')}
                      onChange={e => update('location', e.target.value === '__other__' ? ' ' : e.target.value)}
                    >
                      <option value="">Select</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      <option value="__other__">Other (enter manually)</option>
                    </select>
                    {form.location !== '' && !LOCATIONS.includes(form.location as any) && (
                      <input
                        className={`${inputClass} mt-2`}
                        placeholder="Enter location"
                        value={form.location.trim()}
                        onChange={e => update('location', e.target.value)}
                        autoFocus
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Area (sq ft)</label><input className={inputClass} type="number" value={form.area} onChange={e => update('area', e.target.value)} /></div>
                  <div>
                    <label className={labelClass}>Approval Type</label>
                    <select className={inputClass} value={form.approvalType} onChange={e => update('approvalType', e.target.value)}>
                      <option value="">Select</option>
                      {APPROVAL_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Property Photos ({propertyImages.length})</label>
                    <input
                      ref={imagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => { handleImagesUpload(e.target.files); e.target.value = ''; }}
                    />
                    <Button type="button" variant="outline" size="sm" disabled={uploadingImages} onClick={() => imagesInputRef.current?.click()}>
                      {uploadingImages ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading</> : <><Upload className="w-4 h-4 mr-1" /> Add Photos</>}
                    </Button>
                  </div>
                  {propertyImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {propertyImages.map((url, i) => (
                        <div key={url} className="relative group aspect-square">
                          <img src={url} alt={`Property photo ${i + 1}`} className="w-full h-full object-cover rounded-md border border-border" />
                          <button type="button" onClick={() => removePropertyImage(i)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-border rounded-lg p-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                      <ImageIcon className="w-6 h-6 opacity-50" />
                      Add clear photos of your property (max 10 MB each). Buyers convert 5× more on listings with real photos.
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Upload Documents</h3>
                {DOC_TYPES.map(doc => (
                  <div key={doc} className="flex items-center justify-between p-4 border border-dashed border-border rounded-lg hover:border-gold/40 transition-colors">
                    <div className="flex items-center gap-2">
                      {uploadedDocs[doc] ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : null}
                      <span className="text-sm text-foreground">{doc}</span>
                    </div>
                    <div>
                      <input
                        type="file"
                        className="hidden"
                        ref={el => { fileInputRefs.current[doc] = el; }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                            if (file) handleDocUpload(doc, file);
                            e.target.value = '';
                        }}
                      />
                      <Button
                        variant={uploadedDocs[doc] ? "outline" : "outline"}
                        size="sm"
                        disabled={uploadingDoc === doc}
                        onClick={() => fileInputRefs.current[doc]?.click()}
                      >
                        {uploadingDoc === doc ? (
                          <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading</>
                        ) : uploadedDocs[doc] ? (
                          <><CheckCircle className="w-4 h-4 mr-1" /> Uploaded</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-1" /> Upload</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Documents will be verified by our legal team within 48 hours.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Pricing & Contact</h3>
                <div>
                  <label className={labelClass}>Expected Price (₹)</label>
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    value={form.price ? formatINR(form.price) : ''}
                    onChange={e => update('price', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 50,00,000"
                  />
                  {form.price && (
                    <p className="text-xs text-muted-foreground mt-1">{inrToWords(form.price)}</p>
                  )}
                </div>
                <div><label className={labelClass}>Contact Phone</label><input className={inputClass} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="+91 98765 43210" /></div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <Button variant="outline" onClick={back}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              ) : <div />}
              {step < 3 ? (
                <Button variant="gold" onClick={next}>Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
              ) : (
                <Button variant="gold" onClick={submit} disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Submitting...</> : 'Submit Property'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SellerRegistration;
