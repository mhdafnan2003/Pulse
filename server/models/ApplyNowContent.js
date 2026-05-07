const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    placeholder: { type: String, trim: true },
    type: { type: String, default: 'text', trim: true },
    required: { type: Boolean, default: true },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const ApplyNowContentSchema = new mongoose.Schema(
  {
    breadcrumbTitle: { type: String, default: 'Apply Now', trim: true },
    introEyebrow: { type: String, default: 'Apply now', trim: true },
    introTitle: { type: String, default: 'Start your application', trim: true },
    introSubtitle: {
      type: String,
      default: 'Provide your details and upload the required documents. Our team will review and follow up quickly.',
      trim: true,
    },
    basicBlock: {
      title: { type: String, default: 'Basic Details', trim: true },
      subtitle: {
        type: String,
        default: 'Tell us a bit about yourself so we can begin the assessment.',
        trim: true,
      },
      fields: { type: [FieldSchema], default: [] },
    },
    requiredDocsBlock: {
      title: { type: String, default: 'Required Documents', trim: true },
      subtitle: {
        type: String,
        default: 'Upload clear, recent files for each required document.',
        trim: true,
      },
      documents: { type: [DocumentSchema], default: [] },
    },
    additionalDocsBlock: {
      title: { type: String, default: 'Additional Documents (If Available)', trim: true },
      subtitle: {
        type: String,
        default: 'These help us speed up your eligibility review.',
        trim: true,
      },
      documents: { type: [DocumentSchema], default: [] },
    },
    summaryTitle: { type: String, default: 'Application Summary', trim: true },
    summarySubtitle: { type: String, default: 'Review your progress before submitting.', trim: true },
    nextStepsTitle: { type: String, default: 'What happens next', trim: true },
    nextStepsText: {
      type: String,
      default: 'Our team will review your documents and schedule a consultation within 1-2 business days.',
      trim: true,
    },
    submitButtonText: { type: String, default: 'Submit application', trim: true },
    helpCardTitle: { type: String, default: 'Need help?', trim: true },
    helpCardSubtitle: { type: String, default: 'Talk to a Pulse advisor for document guidance.', trim: true },
    helpPhone: { type: String, default: '+44 7956 273 533', trim: true },
    helpEmail: { type: String, default: 'hello@pulseconsultancy.co.uk', trim: true },
    callbackButtonText: { type: String, default: 'Request a callback', trim: true },
    summaryFields: {
      nameKey: { type: String, default: 'fullName', trim: true },
      phoneKey: { type: String, default: 'phone', trim: true },
      emailKey: { type: String, default: 'email', trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApplyNowContent', ApplyNowContentSchema);
