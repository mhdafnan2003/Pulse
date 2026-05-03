import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { homeContentApi, slidesApi } from '../api';
import { useHomeContent } from '../context/HomeContentContext';
import { useSlides } from '../context/SlidesContext';

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
  const [showMoreReasonCards, setShowMoreReasonCards] = useState(false);
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [showMoreTestimonials, setShowMoreTestimonials] = useState(false);
  const [lastServiceIndexWithFeature, setLastServiceIndexWithFeature] = useState(null);
  const { setHomeContent } = useHomeContent();
  const { slides, loading: slidesLoading, error: slidesError, fetchSlides } = useSlides();
  
  // Refs for auto-focus
  const lastAddedReasonCardRef = useRef(null);
  const lastAddedServiceRef = useRef(null);
  const lastAddedTestimonialRef = useRef(null);
  const lastAddedFeatureRef = useRef(null);
  const reasonCardContainerRef = useRef(null);
  const serviceContainerRef = useRef(null);
  const testimonialContainerRef = useRef(null);
  const featureContainerRef = useRef(null);
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
    console.log('Service useEffect triggered, ref exists:', !!lastAddedServiceRef.current);
    if (lastAddedServiceRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedServiceRef.current) {
          console.log('Scrolling to service Title field');
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
    // Auto-expand to show the new card
    setShowMoreReasonCards(true);
  };

  const removeReasonCard = (index) => {
    setForm((prev) => {
      const cards = prev.reasonSection.cards.filter((_, i) => i !== index);
      return {
        ...prev,
        reasonSection: { ...prev.reasonSection, cards },
      };
    });
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
    // Auto-expand to show the new service
    setShowMoreServices(true);
  };

  const removeService = (index) => {
    setForm((prev) => {
      const services = prev.servicesSection.services.filter((_, i) => i !== index);
      return {
        ...prev,
        servicesSection: { ...prev.servicesSection, services },
      };
    });
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
    // Auto-expand to show the new testimonial
    setShowMoreTestimonials(true);
  };

  const removeTestimonial = (index) => {
    setForm((prev) => {
      const items = prev.testimonialsSection.items.filter((_, i) => i !== index);
      return {
        ...prev,
        testimonialsSection: { ...prev.testimonialsSection, items },
      };
    });
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
    return <div style={styles.loading}>Loading home content…</div>;
  }

  const reasonCards = form.reasonSection.cards || [];
  const services = form.servicesSection.services || [];
  const testimonials = form.testimonialsSection.items || [];

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Homepage Content</h1>
          <p style={styles.pageSub}>Edit the “Reason to Choose Us” and “Services” sections.</p>
        </div>
      </div>

      {msg && <div style={styles.toast}>{msg}</div>}
      {error && <div style={styles.errBox}>{error}</div>}

      <form onSubmit={handleSave}>
        {/* Hero Slides Section */}
        <div style={styles.section}>
          <div style={styles.inlineHeader}>
            <h3 style={styles.sectionTitle}><i className="fa-solid fa-images" /> Hero Slides</h3>
            <Link to="/admin/slides/new" style={styles.smallBtn}>
              <i className="fa-solid fa-plus" /> Add Slide
            </Link>
          </div>

          {slideMsg && <div style={styles.toast}>{slideMsg}</div>}
          {slidesError && <div style={styles.errBox}>{slidesError}</div>}

          {slidesLoading ? (
            <div style={styles.loading}>Loading slides…</div>
          ) : slides.length === 0 ? (
            <div style={styles.empty}>No slides yet. <Link to="/admin/slides/new">Add one →</Link></div>
          ) : (
            <div style={styles.slideGrid}>
              {slides.map((slide, i) => (
                <div key={slide._id} style={styles.slideCard}>
                  <div
                    style={{
                      ...styles.slideBg,
                      backgroundImage: `${slide.gradient}, url('${slide.bgImage}')`,
                    }}
                  >
                    <span style={styles.orderBadge}>#{slide.order || i + 1}</span>
                    <span style={{ ...styles.activeBadge, background: slide.isActive ? '#22C55E' : '#EF4444' }}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={styles.slideBody}>
                    <h4 style={styles.slideTitle}>
                      {slide.title} {slide.titleHighlight && <span style={{ color: '#3B82F6' }}>{slide.titleHighlight}</span>}
                    </h4>
                    <p style={styles.slideText}>{slide.body.substring(0, 90)}…</p>
                    <div style={styles.slideActions}>
                      <Link to={`/admin/slides/${slide._id}/edit`} style={styles.editBtn}>
                        <i className="fa-solid fa-pen" /> Edit
                      </Link>
                      <button type="button" onClick={() => toggleSlideActive(slide)} style={styles.toggleBtn}>
                        <i className={`fa-solid fa-${slide.isActive ? 'eye-slash' : 'eye'}`} />
                        {slide.isActive ? ' Hide' : ' Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSlideDelete(slide._id, slide.title)}
                        style={styles.delBtn}
                        disabled={deleting === slide._id}
                      >
                        <i className="fa-solid fa-trash" /> {deleting === slide._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reason Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-award" /> Reason to Choose Us</h3>

          <div style={styles.field}>
            <label style={styles.label}>Eyebrow</label>
            <input style={styles.input} value={form.reasonSection.eyebrow} onChange={(e) => handleSectionChange('reasonSection', 'eyebrow', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} value={form.reasonSection.title} onChange={(e) => handleSectionChange('reasonSection', 'title', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Title Highlight</label>
              <input style={styles.input} value={form.reasonSection.titleHighlight} onChange={(e) => handleSectionChange('reasonSection', 'titleHighlight', e.target.value)} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} rows={3} value={form.reasonSection.description} onChange={(e) => handleSectionChange('reasonSection', 'description', e.target.value)} />
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={styles.inlineHeader}>
              <h4 style={styles.subHeading}>Cards</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {reasonCards.length > 1 && (
                  <button
                    type="button"
                    style={styles.smallBtn}
                    onClick={() => setShowMoreReasonCards((prev) => !prev)}
                  >
                    {showMoreReasonCards ? 'Hide extra cards' : `View more cards (${reasonCards.length - 1})`}
                  </button>
                )}
                <button type="button" style={styles.smallBtn} onClick={addReasonCard}>+ Add Card</button>
              </div>
            </div>
            {reasonCards.length === 0 ? (
              <div style={styles.empty}>No cards yet. Add your first card.</div>
            ) : (
              <>
                {[reasonCards[0]].map((card, i) => (
                  <div key={`reason-card-${i}`} style={styles.cardRow}>
                    <input type="hidden" value={card.icon} onChange={(e) => updateReasonCard(i, 'icon', e.target.value)} />
                    <div style={styles.field}>
                      <label style={styles.label}>Title</label>
                      <input 
                        ref={reasonCards.length === 1 ? lastAddedReasonCardRef : null}
                        style={styles.input} 
                        value={card.title} 
                        onChange={(e) => updateReasonCard(i, 'title', e.target.value)} 
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Description</label>
                      <textarea style={styles.textarea} rows={2} value={card.desc} onChange={(e) => updateReasonCard(i, 'desc', e.target.value)} />
                    </div>
                    <button type="button" style={styles.removeBtn} onClick={() => removeReasonCard(i)}>
                      <i className="fa-solid fa-trash" /> Remove
                    </button>
                  </div>
                ))}
                {showMoreReasonCards && reasonCards.slice(1).map((card, i) => {
                  const index = i + 1;
                  const isLastAdded = index === reasonCards.length - 1;
                  return (
                    <div key={`reason-card-${index}`} style={styles.cardRow}>
                      <input type="hidden" value={card.icon} onChange={(e) => updateReasonCard(index, 'icon', e.target.value)} />
                      <div style={styles.field}>
                        <label style={styles.label}>Title</label>
                        <input 
                          ref={isLastAdded ? lastAddedReasonCardRef : null}
                          style={styles.input} 
                          value={card.title} 
                          onChange={(e) => updateReasonCard(index, 'title', e.target.value)} 
                        />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea style={styles.textarea} rows={2} value={card.desc} onChange={(e) => updateReasonCard(index, 'desc', e.target.value)} />
                      </div>
                      <button type="button" style={styles.removeBtn} onClick={() => removeReasonCard(index)}>
                        <i className="fa-solid fa-trash" /> Remove
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-briefcase" /> Services Section</h3>

          <div style={styles.field}>
            <label style={styles.label}>Eyebrow</label>
            <input style={styles.input} value={form.servicesSection.eyebrow} onChange={(e) => handleSectionChange('servicesSection', 'eyebrow', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} value={form.servicesSection.title} onChange={(e) => handleSectionChange('servicesSection', 'title', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Title Highlight</label>
              <input style={styles.input} value={form.servicesSection.titleHighlight} onChange={(e) => handleSectionChange('servicesSection', 'titleHighlight', e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={styles.inlineHeader}>
              <h4 style={styles.subHeading}>Service Cards</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {services.length > 1 && (
                  <button
                    type="button"
                    style={styles.smallBtn}
                    onClick={() => setShowMoreServices((prev) => !prev)}
                  >
                    {showMoreServices ? 'Hide extra services' : `View more services (${services.length - 1})`}
                  </button>
                )}
                <button type="button" style={styles.smallBtn} onClick={addService}>+ Add Service</button>
              </div>
            </div>
            {services.length === 0 ? (
              <div style={styles.empty}>No services yet. Add your first service.</div>
            ) : (
              <>
                {[services[0]].map((svc, i) => {
                  const isLastAdded = services.length === 1;
                  return (
                  <div key={`service-card-${i}`} style={styles.cardRow}>
                    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 12 }}>
                      <div style={styles.field}>
                        <label style={styles.label}>ID</label>
                        <input style={styles.input} value={svc.id} onChange={(e) => updateService(i, 'id', e.target.value)} />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Title</label>
                        <input 
                          ref={isLastAdded ? lastAddedServiceRef : null}
                          style={styles.input} 
                          value={svc.title} 
                          onChange={(e) => updateService(i, 'title', e.target.value)} 
                        />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Subtitle</label>
                        <input style={styles.input} value={svc.subtitle} onChange={(e) => updateService(i, 'subtitle', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <div style={styles.inlineHeader}>
                        <h5 style={styles.subHeading}>Points</h5>
                        <button type="button" style={styles.smallBtn} onClick={() => addServiceFeature(i)}>+ Add Point</button>
                      </div>
                      {(svc.features || []).map((feat, fIndex) => {
                        const isLastFeature = fIndex === (svc.features || []).length - 1;
                        const isLastServiceFeature = isLastFeature && i === lastServiceIndexWithFeature;
                        return (
                        <div key={fIndex} style={styles.featureRow}>
                          <input
                            ref={isLastServiceFeature ? lastAddedServiceFeatureRef : null}
                            style={styles.input}
                            value={feat}
                            onChange={(e) => updateServiceFeature(i, fIndex, e.target.value)}
                            placeholder="Feature"
                          />
                          <button type="button" style={styles.removeBtn} onClick={() => removeServiceFeature(i, fIndex)}>
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                        );
                      })}
                    </div>

                    <button type="button" style={styles.removeBtn} onClick={() => removeService(i)}>
                      <i className="fa-solid fa-trash" /> Remove Service
                    </button>
                  </div>
                  );
                })}
                {showMoreServices && services.slice(1).map((svc, i) => {
                  const index = i + 1;
                  const isLastAdded = index === services.length - 1;
                  return (
                    <div key={`service-card-${index}`} style={styles.cardRow}>
                      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 12 }}>
                        <div style={styles.field}>
                          <label style={styles.label}>ID</label>
                          <input style={styles.input} value={svc.id} onChange={(e) => updateService(index, 'id', e.target.value)} />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Title</label>
                          <input 
                            ref={isLastAdded ? lastAddedServiceRef : null}
                            style={styles.input} 
                            value={svc.title} 
                            onChange={(e) => updateService(index, 'title', e.target.value)} 
                          />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Subtitle</label>
                          <input style={styles.input} value={svc.subtitle} onChange={(e) => updateService(index, 'subtitle', e.target.value)} />
                        </div>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <div style={styles.inlineHeader}>
                          <h5 style={styles.subHeading}>Points</h5>
                          <button type="button" style={styles.smallBtn} onClick={() => addServiceFeature(index)}>+ Add Point</button>
                        </div>
                        {(svc.features || []).map((feat, fIndex) => (
                          <div key={fIndex} style={styles.featureRow}>
                            <input
                              style={styles.input}
                              value={feat}
                              onChange={(e) => updateServiceFeature(index, fIndex, e.target.value)}
                              placeholder="Feature"
                            />
                            <button type="button" style={styles.removeBtn} onClick={() => removeServiceFeature(index, fIndex)}>
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button type="button" style={styles.removeBtn} onClick={() => removeService(index)}>
                        <i className="fa-solid fa-trash" /> Remove Service
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Testimonials Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-comments" /> Testimonials Section</h3>

          <div style={styles.field}>
            <label style={styles.label}>Eyebrow</label>
            <input style={styles.input} value={form.testimonialsSection.eyebrow} onChange={(e) => handleSectionChange('testimonialsSection', 'eyebrow', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} value={form.testimonialsSection.title} onChange={(e) => handleSectionChange('testimonialsSection', 'title', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Title Highlight</label>
              <input style={styles.input} value={form.testimonialsSection.titleHighlight} onChange={(e) => handleSectionChange('testimonialsSection', 'titleHighlight', e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={styles.inlineHeader}>
              <h4 style={styles.subHeading}>Testimonials</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {testimonials.length > 1 && (
                  <button
                    type="button"
                    style={styles.smallBtn}
                    onClick={() => setShowMoreTestimonials((prev) => !prev)}
                  >
                    {showMoreTestimonials ? 'Hide extra testimonials' : `View more testimonials (${testimonials.length - 1})`}
                  </button>
                )}
                <button type="button" style={styles.smallBtn} onClick={addTestimonial}>+ Add Testimonial</button>
              </div>
            </div>
            {testimonials.length === 0 ? (
              <div style={styles.empty}>No testimonials yet. Add your first one.</div>
            ) : (
              <>
                {[testimonials[0]].map((item, i) => {
                  const isLastAdded = testimonials.length === 1;
                  return (
                  <div key={`testimonial-${i}`} style={styles.cardRow}>
                    <div style={styles.field}>
                      <label style={styles.label}>Quote</label>
                      <textarea 
                        ref={isLastAdded ? lastAddedTestimonialRef : null}
                        style={styles.textarea} 
                        rows={3} 
                        value={item.text} 
                        onChange={(e) => updateTestimonial(i, 'text', e.target.value)} 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={styles.field}>
                        <label style={styles.label}>Name</label>
                        <input style={styles.input} value={item.name} onChange={(e) => updateTestimonial(i, 'name', e.target.value)} />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Role</label>
                        <input style={styles.input} value={item.role} onChange={(e) => updateTestimonial(i, 'role', e.target.value)} />
                      </div>
                    </div>
                    <input type="hidden" value={item.thumb} onChange={(e) => updateTestimonial(i, 'thumb', e.target.value)} />
                    <button type="button" style={styles.removeBtn} onClick={() => removeTestimonial(i)}>
                      <i className="fa-solid fa-trash" /> Remove
                    </button>
                  </div>
                  );
                })}
                {showMoreTestimonials && testimonials.slice(1).map((item, i) => {
                  const index = i + 1;
                  const isLastAdded = index === testimonials.length - 1;
                  return (
                    <div key={`testimonial-${index}`} style={styles.cardRow}>
                      <div style={styles.field}>
                        <label style={styles.label}>Quote</label>
                        <textarea 
                          ref={isLastAdded ? lastAddedTestimonialRef : null}
                          style={styles.textarea} 
                          rows={3} 
                          value={item.text} 
                          onChange={(e) => updateTestimonial(index, 'text', e.target.value)} 
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={styles.field}>
                          <label style={styles.label}>Name</label>
                          <input style={styles.input} value={item.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Role</label>
                          <input style={styles.input} value={item.role} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} />
                        </div>
                      </div>
                      <input type="hidden" value={item.thumb} onChange={(e) => updateTestimonial(index, 'thumb', e.target.value)} />
                      <button type="button" style={styles.removeBtn} onClick={() => removeTestimonial(index)}>
                        <i className="fa-solid fa-trash" /> Remove
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: 24 },
  pageTitle: { margin: 0, fontSize: 26, fontWeight: 700, color: '#0F172A' },
  pageSub: { margin: '4px 0 0', color: '#64748B', fontSize: 14 },
  loading: { textAlign: 'center', padding: 60, color: '#64748B' },
  empty: { textAlign: 'center', padding: 40, color: '#64748B' },
  toast: { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  errBox: { background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  section: { background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, border: '1px solid #E2E8F0' },
  sectionTitle: { margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 },
  field: { marginBottom: 12 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111' },
  textarea: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111', resize: 'vertical' },
  cardRow: { border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 14, background: '#F8FAFC' },
  inlineHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  subHeading: { margin: 0, fontSize: 13, fontWeight: 700, color: '#475569' },
  smallBtn: { padding: '6px 12px', background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 },
  removeBtn: { marginTop: 10, padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  featureRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', marginBottom: 8 },
  saveBtn: { padding: '12px 28px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  slideGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  slideCard: { background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  slideBg: { height: 140, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  slideBody: { padding: '14px 16px 16px' },
  slideTitle: { margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#0F172A' },
  slideText: { margin: '0 0 12px', fontSize: 12, color: '#64748B', lineHeight: 1.5 },
  slideActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  editBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none' },
  toggleBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#FFF7ED', color: '#D97706', border: '1px solid #FDE68A', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  delBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  orderBadge: { position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700 },
  activeBadge: { position: 'absolute', top: 10, right: 10, color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700 },
};
