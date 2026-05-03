import { createContext, useCallback, useContext, useState } from 'react';
import { serviceContentApi } from '../api';

const ServiceContentContext = createContext(null);

const fallbackContent = {
  services: [
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
  ],
};

export const ServiceContentProvider = ({ children }) => {
  const [serviceContent, setServiceContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServiceContent = useCallback(async (adminMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = adminMode ? await serviceContentApi.getAdmin() : await serviceContentApi.getPublic();
      setServiceContent(res.data || fallbackContent);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service content');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ServiceContentContext.Provider value={{ serviceContent, loading, error, fetchServiceContent, setServiceContent }}>
      {children}
    </ServiceContentContext.Provider>
  );
};

export const useServiceContent = () => {
  const ctx = useContext(ServiceContentContext);
  if (!ctx) throw new Error('useServiceContent must be used within ServiceContentProvider');
  return ctx;
};
