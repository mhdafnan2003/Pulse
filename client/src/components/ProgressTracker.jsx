import { useState } from "react";

export default function ProgressTracker({ basicFields, requiredDocs, additionalDocs, formData, files }) {
  // Calculate progress
  const completedBasicFields = basicFields.filter(f => f.required).filter(f => formData[f.key]?.trim()).length;
  const totalRequiredFields = basicFields.filter(f => f.required).length;
  const basicProgress = totalRequiredFields > 0 ? (completedBasicFields / totalRequiredFields) * 100 : 0;

  const completedDocs = requiredDocs.filter(doc => doc.required).filter(doc => files[doc.key]).length;
  const totalRequiredDocs = requiredDocs.filter(doc => doc.required).length;
  const docsProgress = totalRequiredDocs > 0 ? (completedDocs / totalRequiredDocs) * 100 : 0;

  // Additional docs progress (optional)
  const completedAdditionalDocs = additionalDocs.filter(doc => files[doc.key]).length;
  const totalAdditionalDocs = additionalDocs.length;
  const additionalProgress = totalAdditionalDocs > 0 ? (completedAdditionalDocs / totalAdditionalDocs) * 100 : 0;

  const isBasicComplete = basicProgress === 100;
  const isDocsComplete = docsProgress === 100;
  const isAdditionalComplete = totalAdditionalDocs > 0 && additionalProgress === 100;

  return (
    <div className="space-y-6">
      {/* Application Progress Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Application Progress</h3>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(basicProgress + docsProgress + additionalProgress) / 3}%` }}
            />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {/* Basic Details Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isBasicComplete ? 'bg-emerald-500' : 'bg-slate-200'
              }`}>
                {isBasicComplete ? (
                  <i className="fa-solid fa-check text-white text-xs"></i>
                ) : (
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-slate-700">Basic Details</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              isBasicComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {isBasicComplete ? 'DONE' : `${completedBasicFields}/${totalRequiredFields}`}
            </span>
          </div>

          {/* Required Docs Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isDocsComplete ? 'bg-emerald-500' : 'bg-slate-200'
              }`}>
                {isDocsComplete ? (
                  <i className="fa-solid fa-check text-white text-xs"></i>
                ) : (
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-slate-700">Required Docs</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              isDocsComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {isDocsComplete ? 'DONE' : `${completedDocs}/${totalRequiredDocs} LEFT`}
            </span>
          </div>

          {/* Additional Info Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isAdditionalComplete ? 'bg-emerald-500' : 'bg-slate-200'
              }`}>
                {isAdditionalComplete ? (
                  <i className="fa-solid fa-check text-white text-xs"></i>
                ) : (
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-slate-700">Additional Info</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              isAdditionalComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {isAdditionalComplete ? 'DONE' : (totalAdditionalDocs > 0 ? `${completedAdditionalDocs}/${totalAdditionalDocs}` : 'OPTIONAL')}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 space-y-3">
          <button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Submit Application
          </button>
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            By submitting, you agree to our <a href="/terms-conditions" className="text-blue-600 underline hover:text-blue-700">terms</a> and <a href="/privacy-policy" className="text-blue-600 underline hover:text-blue-700">data privacy</a> policies.
          </p>
        </div>
      </div>
    </div>
  );
}
