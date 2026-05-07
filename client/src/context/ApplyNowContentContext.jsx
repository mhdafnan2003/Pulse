import { createContext, useCallback, useContext, useState } from 'react';
import { applyNowContentApi } from '../api';

const ApplyNowContentContext = createContext(null);

const fallbackContent = {
  breadcrumbTitle: 'Apply Now',
  introEyebrow: 'Apply now',
  introTitle: 'Start your application',
  introSubtitle: 'Provide your details and upload the required documents. Our team will review and follow up quickly.',
  basicBlock: {
    title: 'Basic Details',
    subtitle: 'Tell us a bit about yourself so we can begin the assessment.',
    fields: [
      { key: 'fullName', label: 'Full Name', placeholder: 'Jane Doe', type: 'text', required: true },
      { key: 'email', label: 'Email Address', placeholder: 'jane@company.com', type: 'email', required: true },
      { key: 'phone', label: 'Phone Number', placeholder: '+44 7123 456 789', type: 'tel', required: true },
      { key: 'address', label: 'Residential Address', placeholder: '221B Baker Street, London', type: 'text', required: true },
      { key: 'notes', label: 'Additional Notes', placeholder: 'Optional: mention your preferred visa route or deadlines.', type: 'textarea', required: false },
    ],
  },
  requiredDocsBlock: {
    title: 'Required Documents',
    subtitle: 'Upload clear, recent files for each required document.',
    documents: [
      { key: 'eVisa', label: 'eVisa', required: true },
      { key: 'passport', label: 'Passport', required: true },
      { key: 'rightToWork', label: 'Right to Work Share Code', required: true },
      { key: 'niNumber', label: 'National Insurance (NI) Number', required: true },
      { key: 'proofOfAddress', label: 'Proof of Address (Bank Statement or Utility Bill)', required: true },
    ],
  },
  additionalDocsBlock: {
    title: 'Additional Documents (If Available)',
    subtitle: 'These help us speed up your eligibility review.',
    documents: [
      { key: 'policeClearance', label: 'Police Clearance Certificate', required: false },
      { key: 'drivingLicence', label: 'Driving Licence', required: false },
    ],
  },
  summaryTitle: 'Application Summary',
  summarySubtitle: 'Review your progress before submitting.',
  nextStepsTitle: 'What happens next',
  nextStepsText: 'Our team will review your documents and schedule a consultation within 1-2 business days.',
  submitButtonText: 'Submit application',
  helpCardTitle: 'Need help?',
  helpCardSubtitle: 'Talk to a Pulse advisor for document guidance.',
  helpPhone: '+44 7956 273 533',
  helpEmail: 'hello@pulseconsultancy.co.uk',
  callbackButtonText: 'Request a callback',
  summaryFields: {
    nameKey: 'fullName',
    phoneKey: 'phone',
    emailKey: 'email',
  },
};

export const ApplyNowContentProvider = ({ children }) => {
  const [applyNowContent, setApplyNowContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplyNowContent = useCallback(async (adminMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = adminMode ? await applyNowContentApi.getAdmin() : await applyNowContentApi.getPublic();
      setApplyNowContent(res.data || fallbackContent);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load apply now content');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApplyNowContentContext.Provider value={{ applyNowContent, loading, error, fetchApplyNowContent, setApplyNowContent }}>
      {children}
    </ApplyNowContentContext.Provider>
  );
};

export const useApplyNowContent = () => {
  const ctx = useContext(ApplyNowContentContext);
  if (!ctx) throw new Error('useApplyNowContent must be used within ApplyNowContentProvider');
  return ctx;
};
