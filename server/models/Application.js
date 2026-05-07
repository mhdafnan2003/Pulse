const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: String, default: '', trim: true },
    type: { type: String, default: 'text', trim: true },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    applicantName: { type: String, trim: true },
    applicantEmail: { type: String, lowercase: true, trim: true },
    applicantPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'in-review', 'approved', 'rejected'],
      default: 'new',
    },
    fields: { type: [FieldSchema], default: [] },
    documents: { type: [DocumentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
