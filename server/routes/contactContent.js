const express = require('express');
const router = express.Router();
const ContactContent = require('../models/ContactContent');
const { protect } = require('../middleware/auth');

const defaultContactContent = {
  addressTitle: 'Our address',
  addressLines: ['Pulse Creative & Consulting Ltd', 'Mirror Works, 12 Marshgate Lane', 'London, E15 2NH.'],
  contactTitle: 'Contact number',
  phoneNumbers: ['+44 7956 273533'],
  emails: ['info@pulsecc.co.uk', 'admissions@pulsecc.co.uk', 'consult@pulsecc.co.uk'],
  openHoursTitle: 'Open hour',
  openHoursLines: ['Mon–Fri: 09:00–18:00', 'Saturday: 10:00–15:00', 'Sunday: Closed'],
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.8739425876374!2d-0.013833!3d51.5325642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d3d6c2075e3%3A0xf9b0869c93d3250e!2sWorkspace%C2%AE%20%7C%20Mirror%20Works!5e0!3m2!1sen!2suk!4v1709000000000!5m2!1sen!2suk',
};

async function ensureContactContent() {
  let doc = await ContactContent.findOne();
  if (!doc) {
    doc = await ContactContent.create(defaultContactContent);
  }
  return doc;
}

// GET /api/contact-content — public
router.get('/', async (req, res) => {
  try {
    const doc = await ensureContactContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/contact-content/admin — admin
router.get('/admin', protect, async (req, res) => {
  try {
    const doc = await ensureContactContent();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/contact-content — upsert
router.put('/', protect, async (req, res) => {
  try {
    const updated = await ContactContent.findOneAndUpdate({}, req.body, {
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
