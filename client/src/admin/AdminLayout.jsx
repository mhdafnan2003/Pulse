import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <i className="fa-solid fa-shield-halved" style={{ color: '#3B82F6', fontSize: 22 }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginLeft: 10 }}>Pulse Admin</span>
        </div>

        <nav style={{ marginTop: 32 }}>
          <SideLink to="/admin/home-content" label="Homepage Content" icon="fa-solid fa-pen-to-square" active={isActive('/admin/home-content')} />
          <SideLink to="/admin/service-content" label="Service Page Content" icon="fa-solid fa-list-check" active={isActive('/admin/service-content')} />
          <SideLink to="/admin/contact-content" label="Contact Page Content" icon="fa-solid fa-address-book" active={isActive('/admin/contact-content')} />
          <SideLink to="/admin/about-content" label="About Page Content" icon="fa-solid fa-circle-info" active={isActive('/admin/about-content')} />
          <SideLink to="/admin/apply-now-content" label="Apply Now Content" icon="fa-solid fa-clipboard-check" active={isActive('/admin/apply-now-content')} />
          <SideLink to="/admin/applications" label="Applications" icon="fa-solid fa-file-lines" active={isActive('/admin/applications')} />
          <div style={{ borderTop: '1px solid #1E3A5F', margin: '24px 0' }} />
          <a href="/" target="_blank" style={styles.sidelink}>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ width: 20 }} />
            <span>View Site</span>
          </a>
        </nav>

        <button onClick={logout} style={styles.logoutBtn}>
          <i className="fa-solid fa-right-from-bracket" />
          <span style={{ marginLeft: 8 }}>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

function SideLink({ to, label, icon, active }) {
  return (
    <Link to={to} style={{ ...styles.sidelink, background: active ? 'rgba(59,130,246,0.15)' : 'transparent', color: active ? '#60A5FA' : '#94A3B8' }}>
      <i className={icon} style={{ width: 20 }} />
      <span>{label}</span>
    </Link>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  sidebar: {
    width: 240, background: '#071121', padding: '24px 16px',
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
  },
  brand: { display: 'flex', alignItems: 'center', padding: '8px 12px' },
  sidelink: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 12px', borderRadius: 8, marginBottom: 4,
    color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
  },
  main: { marginLeft: 240, flex: 1, background: '#F8FAFC', minHeight: '100vh', padding: '32px' },
  logoutBtn: {
    marginTop: 'auto', display: 'flex', alignItems: 'center',
    padding: '10px 12px', background: 'none', border: 'none',
    color: '#F87171', cursor: 'pointer', fontSize: 14, fontWeight: 500,
  },
};
