import { createContext, useCallback, useContext, useState } from 'react';
import { aboutContentApi } from '../api';

const AboutContentContext = createContext(null);

const fallbackContent = {
  breadcrumbTitle: 'About us',
  heroEyebrow: 'About Our Company',
  heroTitle: 'PULSE creative & consulting Ltd',
  sections: [
    {
      title: 'Who We Are',
      lead: 'Pulse Creative & Consulting Ltd is a UK-registered consulting firm based in London, England, specialising in comprehensive visa and immigration services.',
      body: 'We specialise in student visa services, skilled worker visa guidance, and legal and compliance consulting for individuals planning to study, work, and settle in the United Kingdom. We support students, graduates, healthcare professionals, engineers, and other skilled workers by providing structured, end-to-end assistance tailored to their specific immigration and career goals.',
      highlightIcon: 'fas fa-check-circle',
      highlightText: 'UK-registered consulting firm with expert guidance',
      imageUrl: '/assets/img/home-1/about/about-1.png',
      imageAlt: 'Who We Are',
    },
    {
      title: 'Our Mission',
      lead: 'Simplifying complex immigration procedures with professionalism and transparency.',
      body: 'Our services focus on simplifying complex immigration procedures, documentation requirements, and compliance obligations. Guided by professionalism, transparency, and accuracy, our mission is to deliver clear, ethical, and reliable advice while safeguarding our clients\' legal rights and long-term professional interests throughout their UK journey.',
      highlightIcon: 'fas fa-lightbulb',
      highlightText: 'Clear, ethical, and reliable immigration guidance',
      imageUrl: '/assets/img/home-1/about/about-2.png',
      imageAlt: 'Our Mission',
    },
    {
      title: 'Our Commitment',
      lead: 'Maintaining the highest standards of integrity and compliance for every client.',
      body: 'We are committed to maintaining the highest standards of integrity and compliance, working closely with relevant institutions, employers, and professional advisers to ensure every application meets current UK immigration regulations. Through personalised consultation and ongoing support, we aim to build long-term relationships with our clients, helping them make informed decisions and move forward with confidence at every stage of their UK study, work, or settlement pathway.',
      highlightIcon: 'fas fa-shield-alt',
      highlightText: 'Long-term partnerships with personalised support',
      imageUrl: '/assets/img/home-1/about/about-3.png',
      imageAlt: 'Our Commitment',
    },
  ],
};

export const AboutContentProvider = ({ children }) => {
  const [aboutContent, setAboutContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAboutContent = useCallback(async (adminMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = adminMode ? await aboutContentApi.getAdmin() : await aboutContentApi.getPublic();
      setAboutContent(res.data || fallbackContent);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load about content');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AboutContentContext.Provider value={{ aboutContent, loading, error, fetchAboutContent, setAboutContent }}>
      {children}
    </AboutContentContext.Provider>
  );
};

export const useAboutContent = () => {
  const ctx = useContext(AboutContentContext);
  if (!ctx) throw new Error('useAboutContent must be used within AboutContentProvider');
  return ctx;
};
