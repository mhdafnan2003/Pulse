import { useEffect } from 'react';
import { useAboutContent } from '../context/AboutContentContext';

export default function AboutPage() {
  const { aboutContent, fetchAboutContent } = useAboutContent();

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  const sections = aboutContent?.sections || [];

  return (
    <>
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/one.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">{aboutContent?.breadcrumbTitle || 'About us'}</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/"><i className="fa-solid fa-house"></i> Home</a></li>
              <li>/</li>
              <li>{aboutContent?.breadcrumbTitle || 'About us'}</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="company-info-section fix section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="sub-title wow fadeInUp"><img src="/assets/img/home-1/star.svg" alt="img" /> {aboutContent?.heroEyebrow || 'About Our Company'}</h6>
            <h2 className="text-anim">{aboutContent?.heroTitle || 'PULSE creative & consulting Ltd'}</h2>
          </div>

          {sections.map((section, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div key={index} className="zigzag-section wow fadeInUp" data-wow-delay={index === 0 ? '.3s' : index === 1 ? '.5s' : '.7s'}>
                <div className="row align-items-center g-5">
                  <div className={`col-lg-5 col-md-12${isReversed ? ' order-lg-2 order-md-1' : ''}`}>
                    <div className="zigzag-image">
                      <img src={section.imageUrl} alt={section.imageAlt} className="img-fluid" />
                    </div>
                  </div>
                  <div className={`col-lg-7 col-md-12${isReversed ? ' order-lg-1 order-md-2' : ''}`}>
                    <div className="zigzag-content">
                      <div className="content-header">
                        <h3 className="section-heading">{section.title}</h3>
                        <div className="accent-line"></div>
                      </div>
                      <p className="lead-text">{section.lead}</p>
                      <p className="body-text">{section.body}</p>
                      <div className="highlight-box">
                        <i className={section.highlightIcon}></i>
                        <span>{section.highlightText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
