import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../../features/user/userSlice.js";
import { fetchUserResumes } from "../../features/resume/resumeSlice.js";
import CareerScoreChart from "../../components/charts/CareerScoreChart.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Card from "../../components/ui/Card.jsx";

const StatCard = ({ label, value, icon, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </Card>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.user);
  const { resumes } = useSelector((s) => s.resume);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchUserResumes());
  }, [dispatch]);

  if (loading && !dashboard) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const recentResume = resumes[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black">A</span>
          </div>
          <span className="text-white font-black text-xl">Akiro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/resume" className="text-slate-400 hover:text-white text-sm transition-colors">Resume</Link>
          <Link to="/profile" className="text-slate-400 hover:text-white text-sm transition-colors">Profile</Link>
          <Avatar src={dashboard?.avatar} name={dashboard?.name || ""} size="sm" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Welcome */}
        <div className="flex items-center gap-4 pt-2">
          <Avatar src={dashboard?.avatar} name={dashboard?.name || ""} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey, {dashboard?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-slate-400 text-sm capitalize">
              {dashboard?.role} · Member since {dashboard?.memberSince ? new Date(dashboard.memberSince).getFullYear() : "—"}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Skills"
            value={dashboard?.skillsCount ?? 0}
            color="bg-blue-500/15"
            icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>}
          />
          <StatCard
            label="Projects"
            value={dashboard?.projectsCount ?? 0}
            color="bg-emerald-500/15"
            icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          />
          <StatCard
            label="Internships"
            value={dashboard?.internshipsCount ?? 0}
            color="bg-yellow-500/15"
            icon={<svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            label="Certificates"
            value={dashboard?.certificatesCount ?? 0}
            color="bg-purple-500/15"
            icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Career Score Chart */}
          <CareerScoreChart
            breakdown={dashboard?.careerScoreBreakdown || {}}
            total={dashboard?.careerScore || 0}
            variant="radar"
          />

          {/* Quick actions */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg">Quick Actions</h2>
            <Link to="/resume"
              className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/30
                         hover:bg-indigo-600/30 transition-all duration-200 group">
              <div className="p-3 rounded-xl bg-indigo-500/20">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">Analyze Resume</p>
                <p className="text-slate-400 text-sm">Get AI-powered ATS feedback</p>
              </div>
              <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/profile"
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50
                         hover:border-indigo-500/30 transition-all duration-200 group">
              <div className="p-3 rounded-xl bg-slate-700/50">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">Update Profile</p>
                <p className="text-slate-400 text-sm">Add skills, projects & experience</p>
              </div>
              <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Latest Resume ATS score */}
            {recentResume?.isAnalyzed && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Latest Resume</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate max-w-[200px]">{recentResume.fileName}</p>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                    recentResume.atsScore >= 75 ? "bg-emerald-500/20 text-emerald-400" :
                    recentResume.atsScore >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    ATS: {recentResume.atsScore}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
