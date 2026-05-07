const mongoose = require('mongoose');

const AboutSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    lead: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    highlightIcon: { type: String, default: 'fas fa-check-circle', trim: true },
    highlightText: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    imageAlt: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const AboutContentSchema = new mongoose.Schema(
  {
    breadcrumbTitle: { type: String, default: 'About us', trim: true },
    heroEyebrow: { type: String, default: 'About Our Company', trim: true },
    heroTitle: { type: String, default: 'PULSE creative & consulting Ltd', trim: true },
    sections: { type: [AboutSectionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutContent', AboutContentSchema);
