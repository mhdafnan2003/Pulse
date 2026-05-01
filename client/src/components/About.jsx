import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="about-section section-bg">
      <div className="container">
        <div className="about-wrapper">
          <div className="row align-items-center">
            <div className="col-xl-5">
              <div className="about-image fix">
                <img data-speed=".8" src="/assets/img/home-1/about/chat.png" alt="img" />
              </div>
            </div>
            <div className="col-xl-7 mt-4 mt-xl-0">
              <div className="about-content">
                <div className="section-title mb-0">
                  <h6 className="sub-title wow fadeInUp">
                    <img src="/assets/img/home-1/star.svg" alt="img" /> ABOUT OUR AGENCY
                  </h6>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
                    Transforming modern business ideas <br /> into innovative global solutions
                    that <br /> inspire long-term success through <br /> business collaboration.
                  </h2>
                </div>
                <div className="about-description wow fadeInUp" data-wow-delay=".3s" style={{ marginTop: 30, marginBottom: 30 }}>
                  <p style={{ lineHeight: 1.8, fontSize: 16, color: '#666', marginBottom: 0 }}>
                    Pulse Creative & Consulting Ltd is a UK-based consultancy providing
                    professional visa, immigration, and career guidance services. We specialise
                    in supporting international students, skilled professionals, and visitors
                    through transparent, compliant, and client-focused solutions.
                  </p>
                </div>
                <Link to="/about" className="theme-btn wow fadeInUp" data-wow-delay=".5s">
                  <div className="btn_inner">
                    <div className="btn_icon">
                      <span>
                        <i className="fa-solid fa-arrow-up-right"></i>
                        <i className="fa-solid fa-arrow-up-right"></i>
                      </span>
                    </div>
                    <div className="btn_text">
                      <span>Learn more</span>
                    </div>
                  </div>
                </Link>
                <div className="about-conter-items"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
