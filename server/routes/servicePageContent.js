const express = require('express');
const router = express.Router();
const ServicePageContent = require('../models/ServicePageContent');
const { protect } = require('../middleware/auth');

const defaultServiceContent = {
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

async function ensureServiceContent() {
  let doc = await ServicePageContent.findOne();
  if (!doc) {
    doc = await ServicePageContent.create(defaultServiceContent);
  }
  return doc;
}

// GET /api/service-content — public
router.get('/', async (req, res) => {
  try {
    const doc = await ensureServiceContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/service-content/admin — admin
router.get('/admin', protect, async (req, res) => {
  try {
    const doc = await ensureServiceContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/service-content — upsert
router.put('/', protect, async (req, res) => {
  try {
    const updated = await ServicePageContent.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
