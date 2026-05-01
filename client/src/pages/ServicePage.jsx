export default function ServicePage() {
  const services = [
    {
      id: '001',
      title: 'Student Visa',
      subtitle: 'Services',
      features: [
        'UK Student Visa guidance',
        'Course & document eligibility checks',
        'Application preparation & submission support',
        'Visa interview preparation (if required)',
      ],
    },
    {
      id: '002',
      title: 'Skilled Worker &',
      subtitle: 'Work Visa Services',
      features: [
        'UK Skilled Worker Visa assistance (Healthcare, Engineering & other skilled roles)',
        'Eligibility assessment & SOC code guidance',
        'Employer sponsorship & documentation support',
        'End-to-end Skilled Worker visa application guidance',
      ],
    },
    {
      id: '003',
      title: 'Visit / Tourist',
      subtitle: 'Visa Services',
      features: [
        'We assist with visitor visa applications for:',
        'UK Visit Visa',
        'Canada Visitor Visa',
        'USA B1/B2 Visitor Visa',
        'Ireland Visit Visa',
        'Iceland Visit Visa',
        'All Schengen Countries (Tourist / Family / Business Visit Visas)',
      ],
    },
    {
      id: '004',
      title: 'International Work',
      subtitle: 'Visa Assistance',
      features: [
        'Guidance for overseas work visa applications',
        'Eligibility checks based on country & profession',
        'Document preparation support',
        'Step-by-step application guidance (country-specific)',
      ],
    },
    {
      id: '005',
      title: 'Job Application &',
      subtitle: 'Career Support',
      features: [
        'UK & International CV / Resume preparation',
        'Job application assistance',
        'Sponsored job guidance',
        'Interview preparation & coaching',
      ],
    },
    {
      id: '006',
      title: 'Legal & Compliance',
      subtitle: 'Support',
      features: [
        'Visa documentation review',
        'Compliance guidance for applicants & employers',
        'Immigration-related advisory support',
      ],
    },
  ];

  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/three.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">Our services</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/"><i className="fa-solid fa-house"></i> Home</a></li>
              <li>/</li>
              <li>services</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="feature-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            {services.map((service, index) => (
              <div key={service.id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={index % 3 === 0 ? '.3s' : index % 3 === 1 ? '.5s' : '.7s'}>
                <div className="feature-box-items mt-0">
                  <h6>{service.id}.</h6>
                  <h3>
                    <a href="/service">{service.title} <span className="d-block">{service.subtitle}</span></a>
                  </h3>
                  <div className="service-details-list" style={{ marginBottom: 25 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{ marginBottom: 8, color: '#666' }}>
                          <i className="fa-solid fa-circle-check" style={{ color: '#007bff', marginRight: 10 }}></i>
                          {feature}
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
                    <a href="/service" className="icon"><i className="fa-solid fa-arrow-up-right"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section-2 bg-cover section-padding" style={{ backgroundImage: "url('/assets/img/inner-page/one.png')", marginBottom: 60 }}>
        <div className="container">
          <div className="contact-wrapper">
            <div className="row g-4">
              <div className="col-lg-6"></div>
              <div className="col-lg-6">
                <div className="contact-box-items style-2">
                  <div className="section-title">
                    <h6 className="sub-title wow fadeInUp"><img src="/assets/img/home-1/star.svg" alt="img" /> get in touch</h6>
                    <h2 className="text-anim text-white">Send Us A Message.</h2>
                  </div>
                  <form id="service-contact-form" className="contact-form-box" onSubmit={(event) => {
                    event.preventDefault();
                    const name = document.getElementById('service-name').value;
                    const email = document.getElementById('service-email').value;
                    const phone = document.getElementById('service-phone').value;
                    const service = document.getElementById('service-service').value;
                    const message = document.getElementById('service-message').value;
                    let whatsappMessage = `*New Inquiry from Website*%0A%0A`;
                    whatsappMessage += `*Name:* ${encodeURIComponent(name)}%0A`;
                    whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
                    whatsappMessage += `*Phone:* ${encodeURIComponent(phone)}%0A`;
                    whatsappMessage += `*Service Interested:* ${encodeURIComponent(service)}%0A%0A`;
                    whatsappMessage += `*Message:*%0A${encodeURIComponent(message)}`;
                    window.open(`https://wa.me/447956273533?text=${whatsappMessage}`, '_blank');
                    document.getElementById('service-contact-form').reset();
                  }}>
                    <div className="row g-4 align-items-center">
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><input type="text" id="service-name" name="name" placeholder="Full name *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s"><div className="form-clt"><input type="email" id="service-email" name="email" placeholder="Email address *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><input type="tel" id="service-phone" name="phone" placeholder="Phone number *" required /></div></div>
                      <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s"><div className="form-clt"><div className="form"><select className="single-select w-100" id="service-service" name="service"><option>Choose an option</option><option>Student Visas</option><option>Work Visas</option><option>Visit Visas</option><option>International Work</option><option>Career Support</option><option>Legal & Compliance</option></select></div></div></div>
                      <div className="col-lg-12 wow fadeInUp" data-wow-delay=".3s"><div className="form-clt"><textarea id="service-message" name="message" placeholder="Type your message" required></textarea></div></div>
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
