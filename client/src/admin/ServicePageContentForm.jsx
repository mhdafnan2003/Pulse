import { useEffect, useState, useRef } from 'react';
import { serviceContentApi } from '../api';
import { useServiceContent } from '../context/ServiceContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Separator } from '../components/ui/separator';

const defaultForm = {
  services: [],
};

const newService = (index) => ({
  id: String(index + 1).padStart(3, '0'),
  title: '',
  subtitle: '',
  features: [''],
});

export default function ServicePageContentForm() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { setServiceContent } = useServiceContent();
  const lastAddedServiceRef = useRef(null);
  const lastAddedServiceFeatureRef = useRef(null);
  const focusNewServiceRef = useRef(false);
  const focusNewFeatureRef = useRef(false);
  const [serviceOpenItems, setServiceOpenItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    serviceContentApi.getAdmin()
      .then((res) => {
        if (mounted) setForm(res.data || defaultForm);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load service page content');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (focusNewServiceRef.current && lastAddedServiceRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedServiceRef.current) {
          lastAddedServiceRef.current.focus();
          lastAddedServiceRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        focusNewServiceRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [form.services.length]);

  useEffect(() => {
    if (focusNewFeatureRef.current && lastAddedServiceFeatureRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedServiceFeatureRef.current) {
          lastAddedServiceFeatureRef.current.focus();
          lastAddedServiceFeatureRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        focusNewFeatureRef.current = false;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [form.services.map(s => s.features?.length || 0).join('-')]);

  const updateService = (index, field, value) => {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], [field]: value };
      return { ...prev, services };
    });
  };

  const addService = () => {
    const nextIndex = form.services.length;
    focusNewServiceRef.current = true;
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, newService(prev.services.length)],
    }));
    setServiceOpenItems((prev) => Array.from(new Set([...prev, `service-${nextIndex}`])));
  };

  const removeService = (index) => {
    setForm((prev) => {
      const services = prev.services.filter((_, i) => i !== index);
      return { ...prev, services };
    });
    setServiceOpenItems((prev) => shiftOpenItems(prev, index, 'service'));
  };

  const updateServiceFeature = (serviceIndex, featureIndex, value) => {
    setForm((prev) => {
      const services = [...prev.services];
      const features = [...(services[serviceIndex]?.features || [])];
      features[featureIndex] = value;
      services[serviceIndex] = { ...services[serviceIndex], features };
      return { ...prev, services };
    });
  };

  const addServiceFeature = (serviceIndex) => {
    focusNewFeatureRef.current = true;
    setForm((prev) => {
      const services = [...prev.services];
      const features = [...(services[serviceIndex]?.features || [])];
      features.push('');
      services[serviceIndex] = { ...services[serviceIndex], features };
      return { ...prev, services };
    });
  };

  const removeServiceFeature = (serviceIndex, featureIndex) => {
    setForm((prev) => {
      const services = [...prev.services];
      const features = (services[serviceIndex]?.features || []).filter((_, i) => i !== featureIndex);
      services[serviceIndex] = { ...services[serviceIndex], features };
      return { ...prev, services };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const res = await serviceContentApi.update(form);
      setServiceContent(res.data);
      setMsg('Service page updated ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading service page content…</div>;
  }

  const services = form.services || [];
  const serviceAccordionKey = services.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Service Page Content</h1>
          <p className="text-sm text-slate-500">Edit the service cards, subtitles, and points.</p>
        </div>
        <Button type="submit" form="service-content-form" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {msg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form id="service-content-form" onSubmit={handleSave} className="space-y-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Service Cards</CardTitle>
              <CardDescription>Collapse each card to keep the list compact.</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addService}>Add Service</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No services yet.</div>
            ) : (
              <Accordion
                key={serviceAccordionKey}
                type="multiple"
                value={serviceOpenItems}
                onValueChange={setServiceOpenItems}
                className="space-y-2"
              >
                {services.map((svc, i) => {
                  const isLastAdded = i === services.length - 1;
                  const points = svc.features || [];
                  return (
                    <AccordionItem key={`service-${i}`} value={`service-${i}`}>
                      <AccordionTrigger>
                        <span className="text-sm">Service {i + 1}{svc.title ? ` · ${svc.title}` : ''}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <div className="grid gap-3 sm:grid-cols-[90px,1fr,1fr]">
                            <div className="space-y-1">
                              <Label>ID</Label>
                              <Input value={svc.id} onChange={(e) => updateService(i, 'id', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label>Title</Label>
                              <Input
                                ref={isLastAdded ? lastAddedServiceRef : null}
                                value={svc.title}
                                onChange={(e) => updateService(i, 'title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Subtitle</Label>
                              <Input value={svc.subtitle} onChange={(e) => updateService(i, 'subtitle', e.target.value)} />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Points</Label>
                              <Button type="button" size="sm" variant="secondary" onClick={() => addServiceFeature(i)}>
                                Add Point
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {points.length === 0 ? (
                                <div className="text-xs text-slate-500">No points yet.</div>
                              ) : (
                                points.map((feat, fIndex) => {
                                  const isLastFeature = fIndex === points.length - 1;
                                  return (
                                    <div key={fIndex} className="flex items-center gap-2">
                                      <Input
                                        ref={isLastFeature ? lastAddedServiceFeatureRef : null}
                                        value={feat}
                                        onChange={(e) => updateServiceFeature(i, fIndex, e.target.value)}
                                        placeholder="Point"
                                      />
                                      <Button type="button" size="icon" variant="ghost" onClick={() => removeServiceFeature(i, fIndex)}>
                                        <i className="fa-solid fa-xmark" />
                                      </Button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          <Button type="button" size="sm" variant="destructive" onClick={() => removeService(i)}>
                            Remove Service
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function shiftOpenItems(items, removedIndex, prefix) {
  return items
    .map((value) => {
      if (!value.startsWith(`${prefix}-`)) return value;
      const index = Number(value.slice(prefix.length + 1));
      if (Number.isNaN(index)) return null;
      if (index === removedIndex) return null;
      if (index > removedIndex) return `${prefix}-${index - 1}`;
      return value;
    })
    .filter(Boolean);
}
