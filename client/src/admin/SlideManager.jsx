import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSlides } from '../context/SlidesContext';
import { slidesApi } from '../api';

export default function SlideManager() {
  const { slides, loading, error, fetchSlides } = useSlides();
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchSlides(true);
  }, [fetchSlides]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete slide "${title}"?`)) return;
    setDeleting(id);
    try {
      await slidesApi.remove(id);
      setMsg('Slide deleted ✓');
      fetchSlides(true);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (slide) => {
    try {
      await slidesApi.update(slide._id, { isActive: !slide.isActive });
      fetchSlides(true);
    } catch (err) { /* ignore */ }
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Hero Slides</h1>
          <p style={styles.pageSub}>Manage the rotating hero banner slides on the homepage.</p>
        </div>
        <Link to="/admin/slides/new" style={styles.addBtn}>
          <i className="fa-solid fa-plus" /> Add Slide
        </Link>
      </div>

      {msg && <div style={styles.toast}>{msg}</div>}
      {error && <div style={styles.errBox}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading slides…</div>
      ) : slides.length === 0 ? (
        <div style={styles.empty}>No slides yet. <Link to="/admin/slides/new">Add one →</Link></div>
      ) : (
        <div style={styles.grid}>
          {slides.map((slide, i) => (
            <div key={slide._id} style={styles.card}>
              <div
                style={{
                  ...styles.cardBg,
                  backgroundImage: `${slide.gradient}, url('${slide.bgImage}')`,
                }}
              >
                <span style={styles.orderBadge}>#{slide.order || i + 1}</span>
                <span style={{ ...styles.activeBadge, background: slide.isActive ? '#22C55E' : '#EF4444' }}>
                  {slide.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{slide.title} {slide.titleHighlight && <span style={{ color: '#3B82F6' }}>{slide.titleHighlight}</span>}</h3>
                <p style={styles.cardText}>{slide.body.substring(0, 100)}…</p>
                <div style={styles.cardActions}>
                  <Link to={`/admin/slides/${slide._id}/edit`} style={styles.editBtn}>
                    <i className="fa-solid fa-pen" /> Edit
                  </Link>
                  <button onClick={() => toggleActive(slide)} style={styles.toggleBtn}>
                    <i className={`fa-solid fa-${slide.isActive ? 'eye-slash' : 'eye'}`} />
                    {slide.isActive ? ' Hide' : ' Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id, slide.title)}
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
  );
}

const styles = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { margin: 0, fontSize: 26, fontWeight: 700, color: '#0F172A' },
  pageSub: { margin: '4px 0 0', color: '#64748B', fontSize: 14 },
  addBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#3B82F6', color: '#fff', padding: '10px 20px',
    borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14,
  },
  toast: { background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  errBox: { background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14 },
  loading: { textAlign: 'center', padding: 60, color: '#64748B' },
  empty: { textAlign: 'center', padding: 60, color: '#64748B' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #E2E8F0' },
  cardBg: { height: 180, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  orderBadge: { position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700 },
  activeBadge: { position: 'absolute', top: 12, right: 12, color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700 },
  cardBody: { padding: '16px 20px 20px' },
  cardTitle: { margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0F172A' },
  cardText: { margin: '0 0 16px', fontSize: 13, color: '#64748B', lineHeight: 1.5 },
  cardActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  editBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  toggleBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#FFF7ED', color: '#D97706', border: '1px solid #FDE68A', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  delBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
