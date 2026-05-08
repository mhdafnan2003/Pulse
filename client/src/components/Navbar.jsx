import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logoMain from '../assets/logo-main.png';
import logoMob from '../assets/logo-mob.png';

export default function Navbar() {
  const location = useLocation();
  const [sticky, setSticky] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroBackground, setHeroBackground] = useState('');
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 250);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onHeroBackgroundChange = (event) => {
      setHeroBackground(event.detail?.backgroundImage || '');
    };

    window.addEventListener('pulse:hero-slide-bg', onHeroBackgroundChange);

    return () => {
      window.removeEventListener('pulse:hero-slide-bg', onHeroBackgroundChange);
    };
  }, []);

  const isHomePage = location.pathname === '/';
  const nonStickyStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: 'transparent',
    /* Do not apply the hero background to the header element itself;
       let the hero slider sit behind the header for a continuous image. */
    backgroundImage: 'none',
  };

  return (
    <>
      <style>{`
        @media (min-width: 992px) {
          .mean__menu-wrapper {
            display: flex !important;
            align-items: center;
          }
          .mean__menu-wrapper .main-menu {
            display: block !important;
          }
          .mean__menu-wrapper .main-menu nav#mobile-menu {
            display: block !important;
          }
          .mean__menu-wrapper .main-menu nav#mobile-menu > ul {
            display: flex !important;
            align-items: center;
            gap: 0;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .mean__menu-wrapper .main-menu nav#mobile-menu > ul > li > a {
            display: inline-block !important;
            padding: 10px 18px !important;
          }
        }
        @media (max-width: 991px) {
          .mean__menu-wrapper {
            display: none !important;
          }
        }
      `}</style>
      <div className="fix-area">
        <div className={`offcanvas__info ${offcanvasOpen ? 'info-open' : ''}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <Link to="/">
                  <img src={logoMob} alt="Pulse Creative & Consulting Ltd" />
                </Link>
              </div>
              <div className="offcanvas__close">
                <button type="button" onClick={() => setOffcanvasOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            {/* Mobile nav — uses mean-container/mean-nav structure so theme CSS applies */}
            <div className="mobile-menu fix mb-3">
              <div className="mean-container">
                <nav className="mean-nav">
                  <ul>
                    <li>
                      <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        onClick={() => setOffcanvasOpen(false)}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className={location.pathname === '/about' ? 'active' : ''}
                        onClick={() => setOffcanvasOpen(false)}
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/service"
                        className={location.pathname === '/service' ? 'active' : ''}
                        onClick={() => setOffcanvasOpen(false)}
                      >
                        Services
                      </Link>
                    </li>
                    <li className="mean-last">
                      <Link
                        to="/contact"
                        className={location.pathname === '/contact' ? 'active' : ''}
                        onClick={() => setOffcanvasOpen(false)}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="offcanvas__contact">
              <div className="d-flex justify-content-center mt-3 mb-3">
                <Link to="/apply-now" className="theme-btn" onClick={() => setOffcanvasOpen(false)}>
                  <div className="btn_inner">
                    <div className="btn_icon">
                      <span style={{ backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>
                    <div className="btn_text"><span>Apply Now</span></div>
                  </div>
                </Link>
              </div>
              <div className="social-icon d-flex align-items-center justify-content-center">
                <a href="https://wa.me/447956273533" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="#" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>{/* end fix-area */}
      <div className={`offcanvas__overlay ${offcanvasOpen ? 'overlay-open' : ''}`} onClick={() => setOffcanvasOpen(false)}></div>

      <header
        ref={headerRef}
        id="header-sticky"
        className={`header-1${sticky ? ' sticky' : ''}`}
        style={!sticky ? nonStickyStyle : {}}
      >
      <div className="container">
        <div className="mega-menu-wrapper">
          <div className="header-main">
            <Link to="/" className="logo">
              <img src={logoMain} alt="Pulse Creative & Consulting Ltd" className="d-none d-md-block" />
              <img src={logoMob} alt="Pulse Creative & Consulting Ltd" className="d-block d-md-none" />
            </Link>

            <div className="mean__menu-wrapper">
              <div className="main-menu">
                <nav id="mobile-menu">
                  <ul>
                    <li className="has-dropdown active menu-thumb"><Link to="/">Home</Link></li>
                    <li className="has-dropdown active d-xl-none"><Link to="/" className="border-none">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/service">Services</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                </nav>
              </div>
              <button type="button" className="main-header__search search-toggler d-none d-lg-block" onClick={() => setSearchOpen(true)}>
                <i className="fa-regular fa-magnifying-glass"></i>
              </button>
            </div>

            <div className="header-right d-flex justify-content-end align-items-center">
              <button type="button" className="main-header__search search-toggler d-lg-none" onClick={() => setSearchOpen(true)}>
                <i className="fa-regular fa-magnifying-glass"></i>
              </button>
              {location.pathname !== '/apply-now' && (
                <Link to="/apply-now" className="theme-btn d-none d-lg-block" style={{ marginRight: '20px' }}>
                  <div className="btn_inner">
                    <div className="btn_icon">
                      <span style={{ backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>
                    <div className="btn_text"><span>Apply Now</span></div>
                  </div>
                </Link>
              )}

              {/* Mobile hamburger — only on screens below lg */}
              <div className="header__hamburger d-lg-none my-auto">
                <button type="button" className="sidebar__toggle" onClick={() => setOffcanvasOpen(true)}>
                  <i className="fa-regular fa-bars" style={{ color: sticky ? undefined : '#fff', fontSize: 22 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </header>

      <div className={`search-popup${searchOpen ? ' active' : ''}`}>
        <div className="search-popup__overlay search-toggler" onClick={() => setSearchOpen(false)}></div>
        <div className="search-popup__content">
          <form role="search" method="get" className="search-popup__form" action="#">
            <input type="text" id="search" name="search" placeholder="Search Here..." />
            <button type="submit" aria-label="search submit" className="search-btn">
              <span><i className="fa-regular fa-magnifying-glass"></i></span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
