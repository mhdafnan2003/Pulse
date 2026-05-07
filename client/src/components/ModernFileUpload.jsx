import { useState } from "react";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export default function ModernFileUpload({ docKey, label, required, files, errors, setFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const error = errors[docKey];
  const selectedFile = files[docKey];

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const [file] = Array.from(event.dataTransfer.files || []);
    if (file) setFile(docKey, file);
  };

  const handleFileChange = (event) => {
    const [file] = Array.from(event.target.files || []);
    if (file) setFile(docKey, file);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(docKey, null);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {selectedFile ? (
        // File uploaded state
        <div className="relative border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-lg p-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-file-circle-check text-emerald-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-slate-400 hover:text-red-600 text-xs"></i>
          </button>
        </div>
      ) : (
        // Upload state
        <label
          className={`block cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : error 
                ? 'border-red-300 bg-red-50' 
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-slate-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Click to upload</p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, JPG, PNG (MAX {MAX_FILE_SIZE_MB}MB)
              </p>
            </div>
          </div>
        </label>
      )}
      
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
