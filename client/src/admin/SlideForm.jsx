import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slidesApi, uploadApi } from '../api';

const defaultForm = {
  title: '',
  titleHighlight: '',
  body: '',
  bgImage: '',
  gradient: 'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)',
  whatsappLink: 'https://wa.me/447956273533',
  order: 1,
  isActive: true,
};

export default function SlideForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      slidesApi.getAll().then((res) => {
        const slide = res.data.find((s) => s._id === id);
        if (slide) {
          setForm({ ...defaultForm, ...slide });
          setPreviewUrl(slide.bgImage);
        }
      }).catch(() => setError('Could not load slide data'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadApi.uploadImage(file);
      setForm((f) => ({ ...f, bgImage: res.data.url }));
      setPreviewUrl(res.data.url);
    } catch (err) {
      setError('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bgImage) { setError('Please upload or enter a background image URL'); return; }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await slidesApi.update(id, form);
      } else {
        await slidesApi.create(form);
      }
      navigate('/admin/slides');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>{isEdit ? 'Edit Slide' : 'Add New Slide'}</h1>
          <p style={styles.pageSub}>Fill in the details for the hero banner slide.</p>
        </div>
      </div>

      {error && <div style={styles.errBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Background Image */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-image" /> Background Image</h3>
          <div style={styles.uploadArea} onClick={() => fileRef.current?.click()}>
            {previewUrl ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                <div style={styles.uploadOverlay}>Click to change</div>
              </div>
            ) : (
              <div style={styles.uploadPlaceholder}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: '#94A3B8', marginBottom: 8 }} />
                <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>Click to upload image</p>
                <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: 12 }}>JPG, PNG, WebP up to 10MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          {uploading && <p style={{ color: '#3B82F6', fontSize: 13, marginTop: 8 }}>Uploading image…</p>}

        </div>

        {/* Content */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><i className="fa-solid fa-align-left" /> Slide Content</h3>
          <div style={styles.field}>
            <label style={styles.label}>Main Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input style={styles.input} name="title" value={form.title} onChange={handleChange} placeholder="UK & International Visa Consultancy" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Title Highlight (shown in colour)</label>
            <input style={styles.input} name="titleHighlight" value={form.titleHighlight} onChange={handleChange} placeholder="You Can Trust" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Body Text <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea style={styles.textarea} name="body" value={form.body} onChange={handleChange} rows={4} placeholder="Describe this slide…" required />
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><i className="fa-solid fa-eye" /> Live Preview</h3>
            <div style={{
              backgroundImage: `${form.gradient}, url('${previewUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 12,
              padding: '80px 48px 60px',
              minHeight: 280,
              position: 'relative',
            }}>
              <h2 style={{ color: '#fff', fontSize: 60, fontWeight: 500, margin: '0 0 20px', lineHeight: '110%', letterSpacing: '-2px', maxWidth: 660 }}>
                {form.title}{' '}
                {form.titleHighlight && (
                  <span style={{ color: '#fff' }}>{form.titleHighlight}</span>
                )}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, maxWidth: 540, lineHeight: 1.7, margin: '0 0 28px', fontWeight: 400 }}>
                {form.body}
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span style={styles.previewBtn}>
                  <i className="fa-brands fa-whatsapp" style={{ marginRight: 8 }} />WhatsApp Us
                </span>
                <span style={styles.previewBtn}>
                  <i className="fa-solid fa-calendar-check" style={{ marginRight: 8 }} />Book Consultation
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={styles.saveBtn} disabled={saving || uploading}>
            {saving ? 'Saving…' : isEdit ? 'Update Slide' : 'Create Slide'}
          </button>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate('/admin/slides')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: 28 },
  pageTitle: { margin: 0, fontSize: 26, fontWeight: 700, color: '#0F172A' },
  pageSub: { margin: '4px 0 0', color: '#64748B', fontSize: 14 },
  errBox: { background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 0 },
  section: { background: '#fff', borderRadius: 12, padding: '24px 28px', marginBottom: 20, border: '1px solid #E2E8F0' },
  sectionTitle: { margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 },
  field: { marginBottom: 14 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111' },
  textarea: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111', resize: 'vertical' },
  uploadArea: { border: '2px dashed #CBD5E1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 },
  uploadOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 8 },
  saveBtn: { padding: '12px 28px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  cancelBtn: { padding: '12px 24px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' },
  previewBtn: { display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: '#3B82F6', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 600, gap: 8 },
};
