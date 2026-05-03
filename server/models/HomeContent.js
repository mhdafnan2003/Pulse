const mongoose = require('mongoose');

const ReasonCardSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ServiceItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    features: { type: [String], default: [] },
  },
  { _id: false }
);

const TestimonialItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    thumb: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const HomeContentSchema = new mongoose.Schema(
  {
    reasonSection: {
      eyebrow: { type: String, default: 'REASON FOR CHOSE US', trim: true },
      title: { type: String, default: 'Building smarter solutions', trim: true },
      titleHighlight: { type: String, default: 'each business.', trim: true },
      description: {
        type: String,
        default: 'We provide innovative and reliable solutions designed to help modern business.',
        trim: true,
      },
      cards: { type: [ReasonCardSchema], default: [] },
    },
    servicesSection: {
      eyebrow: { type: String, default: 'EXPLORE OUR SERVICES', trim: true },
      title: { type: String, default: 'Professional Visa & Immigration', trim: true },
      titleHighlight: { type: String, default: 'Consultancy Services.', trim: true },
      services: { type: [ServiceItemSchema], default: [] },
    },
    testimonialsSection: {
      eyebrow: { type: String, default: 'CLIENT TESTIMONIALS', trim: true },
      title: { type: String, default: 'Client Experiences Inspire', trim: true },
      titleHighlight: { type: String, default: 'Our Success.', trim: true },
      items: { type: [TestimonialItemSchema], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeContent', HomeContentSchema);
