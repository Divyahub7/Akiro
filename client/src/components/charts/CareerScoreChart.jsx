import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const CareerScoreChart = ({ breakdown = {}, total = 0, variant = "radar" }) => {
  const data = [
    { subject: "Skills", value: breakdown.skills || 0, max: 25 },
    { subject: "Projects", value: breakdown.projects || 0, max: 30 },
    { subject: "Internships", value: breakdown.internships || 0, max: 30 },
    { subject: "Certificates", value: breakdown.certificates || 0, max: 15 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-800 border border-white/10 rounded-xl p-3 text-sm">
          <p className="text-white font-semibold">{payload[0].payload.subject}</p>
          <p className="text-indigo-400">{payload[0].value} pts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Career Score</h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-indigo-400">{total}</span>
          <span className="text-slate-500 text-sm font-medium">/ 100</span>
        </div>
      </div>

      {variant === "radar" ? (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Breakdown pills */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
        {data.map((item) => (
          <div key={item.subject} className="flex items-center justify-between bg-white/3 rounded-xl px-3 py-2">
            <span className="text-slate-400 text-xs">{item.subject}</span>
            <span className="text-white text-xs font-bold">{item.value}<span className="text-slate-500">/{item.max}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerScoreChart;
