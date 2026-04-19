import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadResume } from "../../features/resume/resumeSlice.js";

const ResumeUploadZone = () => {
  const dispatch = useDispatch();
  const { uploading } = useSelector((s) => s.resume);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Only PDF files are accepted.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("resume", selectedFile);
    dispatch(uploadResume(formData));
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-4 p-10
          rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragActive
            ? "border-indigo-400 bg-indigo-500/10"
            : selectedFile
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-white/20 bg-white/3 hover:border-indigo-500/50 hover:bg-white/5"
          }
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className={`p-4 rounded-2xl ${selectedFile ? "bg-emerald-500/20" : "bg-indigo-500/20"}`}>
          {selectedFile ? (
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-emerald-400 font-semibold">{selectedFile.name}</p>
            <p className="text-slate-400 text-sm mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — Ready to upload
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Drop your resume here</p>
            <p className="text-slate-400 text-sm mt-1">or click to browse — PDF only, max 10MB</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Resume"
          )}
        </button>
      )}
    </div>
  );
};

export default ResumeUploadZone;
