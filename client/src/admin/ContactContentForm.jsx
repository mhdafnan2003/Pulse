import { useEffect, useState } from 'react';
import { contactContentApi } from '../api';
import { useContactContent } from '../context/ContactContentContext';

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
    return <div style={styles.loading}>Loading contact content…</div>;
  }

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Contact Page Content</h1>
          <p style={styles.pageSub}>Edit address, contact details, open hours, and map embed URL.</p>
        </div>
      </div>

      {msg && <div style={styles.toast}>{msg}</div>}
      {error && <div style={styles.errBox}>{error}</div>}

      <form onSubmit={handleSave}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-location-dot" /> Address</h3>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.addressTitle} onChange={(e) => updateField('addressTitle', e.target.value)} />
          </div>
          <div style={styles.listHeader}>
            <h4 style={styles.subHeading}>Address Lines</h4>
            <button type="button" style={styles.smallBtn} onClick={() => addListItem('addressLines')}>+ Add Line</button>
          </div>
          {(form.addressLines || []).map((line, i) => (
            <div key={i} style={styles.listRow}>
              <input style={styles.input} value={line} onChange={(e) => updateListItem('addressLines', i, e.target.value)} />
              <button type="button" style={styles.removeBtn} onClick={() => removeListItem('addressLines', i)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-phone" /> Contact</h3>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.contactTitle} onChange={(e) => updateField('contactTitle', e.target.value)} />
          </div>
          <div style={styles.listHeader}>
            <h4 style={styles.subHeading}>Phone Numbers</h4>
            <button type="button" style={styles.smallBtn} onClick={() => addListItem('phoneNumbers')}>+ Add Phone</button>
          </div>
          {(form.phoneNumbers || []).map((phone, i) => (
            <div key={i} style={styles.listRow}>
              <input style={styles.input} value={phone} onChange={(e) => updateListItem('phoneNumbers', i, e.target.value)} />
              <button type="button" style={styles.removeBtn} onClick={() => removeListItem('phoneNumbers', i)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <div style={styles.listHeader}>
              <h4 style={styles.subHeading}>Emails</h4>
              <button type="button" style={styles.smallBtn} onClick={() => addListItem('emails')}>+ Add Email</button>
            </div>
            {(form.emails || []).map((email, i) => (
              <div key={i} style={styles.listRow}>
                <input style={styles.input} value={email} onChange={(e) => updateListItem('emails', i, e.target.value)} />
                <button type="button" style={styles.removeBtn} onClick={() => removeListItem('emails', i)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-regular fa-clock" /> Open Hours</h3>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.openHoursTitle} onChange={(e) => updateField('openHoursTitle', e.target.value)} />
          </div>
          <div style={styles.listHeader}>
            <h4 style={styles.subHeading}>Hours Lines</h4>
            <button type="button" style={styles.smallBtn} onClick={() => addListItem('openHoursLines')}>+ Add Line</button>
          </div>
          {(form.openHoursLines || []).map((line, i) => (
            <div key={i} style={styles.listRow}>
              <input style={styles.input} value={line} onChange={(e) => updateListItem('openHoursLines', i, e.target.value)} />
              <button type="button" style={styles.removeBtn} onClick={() => removeListItem('openHoursLines', i)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-map" /> Map Embed</h3>
          <div style={styles.field}>
            <label style={styles.label}>Google Maps Embed URL</label>
            <input style={styles.input} value={form.mapEmbedUrl} onChange={(e) => updateField('mapEmbedUrl', e.target.value)} />
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
  toast: { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  errBox: { background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  section: { background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, border: '1px solid #E2E8F0' },
  sectionTitle: { margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 },
  field: { marginBottom: 12 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111' },
  listHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  subHeading: { margin: 0, fontSize: 13, fontWeight: 700, color: '#475569' },
  smallBtn: { padding: '6px 12px', background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  listRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', marginBottom: 8 },
  removeBtn: { padding: '6px 10px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  saveBtn: { padding: '12px 28px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};
