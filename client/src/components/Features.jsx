import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useHomeContent } from '../context/HomeContentContext';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function Features() {
  const { homeContent, fetchHomeContent } = useHomeContent();
  const location = useLocation();
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent, location.pathname]);

  // Ensure autoplay starts
  useEffect(() => {
    if (!isMobile && swiperRef.current?.swiper?.autoplay) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  const servicesSection = homeContent?.servicesSection || {};
  const services = servicesSection.services || [];

  return (
    <section className="feature-section section-padding fix">
      <div className="container">
        <div className="section-title text-center">
          <h6 className="sub-title wow fadeInUp">
            <img src="/assets/img/home-1/star.svg" alt="img" /> {servicesSection.eyebrow}
          </h6>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
            {servicesSection.title} <br /> <span>{servicesSection.titleHighlight}</span>
          </h2>
        </div>

        <div className="feature-wrapper">
          <div className="array-button wow fadeInUp" data-wow-delay=".3s">
            <button className="array-prev"><i className="fa-solid fa-chevron-left"></i></button>
            <div className="swiper-dot">
              <div className="dot"></div>
            </div>
            <button className="array-next"><i className="fa-solid fa-chevron-right"></i></button>
          </div>

          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            className="feature-box-slider"
            spaceBetween={30}
            speed={1300}
            loop
            autoplay={isMobile ? false : { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ nextEl: '.array-next', prevEl: '.array-prev' }}
            pagination={{ el: '.dot', clickable: true }}
            centeredSlides={false}
            breakpoints={{
              1199: { slidesPerView: 4, centeredSlides: false },
              991:  { slidesPerView: 3, centeredSlides: false },
              767:  { slidesPerView: 2, centeredSlides: false },
              575:  { slidesPerView: 1.2, centeredSlides: true },
              0:    { slidesPerView: 1.2, centeredSlides: true },
            }}
          >
            {services.map((svc) => (
              <SwiperSlide key={svc.id}>
                <div className="feature-box-items">
                  <h6>{svc.id}.</h6>
                  <h3>
                    <Link to="/service">
                      {svc.title} <span className="d-block">{svc.subtitle}</span>
                    </Link>
                  </h3>
                  <div className="service-details-list" style={{ marginBottom: 25 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {svc.features.map((feat, i) => (
                        <li key={i} style={{ marginBottom: 8, color: '#666' }}>
                          <i className="fa-solid fa-circle-check" style={{ color: '#007bff', marginRight: 10 }}></i>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="feature-info-box">
                    <ul>
                      <li>Plan</li>
                      <li>Execute</li>
                      <li>Succeed</li>
                    </ul>
                    <Link to="/service" className="icon">
                      <i className="fa-solid fa-arrow-up-right"></i>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
