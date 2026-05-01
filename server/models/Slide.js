const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    titleHighlight: {
      type: String,
      trim: true,
      default: '',
    },
    body: {
      type: String,
      required: [true, 'Body text is required'],
      trim: true,
    },
    bgImage: {
      type: String,
      required: [true, 'Background image is required'],
    },
    gradient: {
      type: String,
      default:
        'linear-gradient(90deg, rgba(7, 17, 33, 0.82) 0%, rgba(7, 17, 33, 0.52) 56%, rgba(7, 17, 33, 0.26) 100%)',
    },
    whatsappLink: {
      type: String,
      default: 'https://wa.me/447956273533',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slide', SlideSchema);
