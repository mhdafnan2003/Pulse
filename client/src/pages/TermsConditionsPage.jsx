import { Link } from 'react-router-dom';

export default function TermsConditionsPage() {
  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/three.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">Terms &amp; Conditions</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><Link to="/"><i className="fa-solid fa-house"></i> Home</Link></li>
              <li>/</li>
              <li>Terms &amp; Conditions</li>
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
                    <img src="/assets/img/home-1/star.svg" alt="img" /> LEGAL AGREEMENT
                  </h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">Terms &amp; Conditions</h2>
                </div>

                <div className="privacy-content">
                  <p className="wow fadeInUp" data-wow-delay=".4s" style={{ lineHeight: 1.8, marginBottom: 30 }}>
                    Pulse Creative & Consulting Ltd provides guidance and consultancy services only.
                    We do not guarantee visa approvals, as decisions are made solely by immigration authorities.
                  </p>

                  <div className="privacy-section wow fadeInUp" data-wow-delay=".5s" style={{ marginBottom: 40 }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {[
                        'All advice is based on information provided by the client.',
                        'Fees paid (if applicable) are for consultancy services only.',
                        'We are not affiliated with UKVI, IRCC, USCIS, or any embassy.',
                        'Clients are responsible for final submission of applications unless agreed otherwise.',
                      ].map((item, i) => (
                        <li key={i} style={{ paddingLeft: 30, position: 'relative', marginBottom: 15, lineHeight: 1.8 }}>
                          <i className="fa-solid fa-circle-check" style={{ position: 'absolute', left: 0, top: 5, color: 'var(--theme)' }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="wow fadeInUp" data-wow-delay=".6s" style={{ lineHeight: 1.8, marginBottom: 30, fontWeight: 600 }}>
                    By using our services, you agree to these terms.
                  </p>

                  <div className="text-center wow fadeInUp" data-wow-delay=".7s" style={{ marginTop: 50 }}>
                    <Link to="/contact" className="theme-btn">
                      <div className="btn_inner">
                        <div className="btn_icon">
                          <span>
                            <i className="fa-solid fa-arrow-up-right"></i>
                            <i className="fa-solid fa-arrow-up-right"></i>
                          </span>
                        </div>
                        <div className="btn_text"><span>Accept &amp; Contact Us</span></div>
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
