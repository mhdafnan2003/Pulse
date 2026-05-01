const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide');
const { protect } = require('../middleware/auth');

// GET /api/slides — public, for frontend
router.get('/', async (req, res) => {
  try {
    const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/slides/all — admin: includes inactive
router.get('/all', protect, async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/slides — create (admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, titleHighlight, body, bgImage, gradient, whatsappLink, order, isActive } = req.body;
    const slide = new Slide({ title, titleHighlight, body, bgImage, gradient, whatsappLink, order, isActive });
    const saved = await slide.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/slides/:id — update (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Slide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Slide not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/slides/:id — delete (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json({ message: 'Slide deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
