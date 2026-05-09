import { useEffect, useState } from 'react';
import { contactContentApi } from '../api';
import { useContactContent } from '../context/ContactContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

const defaultForm = {
  addressTitle: '',
  addressLines: [],
  contactTitle: '',
  phoneNumbers: [],
  emails: [],
  openHoursTitle: '',
  openHoursLines: [],
  mapEmbedUrl: '',
};

export default function ContactContentForm() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { setContactContent } = useContactContent();

  useEffect(() => {
    let mounted = true;
    contactContentApi.getAdmin()
      .then((res) => {
        if (mounted) setForm(res.data || defaultForm);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load contact content');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateListItem = (field, index, value) => {
    setForm((prev) => {
      const list = [...(prev[field] || [])];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field, value = '') => {
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const removeListItem = (field, index) => {
    setForm((prev) => {
      const list = (prev[field] || []).filter((_, i) => i !== index);
      return { ...prev, [field]: list };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const res = await contactContentApi.update(form);
      setContactContent(res.data);
      setMsg('Contact content updated ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading contact content…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contact Page Content</h1>
          <p className="text-sm text-slate-500">Edit address, contact details, open hours, and map embed URL.</p>
        </div>
        <Button type="submit" form="contact-content-form" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {msg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form id="contact-content-form" onSubmit={handleSave} className="space-y-6">
        {/* Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <i className="fa-solid fa-location-dot text-blue-500" /> Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.addressTitle} onChange={(e) => updateField('addressTitle', e.target.value)} placeholder="e.g. Our Office" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Address Lines</Label>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => addListItem('addressLines')}>
                  + Add Line
                </Button>
              </div>
              <div className="space-y-2">
                {(form.addressLines || []).map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={line} onChange={(e) => updateListItem('addressLines', i, e.target.value)} placeholder="Address line" />
                    <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:bg-red-50" onClick={() => removeListItem('addressLines', i)}>
                      <i className="fa-solid fa-xmark" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <i className="fa-solid fa-phone text-blue-500" /> Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input value={form.contactTitle} onChange={(e) => updateField('contactTitle', e.target.value)} placeholder="e.g. Contact Info" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Numbers</Label>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => addListItem('phoneNumbers')}>
                  + Add Phone
                </Button>
              </div>
              <div className="space-y-2">
                {(form.phoneNumbers || []).map((phone, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={phone} onChange={(e) => updateListItem('phoneNumbers', i, e.target.value)} placeholder="+44 ..." />
                    <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:bg-red-50" onClick={() => removeListItem('phoneNumbers', i)}>
                      <i className="fa-solid fa-xmark" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Emails</Label>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => addListItem('emails')}>
                  + Add Email
                </Button>
              </div>
              <div className="space-y-2">
                {(form.emails || []).map((email, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={email} onChange={(e) => updateListItem('emails', i, e.target.value)} placeholder="info@example.com" />
                    <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:bg-red-50" onClick={() => removeListItem('emails', i)}>
                      <i className="fa-solid fa-xmark" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Hours Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <i className="fa-regular fa-clock text-blue-500" /> Open Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.openHoursTitle} onChange={(e) => updateField('openHoursTitle', e.target.value)} placeholder="e.g. Business Hours" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hours Lines</Label>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => addListItem('openHoursLines')}>
                  + Add Line
                </Button>
              </div>
              <div className="space-y-2">
                {(form.openHoursLines || []).map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={line} onChange={(e) => updateListItem('openHoursLines', i, e.target.value)} placeholder="Mon - Fri: 9am - 5pm" />
                    <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:bg-red-50" onClick={() => removeListItem('openHoursLines', i)}>
                      <i className="fa-solid fa-xmark" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <i className="fa-solid fa-map text-blue-500" /> Map Embed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input value={form.mapEmbedUrl} onChange={(e) => updateField('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
            <p className="text-[11px] text-slate-500 italic">Copy the src attribute from the Google Maps iframe embed code.</p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
