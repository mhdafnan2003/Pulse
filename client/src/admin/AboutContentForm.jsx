import { useEffect, useState } from 'react';
import { aboutContentApi } from '../api';
import { useAboutContent } from '../context/AboutContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const defaultForm = {
  breadcrumbTitle: '',
  heroEyebrow: '',
  heroTitle: '',
  sections: [],
};

const newSection = {
  title: '',
  lead: '',
  body: '',
  highlightIcon: 'fas fa-check-circle',
  highlightText: '',
  imageUrl: '',
  imageAlt: '',
};

export default function AboutContentForm() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [openItems, setOpenItems] = useState([]);
  const { setAboutContent } = useAboutContent();
  const inputClass = '!text-slate-900 placeholder:!text-slate-400';
  const textareaClass = '!text-slate-900 placeholder:!text-slate-400';

  useEffect(() => {
    let mounted = true;
    aboutContentApi.getAdmin()
      .then((res) => {
        if (mounted) setForm(res.data || defaultForm);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load about content');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSection = (index, field, value) => {
    setForm((prev) => {
      const sections = [...(prev.sections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    const nextIndex = form.sections.length;
    setForm((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { ...newSection }],
    }));
    setOpenItems((prev) => Array.from(new Set([...prev, `section-${nextIndex}`])));
  };

  const removeSection = (index) => {
    setForm((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== index),
    }));
    setOpenItems((prev) => prev.filter((item) => item !== `section-${index}`));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const res = await aboutContentApi.update(form);
      setAboutContent(res.data);
      setMsg('About page updated ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading about page content…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">About Page Content</h1>
          <p className="text-sm text-slate-500">Edit the About page headline and sections.</p>
        </div>
        <Button type="submit" form="about-content-form" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {msg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form id="about-content-form" onSubmit={handleSave} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
            <CardDescription>Breadcrumb label and header text.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Breadcrumb Title</Label>
              <Input value={form.breadcrumbTitle} onChange={(e) => updateField('breadcrumbTitle', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label>Eyebrow</Label>
              <Input value={form.heroEyebrow} onChange={(e) => updateField('heroEyebrow', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label>Headline</Label>
              <Input value={form.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} className={inputClass} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Update each About section content and image.</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addSection}>Add Section</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(form.sections || []).length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No sections yet.</div>
            ) : (
              <Accordion
                type="multiple"
                value={openItems}
                onValueChange={setOpenItems}
                className="space-y-2"
              >
                {(form.sections || []).map((section, index) => (
                  <AccordionItem key={`section-${index}`} value={`section-${index}`}>
                    <AccordionTrigger>
                      <span className="text-sm">Section {index + 1}{section.title ? ` · ${section.title}` : ''}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label>Title</Label>
                            <Input value={section.title} onChange={(e) => updateSection(index, 'title', e.target.value)} className={inputClass} />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label>Lead</Label>
                            <Textarea value={section.lead} onChange={(e) => updateSection(index, 'lead', e.target.value)} className={textareaClass} />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label>Body</Label>
                            <Textarea value={section.body} onChange={(e) => updateSection(index, 'body', e.target.value)} className={textareaClass} />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label>Highlight Text</Label>
                            <Input value={section.highlightText} onChange={(e) => updateSection(index, 'highlightText', e.target.value)} className={inputClass} />
                          </div>
                        </div>
                        <Button type="button" size="sm" variant="destructive" onClick={() => removeSection(index)}>
                          Remove Section
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
