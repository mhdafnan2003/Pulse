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
      <div className="fix-area">
        <div className={`offcanvas__info ${offcanvasOpen ? 'info-open' : ''}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <Link to="/">
                  <img src={logoMain} alt="Pulse Creative & Consulting Ltd" className="d-none d-md-block" />
                  <img src={logoMob} alt="Pulse Creative & Consulting Ltd" className="d-block d-md-none" />
                </Link>
              </div>
              <div className="offcanvas__close">
                <button type="button" onClick={() => setOffcanvasOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <p className="text d-none d-xl-block">
              Nullam dignissim, ante scelerisque the is euismod fermentum odio sem semper the is erat, a feugiat leo urna eget eros. Duis Aenean a imperdiet risus.
            </p>
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
              <h4>Contact Info</h4>
              <ul>
                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon">
                    <i className="fal fa-map-marker-alt"></i>
                  </div>
                  <div className="offcanvas__contact-text">
                    <a target="_blank" rel="noreferrer" href="#">Mirror Works, 12 Marshgate Lane, London, E15 2NH.</a>
                  </div>
                </li>
                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <i className="fal fa-envelope"></i>
                  </div>
                  <div className="offcanvas__contact-text">
                    <a href="mailto:info@example.com"><span className="mailto:info@example.com">info@example.com</span></a>
                  </div>
                </li>
                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <i className="fal fa-clock"></i>
                  </div>
                  <div className="offcanvas__contact-text">
                    <a target="_blank" rel="noreferrer" href="#">Mod-friday, 09am -05pm</a>
                  </div>
                </li>
                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <i className="far fa-phone"></i>
                  </div>
                  <div className="offcanvas__contact-text">
                    <a href="tel:+447956273533">+44 7956 273533</a>
                  </div>
                </li>
              </ul>
              <Link to="/contact" className="theme-btn mt-4" onClick={() => setOffcanvasOpen(false)}>
                <div className="btn_inner">
                  <div className="btn_icon">
                    <span>
                      <i className="fa-solid fa-arrow-up-right"></i>
                      <i className="fa-solid fa-arrow-up-right"></i>
                    </span>
                  </div>
                  <div className="btn_text">
                    <span>Contact us</span>
                  </div>
                </div>
              </Link>
              <div className="social-icon d-flex align-items-center">
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
              <button type="button" className="main-header__search search-toggler d-none d-xxl-block" onClick={() => setSearchOpen(true)}>
                <i className="fa-regular fa-magnifying-glass"></i>
              </button>
            </div>

            <div className="header-right d-flex justify-content-end align-items-center">
              <button type="button" className="main-header__search search-toggler d-xxl-none" onClick={() => setSearchOpen(true)}>
                <i className="fa-regular fa-magnifying-glass"></i>
              </button>
              <a href="tel:+447956273533" className="theme-btn d-none d-xxl-block">
                <div className="btn_inner">
                  <div className="btn_icon">
                    <span>
                      <img src="/assets/img/call.svg" alt="" />
                      <img src="/assets/img/call.svg" alt="" />
                    </span>
                  </div>
                  <div className="btn_text"><span>+44 7956 273533</span></div>
                </div>
              </a>

              {/* Mobile hamburger */}
              <div className="header__hamburger d-xl-none my-auto">
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
