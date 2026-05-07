const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const { protect } = require('../middleware/auth');

const defaultAboutContent = {
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

async function ensureAboutContent() {
  let doc = await AboutContent.findOne();
  if (!doc) {
    doc = await AboutContent.create(defaultAboutContent);
  }
  return doc;
}

router.get('/', async (req, res) => {
  try {
    const doc = await ensureAboutContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin', protect, async (req, res) => {
  try {
    const doc = await ensureAboutContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const updated = await AboutContent.findOneAndUpdate({}, req.body, {
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
