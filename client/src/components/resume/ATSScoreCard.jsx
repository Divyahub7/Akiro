import React from "react";

const getScoreColor = (score) => {
  if (score >= 75) return { text: "text-emerald-400", bg: "bg-emerald-500", ring: "ring-emerald-500/30" };
  if (score >= 50) return { text: "text-yellow-400", bg: "bg-yellow-500", ring: "ring-yellow-500/30" };
  return { text: "text-red-400", bg: "bg-red-500", ring: "ring-red-500/30" };
};

const getScoreLabel = (score) => {
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

const SectionBar = ({ label, value }) => {
  const colors = getScoreColor(value);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 capitalize">{label}</span>
        <span className={`font-semibold ${colors.text}`}>{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ATSScoreCard = ({ resume }) => {
  if (!resume?.isAnalyzed) return null;

  const { atsScore, sectionScores = {}, overallFeedback } = resume;
  const colors = getScoreColor(atsScore);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-6">
      {/* Circular Score */}
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke={atsScore >= 75 ? "#10b981" : atsScore >= 50 ? "#f59e0b" : "#ef4444"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 64 64)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${colors.text}`}>{atsScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">ATS Score</h3>
          <p className={`text-lg font-semibold ${colors.text}`}>{getScoreLabel(atsScore)}</p>
          {overallFeedback && (
            <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-xs">{overallFeedback}</p>
          )}
        </div>
      </div>

      {/* Section Scores */}
      {Object.keys(sectionScores).length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Section Breakdown</h4>
          {Object.entries(sectionScores).map(([key, val]) => (
            <SectionBar key={key} label={key} value={val} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSScoreCard;
