import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUserResumes,
  analyzeResume,
  deleteResume,
  setActiveResume,
  clearResumeMessages,
} from "../../features/resume/resumeSlice.js";
import ResumeUploadZone from "../../components/resume/ResumeUploadZone.jsx";
import ATSScoreCard from "../../components/resume/ATSScoreCard.jsx";
import SuggestionList from "../../components/resume/SuggestionList.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { useSelector as useAuth } from "react-redux";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const ResumeListItem = ({ resume, isActive, onSelect, onDelete, onAnalyze, analyzing }) => (
  <div
    onClick={() => onSelect(resume)}
    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
      ${isActive
        ? "bg-indigo-600/20 border border-indigo-500/40"
        : "bg-white/3 border border-transparent hover:bg-white/5 hover:border-white/10"
      }`}
  >
    {/* PDF icon */}
    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center">
      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate">{resume.fileName}</p>
      <p className="text-slate-500 text-xs">{formatDate(resume.createdAt)}</p>
      {resume.isAnalyzed && (
        <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full
          ${resume.atsScore >= 75 ? "bg-emerald-500/15 text-emerald-400" :
            resume.atsScore >= 50 ? "bg-yellow-500/15 text-yellow-400" :
            "bg-red-500/15 text-red-400"}`}>
          ATS {resume.atsScore}
        </span>
      )}
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      {!resume.isAnalyzed && (
        <button
          onClick={(e) => { e.stopPropagation(); onAnalyze(resume._id); }}
          disabled={analyzing}
          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 disabled:opacity-50 transition-colors"
          title="Analyze"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(resume._id); }}
        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
        title="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <p className="text-white font-semibold">No resume selected</p>
    <p className="text-slate-400 text-sm mt-1">Upload a resume or select one from the list</p>
  </div>
);

const ResumeAnalyzerPage = () => {
  const dispatch = useDispatch();
  const { resumes, activeResume, uploading, analyzing, loading, error, successMessage } =
    useSelector((s) => s.resume);
  const profile = useSelector((s) => s.user.profile);

  useEffect(() => {
    dispatch(fetchUserResumes());
    return () => dispatch(clearResumeMessages());
  }, [dispatch]);

  const handleAnalyze = (id) => dispatch(analyzeResume(id));
  const handleDelete = (id) => {
    if (window.confirm("Delete this resume?")) dispatch(deleteResume(id));
  };
  const handleSelect = (resume) => dispatch(setActiveResume(resume));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black">A</span>
          </div>
          <span className="text-white font-black text-xl">Akiro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link to="/profile" className="text-slate-400 hover:text-white text-sm transition-colors">Profile</Link>
          <Avatar src={profile?.avatar} name={profile?.name || ""} size="sm" />
        </div>
      </nav>

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
        <p className="text-slate-400 text-sm mt-1">Upload your resume and get AI-powered ATS analysis instantly</p>
      </div>

      {/* Toast */}
      {(successMessage || error) && (
        <div className="max-w-7xl mx-auto px-6 mt-3">
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-3">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3">
              {error}
            </div>
          )}
        </div>
      )}

      {/* 3-column layout */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 items-start">

        {/* ── Left: Upload + resume list ── */}
        <div className="space-y-5">
          {/* Upload zone */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Upload Resume</h2>
            <ResumeUploadZone />
          </div>

          {/* Resume history */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">My Resumes</h2>
              {resumes.length > 0 && (
                <span className="text-slate-500 text-xs">{resumes.length} file{resumes.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            {loading ? (
              <Spinner className="py-6" />
            ) : resumes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {resumes.map((r) => (
                  <ResumeListItem
                    key={r._id}
                    resume={r}
                    isActive={activeResume?._id === r._id}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onAnalyze={handleAnalyze}
                    analyzing={analyzing}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Center: ATS Score card ── */}
        <div className="space-y-5">
          {activeResume ? (
            <>
              {/* Resume info bar */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{activeResume.fileName}</p>
                    <p className="text-slate-500 text-xs">{formatDate(activeResume.createdAt)}</p>
                  </div>
                </div>
                {!activeResume.isAnalyzed && (
                  <Button
                    onClick={() => handleAnalyze(activeResume._id)}
                    loading={analyzing}
                    size="sm"
                  >
                    {analyzing ? "Analyzing…" : "⚡ Analyze"}
                  </Button>
                )}
                {activeResume.isAnalyzed && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex-shrink-0">
                    ✓ Analyzed
                  </span>
                )}
              </div>

              {/* Analyzing loader */}
              {analyzing && (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-10 flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <div className="text-center">
                    <p className="text-white font-semibold">AI is analyzing your resume</p>
                    <p className="text-slate-400 text-sm mt-1">This usually takes 5–10 seconds…</p>
                  </div>
                </div>
              )}

              {/* ATS Score */}
              {!analyzing && activeResume.isAnalyzed && (
                <ATSScoreCard resume={activeResume} />
              )}

              {/* Not yet analyzed */}
              {!analyzing && !activeResume.isAnalyzed && (
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Ready for analysis</p>
                    <p className="text-slate-400 text-sm mt-1">Click "⚡ Analyze" to get your ATS score and AI feedback</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl">
              <EmptyState />
            </div>
          )}
        </div>

        {/* ── Right: Suggestions ── */}
        <div className="space-y-5">
          {activeResume?.isAnalyzed && !analyzing ? (
            <SuggestionList
              suggestions={activeResume.suggestions || []}
              strengths={activeResume.strengths || []}
              missingKeywords={activeResume.missingKeywords || []}
            />
          ) : (
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-3">AI Feedback</h3>
              <p className="text-slate-500 text-sm">
                Suggestions, strengths, and missing keywords will appear here after analysis.
              </p>
              <div className="mt-4 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-3 rounded-full bg-white/5 ${i === 0 ? "w-full" : i === 1 ? "w-4/5" : i === 2 ? "w-3/4" : "w-2/3"}`} />
                ))}
              </div>
            </div>
          )}

          {/* Tips card */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="text-indigo-400">💡</span> Resume Tips
            </h3>
            <ul className="space-y-2">
              {[
                "Use action verbs like 'Built', 'Led', 'Designed'",
                "Quantify achievements with numbers & metrics",
                "Tailor keywords to the job description",
                "Keep it to 1 page if under 3 years of experience",
                "Include links to GitHub, portfolio, or LinkedIn",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
