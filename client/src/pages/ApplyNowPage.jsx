import { useEffect, useRef, useState } from "react";
import ProgressTracker from "../components/ProgressTracker";
import ModernFileUpload from "../components/ModernFileUpload";
import { useApplyNowContent } from "../context/ApplyNowContentContext";
import { applicationsApi } from "../api";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export default function ApplyNowPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";
  const { applyNowContent, fetchApplyNowContent } = useApplyNowContent();
  const inputRefs = useRef({});
  const formRef = useRef(null);
  const sidebarRef = useRef(null);
  const additionalDocsRef = useRef(null);

  // JS-based sticky sidebar — stops when sidebar bottom meets Additional Documents card bottom
  useEffect(() => {
    const TOP_OFFSET = 110; // px below viewport top
    const onScroll = () => {
      const sidebar = sidebarRef.current;
      const form = formRef.current;
      const addDocs = additionalDocsRef.current;
      if (!sidebar) return;
      // Only sticky on large screens where the 2-col grid is active
      if (window.innerWidth < 1024) {
        sidebar.style.transform = 'none';
        return;
      }
      if (!form) return;
      const formRect = form.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const scrolled = -formRect.top + TOP_OFFSET;
      // Max scroll: sidebar bottom aligns with Additional Documents card bottom
      let maxScroll;
      if (addDocs) {
        const addDocsBottom = addDocs.getBoundingClientRect().bottom;
        maxScroll = addDocsBottom - formRect.top - sidebarHeight;
      } else {
        maxScroll = formRect.height - sidebarHeight - 32;
      }
      const translate = Math.max(0, Math.min(scrolled, maxScroll));
      sidebar.style.transform = `translateY(${translate}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  
  // Get dynamic fields from database
  const basicFields = applyNowContent?.basicBlock?.fields || [];
  const requiredDocuments = applyNowContent?.requiredDocsBlock?.documents || [];
  const additionalDocuments = applyNowContent?.additionalDocsBlock?.documents || [];
  
  // Initialize form data from dynamic fields
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    basicFields.forEach(field => {
      initialData[field.key] = "";
    });
    return initialData;
  });
  
  // Initialize file state from dynamic documents
  const [files, setFiles] = useState(() => {
    const allDocs = [...requiredDocuments, ...additionalDocuments];
    return allDocs.reduce((acc, doc) => ({ ...acc, [doc.key]: null }), {});
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBasicKeyDown = (event, fieldKey) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const currentIndex = basicFields.findIndex(f => f.key === fieldKey);
    if (currentIndex >= 0 && currentIndex < basicFields.length - 1) {
      const nextField = basicFields[currentIndex + 1];
      if (inputRefs.current[nextField.key]) {
        inputRefs.current[nextField.key].focus();
      }
    }
  };

  useEffect(() => {
    fetchApplyNowContent();
  }, [fetchApplyNowContent]);

  const setFile = (docKey, file) => {
    // Handle file removal
    if (file === null) {
      setFiles((prev) => ({ ...prev, [docKey]: null }));
      setErrors((prev) => ({ ...prev, [docKey]: undefined }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({ ...prev, [docKey]: `File must be ${MAX_FILE_SIZE_MB}MB or smaller.` }));
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [docKey]: "Only PDF, PNG, or JPG files are allowed." }));
      return;
    }

    setFiles((prev) => ({ ...prev, [docKey]: file }));
    setErrors((prev) => ({ ...prev, [docKey]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    // Validate basic fields
    basicFields.forEach(field => {
      if (field.required && !formData[field.key]?.trim()) {
        nextErrors[field.key] = `${field.label} is required.`;
      }
      if (field.type === "email" && formData[field.key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.key])) {
        nextErrors[field.key] = "Enter a valid email address.";
      }
    });

    // Validate required documents
    requiredDocuments.forEach((doc) => {
      if (doc.required && !files[doc.key]) {
        nextErrors[doc.key] = `${doc.label} is required.`;
      }
    });

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    setSubmitted(true);

    if (Object.keys(nextErrors).length > 0) return;

    const formPayload = new FormData();
    
    // Add all form fields dynamically
    basicFields.forEach(field => {
      if (formData[field.key]) {
        formPayload.append(field.key, formData[field.key]);
      }
    });

    // Add all files
    const allDocs = [...requiredDocuments, ...additionalDocuments];
    allDocs.forEach(doc => {
      if (files[doc.key]) {
        formPayload.append(doc.key, files[doc.key]);
      }
    });

    setIsSubmitting(true);
    setSubmitMessage("");

    applicationsApi.submit(formPayload)
      .then((response) => {
        const data = response.data;
        setSubmitMessage("Application submitted. We will contact you shortly.");

        // Build WhatsApp message dynamically
        const fieldLines = basicFields
          .filter(field => formData[field.key])
          .map(field => `${field.label}: ${formData[field.key]}`)
          .join("\n");

        const allDocsForMessage = [...requiredDocuments, ...additionalDocuments];
        const documentLines = allDocsForMessage
          .filter(doc => files[doc.key])
          .map(doc => `${doc.label}: Attached`)
          .join("\n");

        const whatsappMessage = [
          "*New Application Submission*",
          "",
          fieldLines,
          documentLines ? `\nDocuments:\n${documentLines}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        const whatsappUrl = `https://wa.me/447956273533?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        // Reset form
        const resetData = {};
        basicFields.forEach(field => {
          resetData[field.key] = "";
        });
        setFormData(resetData);
        
        const resetFiles = {};
        allDocs.forEach(doc => {
          resetFiles[doc.key] = null;
        });
        setFiles(resetFiles);
        setErrors({});
        setSubmitted(false);
      })
      .catch((error) => {
        setSubmitMessage(error.message || "Unable to submit application.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCallbackRequest = () => {
    const details = basicFields
      .filter(field => formData[field.key])
      .map(field => `${field.label}: ${formData[field.key]}`)
      .join("\n");

    const whatsappMessage = [
      "*Callback Request*",
      "Please give me a call.",
      "",
      details || "No applicant details provided.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/447956273533?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Render input based on field type
  const renderFieldInput = (field) => {
    if (field.type === "textarea") {
      return (
        <textarea
          name={field.key}
          ref={el => inputRefs.current[field.key] = el}
          value={formData[field.key] || ""}
          onChange={handleChange}
          onKeyDown={(event) => handleBasicKeyDown(event, field.key)}
          placeholder={field.placeholder || ""}
          className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          style={{ color: '#0f172a' }}
        />
      );
    }

    return (
      <input
        name={field.key}
        type={field.type || "text"}
        ref={el => inputRefs.current[field.key] = el}
        value={formData[field.key] || ""}
        onChange={handleChange}
        onKeyDown={(event) => handleBasicKeyDown(event, field.key)}
        placeholder={field.placeholder || ""}
        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        style={{ color: '#0f172a' }}
      />
    );
  };


  return (
    <>
      {/* Breadcrumb Header */}
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/four.png')" }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">{applyNowContent?.breadcrumbTitle || "Apply Now"}</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/"><i className="fa-solid fa-house"></i> Home</a></li>
              <li>/</li>
              <li>{applyNowContent?.breadcrumbTitle || "Apply Now"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Application Form */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-10 max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">{applyNowContent?.introTitle || "Start Your Application"}</h1>
            <p className="text-base text-slate-600 leading-relaxed">
              {applyNowContent?.introSubtitle || "Begin your journey with our premium visa processing service. Fill out the details below to initiate your secure electronic case file."}
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            {/* Left Column - Form Sections */}
            <div className="space-y-6">
              {/* Basic Details Section */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                  <i className="fa-solid fa-user text-slate-700"></i>
                  <h2 className="text-base font-semibold text-slate-900">{applyNowContent?.basicBlock?.title || "Basic Details"}</h2>
                </div>
                
                {basicFields.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No fields configured. Please add fields in the admin panel.</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {basicFields.map((field) => (
                      <div key={field.key} className={
                        // Check if this is a notes, internal notes, or additional info field
                        field.label.toLowerCase().includes('notes') || 
                        field.label.toLowerCase().includes('internal') ||
                        field.label.toLowerCase().includes('additional') ||
                        field.type === 'textarea'
                          ? 'md:col-span-2'
                          : ''
                      }>
                        <div className="space-y-2">
                          <label className="text-sm text-slate-600">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderFieldInput(field)}
                          {errors[field.key] && <p className="text-xs text-red-600">{errors[field.key]}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Required Documents Section */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                  <i className="fa-solid fa-file-lines text-slate-700"></i>
                  <h2 className="text-base font-semibold text-slate-900">{applyNowContent?.requiredDocsBlock?.title || "Required Documents"}</h2>
                </div>
                
                {requiredDocuments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No required documents configured.</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {requiredDocuments.map((doc, index) => (
                      <div key={doc.key} className={
                        // Check if this is a "Proof of Address" or similar long label field
                        doc.label.toLowerCase().includes('proof') || 
                        doc.label.toLowerCase().includes('address') ||
                        doc.label.toLowerCase().includes('bank') ||
                        doc.label.toLowerCase().includes('statement')
                          ? 'md:col-span-2'
                          : ''
                      }>
                        <ModernFileUpload
                          docKey={doc.key}
                          label={doc.label}
                          required={doc.required}
                          files={files}
                          errors={errors}
                          setFile={setFile}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Documents Section */}
              <div ref={additionalDocsRef} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                  <i className="fa-solid fa-circle-plus text-slate-700"></i>
                  <h2 className="text-base font-semibold text-slate-900">{applyNowContent?.additionalDocsBlock?.title || "Additional Documents"}</h2>
                </div>
                
                {additionalDocuments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No additional documents configured.</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {additionalDocuments.map((doc) => (
                      <ModernFileUpload
                        key={doc.key}
                        docKey={doc.key}
                        label={doc.label}
                        required={doc.required}
                        files={files}
                        errors={errors}
                        setFile={setFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Progress & Support */}
            <div ref={sidebarRef}>
              <ProgressTracker
                basicFields={basicFields}
                requiredDocs={requiredDocuments}
                additionalDocs={additionalDocuments}
                formData={formData}
                files={files}
              />
            </div>
          </form>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mt-6 p-4 rounded-lg ${
              Object.keys(errors).length > 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <p className={`text-sm ${
                Object.keys(errors).length > 0 ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {submitMessage}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
