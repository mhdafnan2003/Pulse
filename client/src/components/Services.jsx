import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useHomeContent } from '../context/HomeContentContext';

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const { homeContent, fetchHomeContent } = useHomeContent();
  const location = useLocation();
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reason = homeContent?.reasonSection || {};
  const cards = reason.cards || [];
  // Enable slider on mobile if more than 1 card, or on desktop if more than 4 cards
  const hasSlider = isMobile ? cards.length > 1 : cards.length > 4;

  const handleSlidePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Ensure autoplay starts when slider is active
  useEffect(() => {
    if (hasSlider && !isMobile && swiperRef.current?.swiper?.autoplay) {
      const timer = setTimeout(() => {
        swiperRef.current.swiper.autoplay.start();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasSlider, isMobile]);

  return (
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <h6 className="sub-title wow fadeInUp">
            <img src="/assets/img/home-1/star.svg" alt="img" /> {reason.eyebrow}
          </h6>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
            {reason.title} <span className="title-highlight">{reason.titleHighlight}</span>
          </h2>
          <p className="mt-3 wow fadeInUp" data-wow-delay=".3s">
            {reason.description}
          </p>
        </div>

        <div className="reason-slider-wrapper">
          {hasSlider && (
            <div className="array-button wow fadeInUp" data-wow-delay=".3s">
              <button className="array-prev" onClick={handleSlidePrev}><i className="fa-solid fa-chevron-left"></i></button>
              <button className="array-next" onClick={handleSlideNext}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          )}

          <Swiper
            ref={swiperRef}
            modules={hasSlider ? [Navigation, Pagination, Autoplay] : []}
            className="reason-card-slider"
            spaceBetween={30}
            speed={1300}
            loop={hasSlider && cards.length > (isMobile ? 1 : 4)}
            autoplay={hasSlider && !isMobile ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            navigation={hasSlider ? true : false}
            pagination={hasSlider ? { el: '.reason-dot', clickable: true } : false}
            slidesPerView={4}
            centeredSlides={false}
            breakpoints={hasSlider ? {
              1199: { slidesPerView: 4, centeredSlides: false },
              991:  { slidesPerView: 3, centeredSlides: false },
              767:  { slidesPerView: 2, centeredSlides: false },
              575:  { slidesPerView: 1.2, centeredSlides: true },
              0:    { slidesPerView: 1.2, centeredSlides: true },
            } : {
              1199: { slidesPerView: 4, centeredSlides: false },
              991:  { slidesPerView: 3, centeredSlides: false },
              767:  { slidesPerView: 2, centeredSlides: false },
              575:  { slidesPerView: 1.2, centeredSlides: true },
              0:    { slidesPerView: 1.2, centeredSlides: true },
            }}
            onSwiper={(swiper) => {
              if (swiperRef.current) {
                swiperRef.current.swiper = swiper;
              }
            }}
          >
            {cards.map((card, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`service-card-item${activeIndex === i ? ' active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="icon">
                    <img src={card.icon} alt="img" />
                  </div>
                  <div className="content">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {hasSlider && (
            <div className="swiper-dot text-center mt-4">
              <div className="reason-dot"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
