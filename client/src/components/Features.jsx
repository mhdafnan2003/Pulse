import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const services = [
  {
    id: '001',
    title: 'Student Visa',
    subtitle: 'Services',
    features: [
      'UK Student Visa guidance',
      'Course & eligibility checks',
      'Application preparation',
      'Interview preparation',
    ],
  },
  {
    id: '002',
    title: 'Skilled Worker &',
    subtitle: 'Work Visa Services',
    features: [
      'Healthcare & Engineering roles',
      'SOC code & Wage guidance',
      'Employer sponsorship support',
      'End-to-end visa guidance',
    ],
  },
  {
    id: '003',
    title: 'Visit / Tourist',
    subtitle: 'Visa Services',
    features: [
      'UK, Canada & USA Visas',
      'Schengen Countries Assistance',
      'Refusal-risk minimisation',
      'Document preparation',
    ],
  },
  {
    id: '004',
    title: 'International Work',
    subtitle: 'Visa Assistance',
    features: [
      'Overseas work visa guidance',
      'Profession eligibility checks',
      'Document support',
      'Step-by-step guidance',
    ],
  },
  {
    id: '005',
    title: 'Job Application &',
    subtitle: 'Career Support',
    features: [
      'UK & International CV/Resume',
      'Job application assistance',
      'Sponsored job guidance',
      'Interview coaching',
    ],
  },
  {
    id: '006',
    title: 'Legal & Compliance',
    subtitle: 'Support',
    features: [
      'Visa documentation review',
      'Compliance for employers',
      'Compliance for applicants',
      'Advisory support',
    ],
  },
];

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function Features() {
  return (
    <section className="feature-section section-padding fix">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <h6 className="sub-title wow fadeInUp">
              <img src="/assets/img/home-1/star.svg" alt="img" /> EXPLORE OUR SERVICES
            </h6>
            <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
              Professional Visa & Immigration <br /> <span>Consultancy Services.</span>
            </h2>
          </div>
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
            modules={[Navigation, Pagination, Autoplay]}
            className="feature-box-slider"
            spaceBetween={30}
            speed={1300}
            loop
            autoplay={isMobile ? false : { delay: 2000, disableOnInteraction: false }}
            navigation={{ nextEl: '.array-next', prevEl: '.array-prev' }}
            pagination={{ el: '.dot', clickable: true }}
            breakpoints={{
              1199: { slidesPerView: 4 },
              991:  { slidesPerView: 3 },
              767:  { slidesPerView: 2 },
              575:  { slidesPerView: 1.5 },
              0:    { slidesPerView: 1.2 },
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
