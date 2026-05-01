import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  {
    text: 'Pulse Creative & Consulting guided me step by step and made the process stress-free. My UK student visa was approved without any issues.',
    name: 'Student Applicant',
    role: 'Student Visa – UK',
    thumb: '/assets/img/home-1/testimonial/one.png',
  },
  {
    text: 'Very professional service. They explained salary rules, documents, and sponsorship clearly. Highly recommended.',
    name: 'Healthcare Professional',
    role: 'Skilled Worker Visa – Healthcare',
    thumb: '/assets/img/home-1/testimonial/two.png',
  },
  {
    text: 'Clear guidance and proper document checking. My tourist visa was approved smoothly.',
    name: 'Tourist Visa Applicant',
    role: 'Visit Visa – Schengen',
    thumb: '/assets/img/home-1/testimonial/three.png',
  },
];

export default function Testimonials() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className="testimonial-section section-padding">
      <div className="container">
        <div className="section-title text-center">
          <h6 className="sub-title wow fadeInUp">
            <img src="/assets/img/home-1/star.svg" alt="img" /> CLIENT TESTIMONIALS
          </h6>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
            Client Experiences Inspire <br /> <span>Our Success.</span>
          </h2>
        </div>

        <div className="testimonial-warpper">
          {/* Thumbnail avatars */}
          <div className="testi-client">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              watchSlidesProgress
              className="testimonial-thumbs"
              slidesPerView={3}
              spaceBetween={0}
              centeredSlides
              loop
              speed={1300}
              slideToClickedSlide
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="client-img">
                    <img src={t.thumb} alt="img" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Main testimonial content */}
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            className="testimonial-slider-content"
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            navigation={{ nextEl: '.array-next', prevEl: '.array-prev' }}
            pagination={{ el: '.dot2', clickable: true }}
            slidesPerView={1}
            spaceBetween={30}
            centeredSlides
            loop
            speed={1300}
            loopedSlides={6}
            breakpoints={{
              768: { slidesPerView: 1 },
              0: { slidesPerView: 1.1, spaceBetween: 20 },
            }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="testimonial-content-1">
                  <h3>{t.text}</h3>
                  <div className="testi-info">
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-dot text-center mt-4">
            <div className="dot2"></div>
          </div>

          <div className="array-button">
            <button className="array-prev"><i className="fa-solid fa-chevron-left"></i></button>
            <button className="array-next"><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
}
