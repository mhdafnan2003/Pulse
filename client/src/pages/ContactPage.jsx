import { useState } from 'react';

const infoCards = [
  {
    icon: 'fa-sharp fa-solid fa-location-dot',
    title: 'Our address',
    content: (
      <p>Pulse Creative & Consulting Ltd Mirror Works, 12 Marshgate Lane, London, E15 2NH.</p>
    ),
    delay: '.3s',
  },
  {
    icon: 'fa-solid fa-phone-xmark',
    title: 'Contact number',
    content: (
      <p>
        <a className="d-block" href="tel:+447956273533">Mobile: +44 7956 273533</a>
        <a href="mailto:info@pulsecc.co.uk">Email: info@pulsecc.co.uk</a><br />
        <a href="mailto:admissions@pulsecc.co.uk">Email: admissions@pulsecc.co.uk</a><br />
        <a href="mailto:consult@pulsecc.co.uk">Email: consult@pulsecc.co.uk</a>
      </p>
    ),
    delay: '.5s',
  },
  {
    icon: 'fa-regular fa-clock-two-thirty',
    title: 'Open hour',
    content: (
      <p>Mon–Fri: 09:00–18:00 <br />Saturday: 10:00–15:00 <br />Sunday: Closed</p>
    ),
    delay: '.7s',
  },
];

export default function ContactPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/two.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">Contact us</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/"><i className="fa-solid fa-house"></i> Home</a></li>
              <li>/</li>
              <li>Contact us</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="contact-info-section fix section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="sub-title wow fadeInUp"><img src="/assets/img/home-1/star.svg" alt="img" /> get in touch</h6>
            <h2 className="text-anim">Our Contact Information</h2>
          </div>
          <div className="row">
            {infoCards.map((card, i) => (
              <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={card.delay}>
                <div
                  className={`contact-info-box${activeIndex === i ? ' active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="icon"><i className={card.icon}></i></div>
                  <div className="content">
                    <h4>{card.title}</h4>
                    {card.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section fix section-padding pt-0">
        <div className="container">
          <div className="contact-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact-map">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.8739425876374!2d-0.013833!3d51.5325642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d3d6c2075e3%3A0xf9b0869c93d3250e!2sWorkspace%C2%AE%20%7C%20Mirror%20Works!5e0!3m2!1sen!2suk!4v1709000000000!5m2!1sen!2suk" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="contact-box-items">
                  <h2 className="text-anim">Send Us A Message.</h2>
                  <form id="contact-form" className="contact-form-box" onSubmit={(event) => {
                    event.preventDefault();
                    const name = document.getElementById('contact-name').value;
                    const email = document.getElementById('contact-email').value;
                    const phone = document.getElementById('contact-phone').value;
                    const service = document.getElementById('contact-service').value;
                    const message = document.getElementById('contact-message').value;
                    let whatsappMessage = `*New Inquiry from Website*%0A%0A`;
                    whatsappMessage += `*Name:* ${encodeURIComponent(name)}%0A`;
                    whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
                    whatsappMessage += `*Phone:* ${encodeURIComponent(phone)}%0A`;
                    whatsappMessage += `*Service Interested:* ${encodeURIComponent(service)}%0A%0A`;
                    whatsappMessage += `*Message:*%0A${encodeURIComponent(message)}`;
                    window.open(`https://wa.me/447956273533?text=${whatsappMessage}`, '_blank');
                    document.getElementById('contact-form').reset();
                  }}>
                    <div className="row g-4 align-items-center">
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><input type="text" id="contact-name" name="name" placeholder="Full name *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s"><div className="form-clt"><input type="email" id="contact-email" name="email" placeholder="Email address *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><input type="tel" id="contact-phone" name="phone" placeholder="Phone number *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s"><div className="form-clt"><div className="form"><select className="single-select w-100" id="contact-service" name="service"><option>Choose an option</option><option>Student Visas</option><option>Work Visas</option><option>Visit Visas</option><option>International Work</option><option>Career Support</option><option>Legal & Compliance</option></select></div></div></div>
                      <div className="col-lg-12 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><textarea id="contact-message" name="message" placeholder="Type your message" required></textarea></div></div>
                      <div className="col-lg-12 wow fadeInUp" data-wow-delay=".5s"><button type="submit" className="theme-btn wow fadeInUp" data-wow-delay=".5s"><span className="btn_inner"><span className="btn_icon"><span><i className="fa-brands fa-whatsapp"></i><i className="fa-brands fa-whatsapp"></i></span></span><span className="btn_text"><span>Send to WhatsApp</span></span></span></button></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
