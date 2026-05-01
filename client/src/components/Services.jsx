import { useState } from 'react';

const cards = [
  {
    icon: '/assets/img/home-1/icon/icon1.svg',
    title: 'Visa & Legal Specialists',
    desc: 'Student visas + Skilled Worker visas (Healthcare & Engineering) + compliance support.',
  },
  {
    icon: '/assets/img/home-1/icon/icon2.svg',
    title: 'Personalised Support',
    desc: 'Every case handled individually based on eligibility and goals.',
  },
  {
    icon: '/assets/img/home-1/icon/icon3.svg',
    title: 'Transparent & Ethical',
    desc: 'No false promises, clear timelines, fully compliant process.',
  },
  {
    icon: '/assets/img/home-1/icon/icon4.svg',
    title: 'End-to-End Assistance',
    desc: 'From consultation to submission + follow-ups.',
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <h6 className="sub-title wow fadeInUp">
            <img src="/assets/img/home-1/star.svg" alt="img" /> REASON FOR CHOSE US
          </h6>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
            Building smarter solutions <br /> <span>each business.</span>
          </h2>
          <p className="mt-3 wow fadeInUp" data-wow-delay=".3s">
            We provide innovative an reliable solutions designed help modern.
          </p>
        </div>
        <div className="row advance-wrap">
          {cards.map((card, i) => (
            <div key={i} className="col-xl-3 col-lg-4 col-md-6 advance-item">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
