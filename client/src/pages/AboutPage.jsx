export default function AboutPage() {
  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/one.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">About us</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/"><i className="fa-solid fa-house"></i> Home</a></li>
              <li>/</li>
              <li>About us</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="company-info-section fix section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="sub-title wow fadeInUp"><img src="/assets/img/home-1/star.svg" alt="img" /> About Our Company</h6>
            <h2 className="text-anim">PULSE creative & consulting Ltd</h2>
          </div>

          {/* Zig-Zag Section 1: Who We Are */}
          <div className="zigzag-section wow fadeInUp" data-wow-delay=".3s">
            <div className="row align-items-center g-5">
              <div className="col-lg-5 col-md-12">
                <div className="zigzag-image">
                  <img src="/assets/img/home-1/about/about-1.png" alt="Who We Are" className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-7 col-md-12">
                <div className="zigzag-content">
                  <div className="content-header">
                    <h3 className="section-heading">Who We Are</h3>
                    <div className="accent-line"></div>
                  </div>
                  <p className="lead-text">
                    Pulse Creative & Consulting Ltd is a UK-registered consulting firm based in London, England, specialising in comprehensive visa and immigration services.
                  </p>
                  <p className="body-text">
                    We specialise in student visa services, skilled worker visa guidance, and legal and compliance consulting for individuals planning to study, work, and settle in the United Kingdom. We support students, graduates, healthcare professionals, engineers, and other skilled workers by providing structured, end-to-end assistance tailored to their specific immigration and career goals.
                  </p>
                  <div className="highlight-box">
                    <i className="fas fa-check-circle"></i>
                    <span>UK-registered consulting firm with expert guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 2: Our Mission */}
          <div className="zigzag-section wow fadeInUp" data-wow-delay=".5s">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 col-md-12 order-lg-1 order-md-2">
                <div className="zigzag-content">
                  <div className="content-header">
                    <h3 className="section-heading">Our Mission</h3>
                    <div className="accent-line"></div>
                  </div>
                  <p className="lead-text">
                    Simplifying complex immigration procedures with professionalism and transparency.
                  </p>
                  <p className="body-text">
                    Our services focus on simplifying complex immigration procedures, documentation requirements, and compliance obligations. Guided by professionalism, transparency, and accuracy, our mission is to deliver clear, ethical, and reliable advice while safeguarding our clients' legal rights and long-term professional interests throughout their UK journey.
                  </p>
                  <div className="highlight-box">
                    <i className="fas fa-lightbulb"></i>
                    <span>Clear, ethical, and reliable immigration guidance</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 order-lg-2 order-md-1">
                <div className="zigzag-image">
                  <img src="/assets/img/home-1/about/about-2.png" alt="Our Mission" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>

          {/* Zig-Zag Section 3: Our Commitment */}
          <div className="zigzag-section wow fadeInUp" data-wow-delay=".7s">
            <div className="row align-items-center g-5">
              <div className="col-lg-5 col-md-12">
                <div className="zigzag-image">
                  <img src="/assets/img/home-1/about/about-3.png" alt="Our Commitment" className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-7 col-md-12">
                <div className="zigzag-content">
                  <div className="content-header">
                    <h3 className="section-heading">Our Commitment</h3>
                    <div className="accent-line"></div>
                  </div>
                  <p className="lead-text">
                    Maintaining the highest standards of integrity and compliance for every client.
                  </p>
                  <p className="body-text">
                    We are committed to maintaining the highest standards of integrity and compliance, working closely with relevant institutions, employers, and professional advisers to ensure every application meets current UK immigration regulations. Through personalised consultation and ongoing support, we aim to build long-term relationships with our clients, helping them make informed decisions and move forward with confidence at every stage of their UK study, work, or settlement pathway.
                  </p>
                  <div className="highlight-box">
                    <i className="fas fa-shield-alt"></i>
                    <span>Long-term partnerships with personalised support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
