const mongoose = require('mongoose');

const ServiceItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    features: { type: [String], default: [] },
  },
  { _id: false }
);

const ServicePageContentSchema = new mongoose.Schema(
  {
    services: { type: [ServiceItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServicePageContent', ServicePageContentSchema);
