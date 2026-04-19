import React, { useState } from "react";

const SuggestionList = ({ suggestions = [], strengths = [], missingKeywords = [] }) => {
  const [activeTab, setActiveTab] = useState("suggestions");

  const tabs = [
    { id: "suggestions", label: "Suggestions", count: suggestions.length, color: "text-yellow-400" },
    { id: "strengths", label: "Strengths", count: strengths.length, color: "text-emerald-400" },
    { id: "keywords", label: "Missing Keywords", count: missingKeywords.length, color: "text-red-400" },
  ];

  const activeData =
    activeTab === "suggestions" ? suggestions :
    activeTab === "strengths" ? strengths :
    missingKeywords;

  const iconMap = {
    suggestions: (
      <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    strengths: (
      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    keywords: (
      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "bg-white/5 text-white border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-slate-200"
              }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs font-bold ${tab.color}`}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
        {activeData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No items to show.</p>
        ) : (
          activeData.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
              {iconMap[activeTab]}
              <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestionList;
