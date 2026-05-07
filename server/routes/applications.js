const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationsController');
const { validateApplication } = require('../middleware/validateApplication');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/applications'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only PDF, JPG, or PNG files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadFields = upload.any();

router.post('/', uploadFields, validateApplication, submitApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
