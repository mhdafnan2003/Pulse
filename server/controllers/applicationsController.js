const Application = require('../models/Application');

const buildDocument = (file, label) => {
  if (!file) return null;

  return {
    key: file.fieldname,
    label,
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

const submitApplication = async (req, res) => {
  try {
    const config = req.applyNowConfig;
    const basicFields = config?.basicBlock?.fields || [];
    const requiredDocs = config?.requiredDocsBlock?.documents || [];
    const additionalDocs = config?.additionalDocsBlock?.documents || [];
    const docFields = [...requiredDocs, ...additionalDocs];
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];

    const fields = basicFields.map((field) => ({
      key: field.key,
      label: field.label,
      value: req.body?.[field.key]?.toString() || '',
      type: field.type || 'text',
    }));

    const documents = docFields
      .map((doc) => {
        const file = uploadedFiles.find((item) => item.fieldname === doc.key);
        return buildDocument(file, doc.label);
      })
      .filter(Boolean);

    const nameKey = config?.summaryFields?.nameKey || 'fullName';
    const phoneKey = config?.summaryFields?.phoneKey || 'phone';
    const emailKey = config?.summaryFields?.emailKey || 'email';
    const fieldMap = fields.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {});

    const application = await Application.create({
      applicantName: fieldMap[nameKey] || '',
      applicantPhone: fieldMap[phoneKey] || '',
      applicantEmail: fieldMap[emailKey] || '',
      fields,
      documents,
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch application', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'in-review', 'approved', 'rejected'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
