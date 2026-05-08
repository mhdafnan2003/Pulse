import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { homeContentApi, slidesApi } from '../api';
import { useHomeContent } from '../context/HomeContentContext';
import { useSlides } from '../context/SlidesContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Separator } from '../components/ui/separator';

const defaultForm = {
  reasonSection: {
    eyebrow: '',
    title: '',
    titleHighlight: '',
    description: '',
    cards: [],
  },
  servicesSection: {
    eyebrow: '',
    title: '',
    titleHighlight: '',
    services: [],
  },
  testimonialsSection: {
    eyebrow: '',
    title: '',
    titleHighlight: '',
    items: [],
  },
};

const newReasonCard = {
  icon: '/assets/img/home-1/icon/icon1.svg',
  title: '',
  desc: '',
};

const newService = (index) => ({
  id: String(index + 1).padStart(3, '0'),
  title: '',
  subtitle: '',
  features: [''],
});

const newTestimonial = {
  text: '',
  name: '',
  role: '',
  thumb: '/assets/img/home-1/testimonial/one.png',
};

export default function HomeContentForm() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [slideMsg, setSlideMsg] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [lastServiceIndexWithFeature, setLastServiceIndexWithFeature] = useState(null);
  const [reasonOpenItems, setReasonOpenItems] = useState([]);
  const [serviceOpenItems, setServiceOpenItems] = useState([]);
  const [testimonialOpenItems, setTestimonialOpenItems] = useState([]);
  const { setHomeContent } = useHomeContent();
  const { slides, loading: slidesLoading, error: slidesError, fetchSlides } = useSlides();
  
  // Refs for auto-focus
  const lastAddedReasonCardRef = useRef(null);
  const lastAddedServiceRef = useRef(null);
  const lastAddedTestimonialRef = useRef(null);
  const lastAddedServiceFeatureRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    homeContentApi.getAdmin()
      .then((res) => {
        if (mounted) {
          const data = res.data || {};
          setForm({
            ...defaultForm,
            ...data,
            reasonSection: { ...defaultForm.reasonSection, ...data.reasonSection },
            servicesSection: { ...defaultForm.servicesSection, ...data.servicesSection },
            testimonialsSection: { ...defaultForm.testimonialsSection, ...data.testimonialsSection },
          });
        }
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load home content');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    fetchSlides(true);
  }, [fetchSlides]);

  // Auto-focus on newly added reason card
  useEffect(() => {
    if (lastAddedReasonCardRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        lastAddedReasonCardRef.current.focus();
        lastAddedReasonCardRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [form.reasonSection.cards.length]);

  // Auto-focus on newly added service
  useEffect(() => {
    if (lastAddedServiceRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedServiceRef.current) {
          lastAddedServiceRef.current.focus();
          lastAddedServiceRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [form.servicesSection.services.length]);

  // Auto-focus on newly added testimonial
  useEffect(() => {
    if (lastAddedTestimonialRef.current) {
      const timer = setTimeout(() => {
        lastAddedTestimonialRef.current.focus();
        lastAddedTestimonialRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [form.testimonialsSection.items.length]);

  // Auto-focus on newly added feature
  useEffect(() => {
    if (lastAddedServiceFeatureRef.current && lastServiceIndexWithFeature !== null) {
      const timer = setTimeout(() => {
        if (lastAddedServiceFeatureRef.current) {
          lastAddedServiceFeatureRef.current.focus();
          lastAddedServiceFeatureRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [lastServiceIndexWithFeature, form.servicesSection.services.map(s => s.features?.length || 0).join('-')]);

  const handleSlideDelete = async (id, title) => {
    if (!window.confirm(`Delete slide "${title}"?`)) return;
    setDeleting(id);
    try {
      await slidesApi.remove(id);
      setSlideMsg('Slide deleted ✓');
      fetchSlides(true);
      setTimeout(() => setSlideMsg(''), 3000);
    } catch (err) {
      setSlideMsg('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const toggleSlideActive = async (slide) => {
    try {
      await slidesApi.update(slide._id, { isActive: !slide.isActive });
      fetchSlides(true);
    } catch (err) { /* ignore */ }
  };

  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateReasonCard = (index, field, value) => {
    setForm((prev) => {
      const cards = [...prev.reasonSection.cards];
      cards[index] = { ...cards[index], [field]: value };
      return {
        ...prev,
        reasonSection: { ...prev.reasonSection, cards },
      };
    });
  };

  const addReasonCard = () => {
    setForm((prev) => ({
      ...prev,
      reasonSection: {
        ...prev.reasonSection,
        cards: [...prev.reasonSection.cards, { ...newReasonCard }],
      },
    }));
    setReasonOpenItems((prev) => Array.from(new Set([...prev, 'reason-0'])));
  };

  const removeReasonCard = (index) => {
    setForm((prev) => {
      const cards = prev.reasonSection.cards.filter((_, i) => i !== index);
      return {
        ...prev,
        reasonSection: { ...prev.reasonSection, cards },
      };
    });
    setReasonOpenItems((prev) => shiftOpenItems(prev, index, 'reason'));
  };

  const updateService = (index, field, value) => {
    setForm((prev) => {
      const services = [...prev.servicesSection.services];
      services[index] = { ...services[index], [field]: value };
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      servicesSection: {
        ...prev.servicesSection,
        services: [...prev.servicesSection.services, newService(prev.servicesSection.services.length)],
      },
    }));
    setServiceOpenItems((prev) => Array.from(new Set([...prev, 'service-0'])));
  };

  const removeService = (index) => {
    setForm((prev) => {
      const services = prev.servicesSection.services.filter((_, i) => i !== index);
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
    setServiceOpenItems((prev) => shiftOpenItems(prev, index, 'service'));
  };

  const updateServiceFeature = (serviceIndex, featureIndex, value) => {
    setForm((prev) => {
      const services = [...prev.servicesSection.services];
      const features = [...(services[serviceIndex]?.features || [])];
      features[featureIndex] = value;
      services[serviceIndex] = { ...services[serviceIndex], features };
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
  };

  const addServiceFeature = (serviceIndex) => {
    setForm((prev) => {
      const services = [...prev.servicesSection.services];
      const features = [...(services[serviceIndex]?.features || [])];
      features.push('');
      services[serviceIndex] = { ...services[serviceIndex], features };
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
    // Track which service had the feature added
    setLastServiceIndexWithFeature(serviceIndex);
  };

  const removeServiceFeature = (serviceIndex, featureIndex) => {
    setForm((prev) => {
      const services = [...prev.servicesSection.services];
      const features = (services[serviceIndex]?.features || []).filter((_, i) => i !== featureIndex);
      services[serviceIndex] = { ...services[serviceIndex], features };
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
  };

  const updateTestimonial = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.testimonialsSection.items];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        testimonialsSection: { ...prev.testimonialsSection, items },
      };
    });
  };

  const addTestimonial = () => {
    setForm((prev) => ({
      ...prev,
      testimonialsSection: {
        ...prev.testimonialsSection,
        items: [...prev.testimonialsSection.items, { ...newTestimonial }],
      },
    }));
    setTestimonialOpenItems((prev) => Array.from(new Set([...prev, 'testimonial-0'])));
  };

  const removeTestimonial = (index) => {
    setForm((prev) => {
      const items = prev.testimonialsSection.items.filter((_, i) => i !== index);
      return {
        ...prev,
        testimonialsSection: { ...prev.testimonialsSection, items },
      };
    });
    setTestimonialOpenItems((prev) => shiftOpenItems(prev, index, 'testimonial'));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const res = await homeContentApi.update(form);
      setHomeContent(res.data);
      setMsg('Home content updated ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading home content…</div>;
  }

  const reasonCards = form.reasonSection.cards || [];
  const services = form.servicesSection.services || [];
  const testimonials = form.testimonialsSection.items || [];

  const reasonAccordionKey = reasonCards.length;
  const serviceAccordionKey = services.length;
  const testimonialAccordionKey = testimonials.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Homepage Content</h1>
          <p className="text-sm text-slate-500">Quick edits for hero slides, reason cards, services, and testimonials.</p>
        </div>
        <Button type="submit" form="home-content-form" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {msg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form id="home-content-form" onSubmit={handleSave} className="space-y-4">
        <Tabs defaultValue="slides" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="reason">Reason</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="slides">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Hero Slides</CardTitle>
                  <CardDescription>Manage the hero carousel content and visibility.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/slides/new">Add Slide</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {slideMsg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{slideMsg}</div>}
                {slidesError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{slidesError}</div>}

                {slidesLoading ? (
                  <div className="py-6 text-center text-sm text-slate-500">Loading slides…</div>
                ) : slides.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No slides yet. Add your first slide.</div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {slides.map((slide, i) => (
                      <Card key={slide._id} className="overflow-hidden">
                        <div
                          className="relative h-32 bg-cover bg-center"
                          style={{ backgroundImage: `${slide.gradient}, url('${slide.bgImage}')` }}
                        >
                          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
                            #{slide.order || i + 1}
                          </div>
                          <div className="absolute right-2 top-2">
                            <Badge variant={slide.isActive ? 'success' : 'destructive'}>
                              {slide.isActive ? 'Active' : 'Hidden'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="space-y-2 pt-3">
                          <div className="text-sm font-semibold text-slate-900">
                            {slide.title} {slide.titleHighlight && <span className="text-slate-500">{slide.titleHighlight}</span>}
                          </div>
                          <p className="text-xs text-slate-500">{slide.body.substring(0, 90)}…</p>
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/admin/slides/${slide._id}/edit`}>Edit</Link>
                            </Button>
                            <Button type="button" size="sm" variant="secondary" onClick={() => toggleSlideActive(slide)}>
                              {slide.isActive ? 'Hide' : 'Show'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSlideDelete(slide._id, slide.title)}
                              disabled={deleting === slide._id}
                            >
                              {deleting === slide._id ? 'Deleting…' : 'Delete'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reason" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reason Section Settings</CardTitle>
                <CardDescription>Update headline copy for the "Reason to Choose Us" section.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Eyebrow</Label>
                    <Input value={form.reasonSection.eyebrow} onChange={(e) => handleSectionChange('reasonSection', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Title Highlight</Label>
                    <Input value={form.reasonSection.titleHighlight} onChange={(e) => handleSectionChange('reasonSection', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={form.reasonSection.title} onChange={(e) => handleSectionChange('reasonSection', 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea rows={3} value={form.reasonSection.description} onChange={(e) => handleSectionChange('reasonSection', 'description', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Reason Cards</CardTitle>
                  <CardDescription>Collapse each card to keep the list compact.</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addReasonCard}>Add Card</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {reasonCards.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No cards yet.</div>
                ) : (
                  <Accordion
                    key={reasonAccordionKey}
                    type="multiple"
                    value={reasonOpenItems}
                    onValueChange={setReasonOpenItems}
                    className="space-y-2"
                  >
                    {[...reasonCards].reverse().map((card, i) => {
                      const isNew = i === 0 && lastAddedReasonCardRef.current;
                      const originalIndex = reasonCards.length - 1 - i;
                      return (
                        <AccordionItem key={`reason-${originalIndex}`} value={`reason-${i}`}>
                          <AccordionTrigger>
                            <span className="text-sm">Card {reasonCards.length - i}{card.title ? ` · ${card.title}` : ''}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-3">
                              <input type="hidden" value={card.icon} onChange={(e) => updateReasonCard(originalIndex, 'icon', e.target.value)} />
                              <div className="space-y-1">
                                <Label>Title</Label>
                                <Input
                                  ref={isNew ? lastAddedReasonCardRef : null}
                                  value={card.title}
                                  onChange={(e) => updateReasonCard(originalIndex, 'title', e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label>Description</Label>
                                <Textarea rows={2} value={card.desc} onChange={(e) => updateReasonCard(originalIndex, 'desc', e.target.value)} />
                              </div>
                              <Button type="button" size="sm" variant="destructive" onClick={() => removeReasonCard(originalIndex)}>
                                Remove Card
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
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Services Section Settings</CardTitle>
                <CardDescription>Update the services intro copy shown on the homepage.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Eyebrow</Label>
                    <Input value={form.servicesSection.eyebrow} onChange={(e) => handleSectionChange('servicesSection', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Title Highlight</Label>
                    <Input value={form.servicesSection.titleHighlight} onChange={(e) => handleSectionChange('servicesSection', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={form.servicesSection.title} onChange={(e) => handleSectionChange('servicesSection', 'title', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Service Cards</CardTitle>
                  <CardDescription>Keep services compact with collapsible cards.</CardDescription>
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
                    {[...services].reverse().map((svc, i) => {
                      const isNew = i === 0 && lastAddedServiceRef.current;
                      const originalIndex = services.length - 1 - i;
                      const points = svc.features || [];
                      return (
                        <AccordionItem key={`service-${originalIndex}`} value={`service-${i}`}>
                          <AccordionTrigger>
                            <span className="text-sm">Service {services.length - i}{svc.title ? ` · ${svc.title}` : ''}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-4">
                              <div className="grid gap-3 sm:grid-cols-[90px,1fr,1fr]">
                                <div className="space-y-1">
                                  <Label>ID</Label>
                                  <Input value={svc.id} onChange={(e) => updateService(originalIndex, 'id', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Title</Label>
                                  <Input
                                    ref={isNew ? lastAddedServiceRef : null}
                                    value={svc.title}
                                    onChange={(e) => updateService(originalIndex, 'title', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>Subtitle</Label>
                                  <Input value={svc.subtitle} onChange={(e) => updateService(originalIndex, 'subtitle', e.target.value)} />
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Points</Label>
                                  <Button type="button" size="sm" variant="secondary" onClick={() => addServiceFeature(originalIndex)}>
                                    Add Point
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {points.length === 0 ? (
                                    <div className="text-xs text-slate-500">No points yet.</div>
                                  ) : (
                                    points.map((feat, fIndex) => {
                                      const isLastFeature = fIndex === points.length - 1;
                                      const isLastServiceFeature = isLastFeature && originalIndex === lastServiceIndexWithFeature;
                                      return (
                                        <div key={fIndex} className="flex items-center gap-2">
                                          <Input
                                            ref={isLastServiceFeature ? lastAddedServiceFeatureRef : null}
                                            value={feat}
                                            onChange={(e) => updateServiceFeature(originalIndex, fIndex, e.target.value)}
                                            placeholder="Point"
                                          />
                                          <Button type="button" size="icon" variant="ghost" onClick={() => removeServiceFeature(originalIndex, fIndex)}>
                                            <i className="fa-solid fa-xmark" />
                                          </Button>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>

                              <Button type="button" size="sm" variant="destructive" onClick={() => removeService(originalIndex)}>
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
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Section Settings</CardTitle>
                <CardDescription>Update the testimonials headline and subtext.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Eyebrow</Label>
                    <Input value={form.testimonialsSection.eyebrow} onChange={(e) => handleSectionChange('testimonialsSection', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Title Highlight</Label>
                    <Input value={form.testimonialsSection.titleHighlight} onChange={(e) => handleSectionChange('testimonialsSection', 'titleHighlight', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={form.testimonialsSection.title} onChange={(e) => handleSectionChange('testimonialsSection', 'title', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>Collapsible cards keep the list easy to scan.</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addTestimonial}>Add Testimonial</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {testimonials.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No testimonials yet.</div>
                ) : (
                  <Accordion
                    key={testimonialAccordionKey}
                    type="multiple"
                    value={testimonialOpenItems}
                    onValueChange={setTestimonialOpenItems}
                    className="space-y-2"
                  >
                    {[...testimonials].reverse().map((item, i) => {
                      const isNew = i === 0 && lastAddedTestimonialRef.current;
                      const originalIndex = testimonials.length - 1 - i;
                      return (
                        <AccordionItem key={`testimonial-${originalIndex}`} value={`testimonial-${i}`}>
                          <AccordionTrigger>
                            <span className="text-sm">Testimonial {testimonials.length - i}{item.name ? ` · ${item.name}` : ''}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-3">
                              <input type="hidden" value={item.thumb} onChange={(e) => updateTestimonial(originalIndex, 'thumb', e.target.value)} />
                              <div className="space-y-1">
                                <Label>Quote</Label>
                                <Textarea
                                  ref={isNew ? lastAddedTestimonialRef : null}
                                  rows={3}
                                  value={item.text}
                                  onChange={(e) => updateTestimonial(originalIndex, 'text', e.target.value)}
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <Label>Name</Label>
                                  <Input value={item.name} onChange={(e) => updateTestimonial(originalIndex, 'name', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Role</Label>
                                  <Input value={item.role} onChange={(e) => updateTestimonial(originalIndex, 'role', e.target.value)} />
                                </div>
                              </div>
                              <Button type="button" size="sm" variant="destructive" onClick={() => removeTestimonial(originalIndex)}>
                                Remove Testimonial
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
          </TabsContent>
        </Tabs>
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
