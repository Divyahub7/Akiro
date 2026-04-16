import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, uploadAvatar, clearUserMessages } from "../../features/user/userSlice.js";
import Avatar from "../../components/ui/Avatar.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Card from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import CareerScoreChart from "../../components/charts/CareerScoreChart.jsx";
import { Link } from "react-router-dom";

// ─── Sub-components ────────────────────────────────────────────────────────────

const TagInput = ({ label, items = [], onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) {
      onChange([...items, val]);
    }
    setInput("");
  };

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500
                     px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button onClick={add} variant="outline" size="sm">Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15
                                   border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            {item}
            <button onClick={() => remove(i)} className="hover:text-red-400 transition-colors leading-none">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4 pb-3 border-b border-white/5">
    <h3 className="text-white font-bold text-base">{title}</h3>
    {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, updateLoading, error, successMessage } = useSelector((s) => s.user);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "", headline: "", bio: "", skills: [],
    projects: [], internships: [], certificates: [],
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchProfile());
    return () => dispatch(clearUserMessages());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        projects: profile.projects || [],
        internships: profile.internships || [],
        certificates: profile.certificates || [],
      });
    }
  }, [profile]);

  const handleSave = () => dispatch(updateProfile(form));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    dispatch(uploadAvatar(fd));
  };

  // ── Project / Internship / Certificate list editors ──
  const addProject = () => setForm({
    ...form, projects: [...form.projects, { title: "", description: "", link: "" }]
  });
  const updateProject = (i, field, val) => {
    const updated = [...form.projects];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, projects: updated });
  };
  const removeProject = (i) => setForm({ ...form, projects: form.projects.filter((_, idx) => idx !== i) });

  const addInternship = () => setForm({
    ...form, internships: [...form.internships, { company: "", role: "", duration: "" }]
  });
  const updateInternship = (i, field, val) => {
    const updated = [...form.internships];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, internships: updated });
  };
  const removeInternship = (i) => setForm({ ...form, internships: form.internships.filter((_, idx) => idx !== i) });

  const addCertificate = () => setForm({
    ...form, certificates: [...form.certificates, { name: "", issuer: "", year: new Date().getFullYear() }]
  });
  const updateCertificate = (i, field, val) => {
    const updated = [...form.certificates];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, certificates: updated });
  };
  const removeCertificate = (i) => setForm({ ...form, certificates: form.certificates.filter((_, idx) => idx !== i) });

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "certificates", label: "Certificates" },
  ];

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
          <Link to="/resume" className="text-slate-400 hover:text-white text-sm transition-colors">Resume</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Toast messages */}
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

        {/* Profile header card */}
        <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group flex-shrink-0">
            <Avatar src={profile?.avatar} name={profile?.name || ""} size="xl" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50
                         opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
            >
              Change
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
            <p className="text-indigo-400 text-sm mt-1">{profile?.headline || "Add a headline"}</p>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">{profile?.bio || "Add a bio"}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs capitalize">
                {profile?.role}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs">
                Score: {profile?.careerScore ?? 0}/100
              </span>
            </div>
          </div>

          <Button onClick={handleSave} loading={updateLoading} variant="primary" size="sm">
            Save Changes
          </Button>
        </Card>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 bg-slate-900/50 rounded-2xl border border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <SectionHeader title="Basic Info" subtitle="Your public profile details" />
              <div className="space-y-4">
                <Input label="Full Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Headline" placeholder="e.g. Full Stack Developer | AI Enthusiast"
                  value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500
                               px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </Card>

            <CareerScoreChart
              breakdown={profile?.careerScoreBreakdown || {}}
              total={profile?.careerScore || 0}
              variant="bar"
            />
          </div>
        )}

        {activeTab === "skills" && (
          <Card>
            <SectionHeader title="Skills" subtitle="Press Enter or click Add to add a skill" />
            <TagInput
              label=""
              items={form.skills}
              onChange={(val) => setForm({ ...form, skills: val })}
              placeholder="e.g. React, Node.js, Python..."
            />
          </Card>
        )}

        {activeTab === "projects" && (
          <Card>
            <SectionHeader title="Projects" subtitle="Showcase your work" />
            <div className="space-y-4">
              {form.projects.map((proj, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Project {i + 1}</span>
                    <button onClick={() => removeProject(i)}
                      className="text-slate-500 hover:text-red-400 transition-colors text-sm">Remove</button>
                  </div>
                  <Input placeholder="Project title" value={proj.title}
                    onChange={(e) => updateProject(i, "title", e.target.value)} />
                  <Input placeholder="Short description" value={proj.description}
                    onChange={(e) => updateProject(i, "description", e.target.value)} />
                  <Input placeholder="Link (optional)" value={proj.link}
                    onChange={(e) => updateProject(i, "link", e.target.value)} />
                </div>
              ))}
              <Button onClick={addProject} variant="outline" size="sm">
                + Add Project
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "experience" && (
          <Card>
            <SectionHeader title="Internships & Experience" />
            <div className="space-y-4">
              {form.internships.map((intern, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Internship {i + 1}</span>
                    <button onClick={() => removeInternship(i)}
                      className="text-slate-500 hover:text-red-400 transition-colors text-sm">Remove</button>
                  </div>
                  <Input placeholder="Company name" value={intern.company}
                    onChange={(e) => updateInternship(i, "company", e.target.value)} />
                  <Input placeholder="Role / Position" value={intern.role}
                    onChange={(e) => updateInternship(i, "role", e.target.value)} />
                  <Input placeholder="Duration (e.g. Jun 2024 – Aug 2024)" value={intern.duration}
                    onChange={(e) => updateInternship(i, "duration", e.target.value)} />
                </div>
              ))}
              <Button onClick={addInternship} variant="outline" size="sm">
                + Add Internship
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "certificates" && (
          <Card>
            <SectionHeader title="Certifications" />
            <div className="space-y-4">
              {form.certificates.map((cert, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Certificate {i + 1}</span>
                    <button onClick={() => removeCertificate(i)}
                      className="text-slate-500 hover:text-red-400 transition-colors text-sm">Remove</button>
                  </div>
                  <Input placeholder="Certificate name" value={cert.name}
                    onChange={(e) => updateCertificate(i, "name", e.target.value)} />
                  <Input placeholder="Issuing organization" value={cert.issuer}
                    onChange={(e) => updateCertificate(i, "issuer", e.target.value)} />
                  <Input placeholder="Year" type="number" value={cert.year}
                    onChange={(e) => updateCertificate(i, "year", parseInt(e.target.value))} />
                </div>
              ))}
              <Button onClick={addCertificate} variant="outline" size="sm">
                + Add Certificate
              </Button>
            </div>
          </Card>
        )}

        {/* Floating save */}
        <div className="flex justify-end pb-6">
          <Button onClick={handleSave} loading={updateLoading} size="lg">
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
