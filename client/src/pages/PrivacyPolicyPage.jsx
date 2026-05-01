import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/three.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">Privacy Policy</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><Link to="/"><i className="fa-solid fa-house"></i> Home</Link></li>
              <li>/</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="about-section section-padding fix">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="about-content">
                <div className="section-title mb-4">
                  <h6 className="sub-title wow fadeInUp">
                    <img src="/assets/img/home-1/star.svg" alt="img" /> YOUR PRIVACY MATTERS
                  </h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">Privacy Policy</h2>
                </div>

                <div className="privacy-content">
                  <p className="wow fadeInUp" data-wow-delay=".4s" style={{ lineHeight: 1.8, marginBottom: 30 }}>
                    Pulse Creative & Consulting Ltd is committed to protecting your privacy.
                    This policy explains how we collect, use, and safeguard your personal information.
                  </p>

                  {/* Information We Collect */}
                  <div className="privacy-section wow fadeInUp" data-wow-delay=".5s" style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: 'var(--theme)' }}>
                      Information We Collect
                    </h3>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {['Name, email address, phone number',
                        'Visa-related details shared voluntarily',
                        'Information submitted via contact forms, WhatsApp, email, or phone'].map((item, i) => (
                        <li key={i} style={{ paddingLeft: 30, position: 'relative', marginBottom: 15, lineHeight: 1.8 }}>
                          <i className="fa-solid fa-circle-check" style={{ position: 'absolute', left: 0, top: 5, color: 'var(--theme)' }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How We Use Your Information */}
                  <div className="privacy-section wow fadeInUp" data-wow-delay=".6s" style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: 'var(--theme)' }}>
                      How We Use Your Information
                    </h3>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {['To assess eligibility and provide visa or career guidance',
                        'To communicate regarding enquiries or services',
                        'To comply with legal and regulatory obligations'].map((item, i) => (
                        <li key={i} style={{ paddingLeft: 30, position: 'relative', marginBottom: 15, lineHeight: 1.8 }}>
                          <i className="fa-solid fa-circle-check" style={{ position: 'absolute', left: 0, top: 5, color: 'var(--theme)' }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Data Protection */}
                  <div className="privacy-section wow fadeInUp" data-wow-delay=".7s" style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: 'var(--theme)' }}>
                      Data Protection
                    </h3>
                    <p style={{ lineHeight: 1.8, marginBottom: 15 }}>
                      We do not sell or share your data with third parties without consent, except where required by law.
                      All data is handled securely in line with UK GDPR regulations.
                    </p>
                  </div>

                  {/* Your Rights */}
                  <div className="privacy-section wow fadeInUp" data-wow-delay=".8s" style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: 'var(--theme)' }}>
                      Your Rights
                    </h3>
                    <p style={{ lineHeight: 1.8, marginBottom: 15 }}>
                      You may request access, correction, or deletion of your personal data at any time.
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="privacy-section wow fadeInUp" data-wow-delay=".9s" style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: 'var(--theme)' }}>
                      Contact Us
                    </h3>
                    <p style={{ lineHeight: 1.8, marginBottom: 15 }}>
                      For any questions or concerns regarding your privacy, please contact us at:
                    </p>
                    <p style={{ lineHeight: 1.8, marginBottom: 15 }}>
                      <i className="fa-solid fa-envelope" style={{ color: 'var(--theme)', marginRight: 10 }}></i>
                      <a href="mailto:info@pulsecc.co.uk" style={{ color: 'var(--theme)', fontWeight: 600 }}>
                        info@pulsecc.co.uk
                      </a>
                    </p>
                  </div>

                  <div className="text-center wow fadeInUp" data-wow-delay="1s" style={{ marginTop: 50 }}>
                    <Link to="/contact" className="theme-btn">
                      <div className="btn_inner">
                        <div className="btn_icon">
                          <span>
                            <i className="fa-solid fa-arrow-up-right"></i>
                            <i className="fa-solid fa-arrow-up-right"></i>
                          </span>
                        </div>
                        <div className="btn_text"><span>Contact Us</span></div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
