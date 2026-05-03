const mongoose = require('mongoose');

const ContactContentSchema = new mongoose.Schema(
  {
    addressTitle: { type: String, default: 'Our address', trim: true },
    addressLines: {
      type: [String],
      default: ['Pulse Creative & Consulting Ltd', 'Mirror Works, 12 Marshgate Lane', 'London, E15 2NH.'],
    },
    contactTitle: { type: String, default: 'Contact number', trim: true },
    phoneNumbers: { type: [String], default: ['+44 7956 273533'] },
    emails: { type: [String], default: ['info@pulsecc.co.uk', 'admissions@pulsecc.co.uk', 'consult@pulsecc.co.uk'] },
    openHoursTitle: { type: String, default: 'Open hour', trim: true },
    openHoursLines: {
      type: [String],
      default: ['Mon–Fri: 09:00–18:00', 'Saturday: 10:00–15:00', 'Sunday: Closed'],
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.8739425876374!2d-0.013833!3d51.5325642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d3d6c2075e3%3A0xf9b0869c93d3250e!2sWorkspace%C2%AE%20%7C%20Mirror%20Works!5e0!3m2!1sen!2suk!4v1709000000000!5m2!1sen!2suk',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactContent', ContactContentSchema);
