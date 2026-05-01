import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { slidesApi } from '../api';

const defaultGradient = 'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)';

const fallbackSlides = [
  {
    _id: '1',
    title: 'UK & International Visa Consultancy',
    titleHighlight: 'You Can Trust',
    body: 'We provide professional visa guidance, job application support, and compliance assistance for students, skilled professionals, healthcare workers, engineers, and visitors worldwide.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-1.jpg',
    gradient: defaultGradient,
    whatsappLink: 'https://wa.me/447956273533',
  },
  {
    _id: '2',
    title: 'Skilled Worker & Student Visa',
    titleHighlight: 'Support Made Simple',
    body: 'From visa requirements to document checks and application strategy, we help you move forward with confidence at every stage of the process.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-2.jpg',
    gradient: defaultGradient,
    whatsappLink: 'https://wa.me/447956273533',
  },
  {
    _id: '3',
    title: 'Tailored Visa Guidance',
    titleHighlight: 'For Your Next Move',
    body: 'Whether you are applying for work, study, or a visit visa, our team helps you prepare a stronger application with practical, personal support.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-3.jpg',
    gradient: defaultGradient,
    whatsappLink: 'https://wa.me/447956273533',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    slidesApi.getPublic()
      .then((res) => {
        const active = res.data?.filter((s) => s.isActive);
        if (active?.length) setSlides(active);
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const publishHeaderBackground = (index, slideList) => {
    const safeIndex = Number.isFinite(index) ? index : 0;
    const active = slideList[(safeIndex + slideList.length) % slideList.length];
    window.dispatchEvent(new CustomEvent('pulse:hero-slide-bg', {
      detail: { backgroundImage: `${active.gradient || defaultGradient}, url('${active.bgImage}')` },
    }));
  };

  return (
    <section className="hero-section hero-1 fix bg-cover hero-slider-section">
      <Swiper
        className="hero-banner-slider"
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.hero-banner-pagination' }}
        onSwiper={(swiper) => publishHeaderBackground(swiper.realIndex, slides)}
        onSlideChange={(swiper) => publishHeaderBackground(swiper.realIndex, slides)}
        loop={slides.length > 1}
        speed={800}
        style={{ width: '100%' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div
              className="swiper-slide hero-slide"
              style={{ backgroundImage: `${slide.gradient || defaultGradient}, url('${slide.bgImage}')` }}
            >
              <div className="container hero-slide-inner">
                <div className="hero-content hero-slide-content">
                  <h1>
                    {slide.title}{' '}
                    {slide.titleHighlight && <span>{slide.titleHighlight}</span>}
                  </h1>
                  <p>{slide.body}</p>
                  <div className="hero-button-group" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <a href={slide.whatsappLink} className="theme-btn" target="_blank" rel="noreferrer">
                      <div className="btn_inner">
                        <div className="btn_icon">
                          <span>
                            <i className="fa-brands fa-whatsapp" />
                            <i className="fa-brands fa-whatsapp" />
                          </span>
                        </div>
                        <div className="btn_text"><span>WhatsApp Us</span></div>
                      </div>
                    </a>
                    <a href="#contact-modal" className="theme-btn contact-popup">
                      <div className="btn_inner">
                        <div className="btn_icon">
                          <span>
                            <i className="fa-solid fa-calendar-check" />
                            <i className="fa-solid fa-calendar-check" />
                          </span>
                        </div>
                        <div className="btn_text"><span>Book Consultation</span></div>
                      </div>
                    </a>
                  </div>
                  <div className="hero-button-group-mobile">
                    <a href={slide.whatsappLink} className="mobile-icon-btn whatsapp-btn" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-whatsapp" />
                    </a>
                    <a href="#contact-modal" className="mobile-icon-btn contact-btn contact-popup">
                      <i className="fa-solid fa-calendar-check" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination hero-banner-pagination" />
      </Swiper>
    </section>
  );
}
