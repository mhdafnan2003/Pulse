const fs = require('fs');
const ApplyNowContent = require('../models/ApplyNowContent');

const cleanupFiles = (files = []) => {
  files.forEach((file) => {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlink(file.path, () => {});
    }
  });
};

const validateApplication = async (req, res, next) => {
  const errors = {};
  let config;

  try {
    config = await ApplyNowContent.findOne();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load application configuration' });
  }

  const basicFields = config?.basicBlock?.fields || [];
  const requiredDocs = config?.requiredDocsBlock?.documents || [];
  const additionalDocs = config?.additionalDocsBlock?.documents || [];
  const docFields = [...requiredDocs, ...additionalDocs];
  const uploadedFiles = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();

  basicFields.forEach((field) => {
    if (field.required && !req.body?.[field.key]?.toString().trim()) {
      errors[field.key] = `${field.label} is required.`;
    }
    if (field.type === 'email' && req.body?.[field.key]) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body[field.key])) {
        errors[field.key] = 'Enter a valid email address.';
      }
    }
  });

  requiredDocs.forEach((doc) => {
    const hasFile = uploadedFiles.some((file) => file.fieldname === doc.key);
    if (doc.required && !hasFile) {
      errors[doc.key] = `${doc.label} document is required.`;
    }
  });

  uploadedFiles.forEach((file) => {
    if (!docFields.some((doc) => doc.key === file.fieldname)) {
      errors[file.fieldname] = 'File field is not allowed.';
    }
  });

  if (Object.keys(errors).length > 0) {
    cleanupFiles(uploadedFiles);
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  req.applyNowConfig = config;
  return next();
};

module.exports = { validateApplication };
