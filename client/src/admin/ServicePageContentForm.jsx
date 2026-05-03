import { useEffect, useState, useRef } from 'react';
import { serviceContentApi } from '../api';
import { useServiceContent } from '../context/ServiceContentContext';

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
    focusNewServiceRef.current = true;
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, newService(prev.services.length)],
    }));
  };

  const removeService = (index) => {
    setForm((prev) => {
      const services = prev.services.filter((_, i) => i !== index);
      return { ...prev, services };
    });
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
    return <div style={styles.loading}>Loading service page content…</div>;
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Service Page Content</h1>
          <p style={styles.pageSub}>Edit the service cards (title, subtitle, and points).</p>
        </div>
      </div>

      {msg && <div style={styles.toast}>{msg}</div>}
      {error && <div style={styles.errBox}>{error}</div>}

      <form onSubmit={handleSave}>
        <div style={styles.section}>
          <div style={styles.inlineHeader}>
            <h3 style={styles.sectionTitle}><i className="fa-solid fa-briefcase" /> Service Cards</h3>
            <button type="button" style={styles.smallBtn} onClick={addService}>+ Add Service</button>
          </div>

          {form.services.map((svc, i) => {
            const isLastAdded = i === form.services.length - 1;
            return (
            <div key={i} style={styles.cardRow}>
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
                  return (
                  <div key={fIndex} style={styles.featureRow}>
                    <input
                      ref={isLastFeature ? lastAddedServiceFeatureRef : null}
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
  toast: { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  errBox: { background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  section: { background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, border: '1px solid #E2E8F0' },
  sectionTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 },
  field: { marginBottom: 12 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111' },
  cardRow: { border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 14, background: '#F8FAFC' },
  inlineHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  subHeading: { margin: 0, fontSize: 13, fontWeight: 700, color: '#475569' },
  smallBtn: { padding: '6px 12px', background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  removeBtn: { marginTop: 10, padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  featureRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', marginBottom: 8 },
  saveBtn: { padding: '12px 28px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};
