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
          <div className="row justify-content-center mt-5">
            <div className="col-lg-10">
              <div className="company-content">
                <p className="wow fadeInUp" data-wow-delay=".3s">
                  Pulse Creative & Consulting Ltd is a UK-registered consulting firm based in London, England, specialising in student visa services, skilled worker visa guidance, and legal and compliance consulting for individuals planning to study, work, and settle in the United Kingdom. We support students, graduates, healthcare professionals, engineers, and other skilled workers by providing structured, end-to-end assistance tailored to their specific immigration and career goals.
                </p>
                <p className="mt-4 wow fadeInUp" data-wow-delay=".5s">
                  Our services focus on simplifying complex immigration procedures, documentation requirements, and compliance obligations. Guided by professionalism, transparency, and accuracy, our mission is to deliver clear, ethical, and reliable advice while safeguarding our clients’ legal rights and long-term professional interests throughout their UK journey.
                </p>
                <p className="mt-4 wow fadeInUp" data-wow-delay=".5s">
                  We are committed to maintaining the highest standards of integrity and compliance, working closely with relevant institutions, employers, and professional advisers to ensure every application meets current UK immigration regulations. Through personalised consultation and ongoing support, we aim to build long-term relationships with our clients, helping them make informed decisions and move forward with confidence at every stage of their UK study, work, or settlement pathway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
