import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContactContent } from '../context/ContactContentContext';

export default function Footer() {
  const { contactContent, fetchContactContent } = useContactContent();

  useEffect(() => {
    fetchContactContent();
  }, [fetchContactContent]);

  const phone = contactContent?.phoneNumbers?.[0];

  return (
    <footer className="footer-section">
      <div className="footer-area">
        <div className="container">
          <div className="footer-widget-wrapper">
            <div className="row justify-content-between">
              <div className="col-xl-4 col-lg-5 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <Link to="/" className="footer-logo">
                      <img src="/assets/img/logo-main.png" alt="Pulse Creative & Consulting Ltd" />
                    </Link>
                  </div>
                  <div className="footer-content">
                    <p>
                      Inspiring solutions. Driving success ethically and compliantly.
                    </p>
                    <Link to="/contact" className="footer-btn">
                      <span className="icon"><i className="fa-solid fa-arrow-up-right"></i></span>
                      Let’s Talk
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <h3>Quick links</h3>
                  </div>
                  <ul className="gt-list-area">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/service">Services</Link></li>
                    <li><Link to="/about">History</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 ps-lg-0 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <h3>Services</h3>
                  </div>
                  <ul className="gt-list-area">
                    <li><Link to="/service">Student Visas</Link></li>
                    <li><Link to="/service">Work Visas</Link></li>
                    <li><Link to="/service">Visit Visas</Link></li>
                    <li><Link to="/service">International Work</Link></li>
                    <li><Link to="/service">Career Support</Link></li>
                    <li><Link to="/service">Legal & Compliance</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".8s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <h3>Get in touch</h3>
                  </div>
                  <ul className="contact-list">
                    <li>
                      {(contactContent?.addressLines || []).map((line, i) => (
                        <span key={i} className="d-block">{line}</span>
                      ))}
                    </li>
                    <li>
                      {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>}
                    </li>
                    <li>
                      {(contactContent?.openHoursLines || []).map((line, i) => (
                        <span key={i} className="d-block">{line}</span>
                      ))}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-wrapper">
              <p className="wow fadeInUp" data-wow-delay=".3s">
                © 2025 <b>Pulse.</b> All rights reserved.
              </p>
              <div className="social-icon d-flex align-items-center wow fadeInUp" data-wow-delay=".5s">
                <a href="https://wa.me/447956273533" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="#" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
              </div>
              <ul className="footer-list wow fadeInUp" data-wow-delay=".7s">
                <li><Link to="/privacy-policy">Privacy policy</Link></li>
                <li>।</li>
                <li><Link to="/terms-conditions">Terms &amp; conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
