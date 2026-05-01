import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SlidesProvider } from './context/SlidesContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import SlideManager from './admin/SlideManager';
import SlideForm from './admin/SlideForm';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ContactModal from './components/ContactModal';
import SiteChrome from './components/SiteChrome';
import AboutPage from './pages/AboutPage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import ScrollToTop from './components/ScrollToTop';

function PublicLayout({ children }) {
  return (
    <div className="page-wrapper">
      <SiteChrome />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
          <Footer />
          <FloatingWhatsApp />
          <ContactModal />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SlidesProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/service" element={<PublicLayout><ServicePage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
          <Route path="/terms-conditions" element={<PublicLayout><TermsConditionsPage /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/slides" replace />} />
            <Route path="slides" element={<SlideManager />} />
            <Route path="slides/new" element={<SlideForm />} />
            <Route path="slides/:id/edit" element={<SlideForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SlidesProvider>
  );
}
