// Seed initial slides from the existing HTML content
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Slide = require('./models/Slide');
const ApplyNowContent = require('./models/ApplyNowContent');

const slides = [
  {
    title: 'UK & International Visa Consultancy',
    titleHighlight: 'You Can Trust',
    body: 'We provide professional visa guidance, job application support, and compliance assistance for students, skilled professionals, healthcare workers, engineers, and visitors worldwide.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-1.jpg',
    gradient: 'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)',
    whatsappLink: 'https://wa.me/447956273533',
    order: 1,
    isActive: true,
  },
  {
    title: 'Skilled Worker & Student Visa',
    titleHighlight: 'Support Made Simple',
    body: 'From visa requirements to document checks and application strategy, we help you move forward with confidence at every stage of the process.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-2.jpg',
    gradient: 'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)',
    whatsappLink: 'https://wa.me/447956273533',
    order: 2,
    isActive: true,
  },
  {
    title: 'Tailored Visa Guidance',
    titleHighlight: 'For Your Next Move',
    body: 'Whether you are applying for work, study, or a visit visa, our team helps you prepare a stronger application with practical, personal support.',
    bgImage: '/assets/img/home-1/hero/main-slider-1-3.jpg',
    gradient: 'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)',
    whatsappLink: 'https://wa.me/447956273533',
    order: 3,
    isActive: true,
  },
];

const seed = async () => {
  await connectDB();
  
  // Seed slides
  await Slide.deleteMany({});
  await Slide.insertMany(slides);
  console.log('✅ Seeded 3 slides successfully');
  
  // Seed Apply Now Content
  const existingApplyNowContent = await ApplyNowContent.findOne();
  if (!existingApplyNowContent) {
    await ApplyNowContent.create({
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
    });
    console.log('✅ Seeded Apply Now Content successfully');
  } else {
    console.log('ℹ️  Apply Now Content already exists, skipping...');
  }
  
  process.exit(0);
};

seed();
