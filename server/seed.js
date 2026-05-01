// Seed initial slides from the existing HTML content
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Slide = require('./models/Slide');

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
  await Slide.deleteMany({});
  await Slide.insertMany(slides);
  console.log('✅ Seeded 3 slides successfully');
  process.exit(0);
};

seed();
