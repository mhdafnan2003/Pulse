import { createContext, useCallback, useContext, useState } from 'react';
import { homeContentApi } from '../api';

const HomeContentContext = createContext(null);

const fallbackContent = {
  reasonSection: {
    eyebrow: 'REASON FOR CHOSE US',
    title: 'Building smarter solutions',
    titleHighlight: 'each business.',
    description: 'We provide innovative and reliable solutions designed to help modern business.',
    cards: [
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
    ],
  },
  servicesSection: {
    eyebrow: 'EXPLORE OUR SERVICES',
    title: 'Professional Visa & Immigration',
    titleHighlight: 'Consultancy Services.',
    services: [
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
    ],
  },
  testimonialsSection: {
    eyebrow: 'CLIENT TESTIMONIALS',
    title: 'Client Experiences Inspire',
    titleHighlight: 'Our Success.',
    items: [
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
    ],
  },
};

export const HomeContentProvider = ({ children }) => {
  const [homeContent, setHomeContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomeContent = useCallback(async (adminMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = adminMode ? await homeContentApi.getAdmin() : await homeContentApi.getPublic();
      const data = res.data || {};
      setHomeContent({
        ...fallbackContent,
        ...data,
        reasonSection: { ...fallbackContent.reasonSection, ...data.reasonSection },
        servicesSection: { ...fallbackContent.servicesSection, ...data.servicesSection },
        testimonialsSection: { ...fallbackContent.testimonialsSection, ...data.testimonialsSection },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load home content');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <HomeContentContext.Provider value={{ homeContent, loading, error, fetchHomeContent, setHomeContent }}>
      {children}
    </HomeContentContext.Provider>
  );
};

export const useHomeContent = () => {
  const ctx = useContext(HomeContentContext);
  if (!ctx) throw new Error('useHomeContent must be used within HomeContentProvider');
  return ctx;
};
