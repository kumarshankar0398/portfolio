import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

// ✅ FIX: EmailJS initialize kiya — yahi problem thi!
emailjs.init('33AvGzLqBR57BTLZ0');

// const API = "http://localhost:8000";
const API = "https://shankar-kumar-portfolio-api.onrender.com";
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);
  return { data, loading };
};

const NAV_ITEMS = ["Home", "Skills", "Projects", "Experience", "Contact"];

const SKILL_COLORS = {
  Languages: "#6366f1",
  Frameworks: "#0ea5e9",
  "AI/ML": "#a855f7",
  Databases: "#10b981",
  "Cloud & DevOps": "#f59e0b",
  Tools: "#ef4444",
};

const PROJECT_CATEGORY_COLORS = {
  Government: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  AI: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  Enterprise: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};

export default function App() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState(new Set());
  const skillsRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/profile`).then((r) => r.json()),
      fetch(`${API}/api/skills`).then((r) => r.json()),
      fetch(`${API}/api/projects`).then((r) => r.json()),
      fetch(`${API}/api/experience`).then((r) => r.json()),
      fetch(`${API}/api/stats`).then((r) => r.json()),
    ]).then(([p, s, pr, ex, st]) => {
      setProfile(p);
      setSkills(s);
      setProjects(pr);
      setExperience(ex);
      setStats(st);
    });
  }, []);

  useEffect(() => {
    if (!skillsRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              setVisibleSkills((prev) => new Set([...prev, e.target.dataset.name]));
            }, parseInt(e.target.dataset.delay || 0));
          }
        });
      },
      { threshold: 0.1 }
    );
    skillsRef.current.querySelectorAll("[data-name]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [skills]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  // ✅ FIX: Clean handleContact — init upar ho gaya, yahan sirf send()
  const handleContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus(null);
    try {
      const result = await emailjs.send(
        'service_ngdmdvi',
        'template_v56sdx9',
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
        }
      );
      if (result.status === 200) {
        setFormStatus({ ok: true, msg: `Thanks ${form.name}! I'll get back to you soon.` });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus({ ok: false, msg: "Something went wrong. Please try again." });
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setFormStatus({ ok: false, msg: "Something went wrong. Please try again." });
    }
    setSubmitting(false);
  };

  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const skillCategories = [...new Set(skills.map((s) => s.category))];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .nav-link { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 500; color: #94a3b8; padding: 6px 14px; border-radius: 8px; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { color: #f8fafc; background: rgba(255,255,255,0.07); }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 12px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: transform 0.2s, opacity 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; transition: border-color 0.2s, transform 0.2s; }
        .card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-3px); }
        .section { padding: 96px 0; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(32px, 4vw, 48px); font-weight: 800; background: linear-gradient(135deg, #f8fafc, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
        .section-sub { color: #64748b; font-size: 16px; margin-bottom: 56px; }
        .tech-tag { display: inline-flex; align-items: center; background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.25); border-radius: 6px; font-size: 12px; font-weight: 500; padding: 3px 10px; }
        .skill-bar-bg { background: rgba(255,255,255,0.06); border-radius: 100px; height: 6px; overflow: hidden; }
        .skill-bar-fill { height: 100%; border-radius: 100px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .timeline-line { position: absolute; left: 20px; top: 40px; bottom: 0; width: 1px; background: linear-gradient(to bottom, rgba(99,102,241,0.6), transparent); }
        .timeline-dot { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #6366f1; background: #0a0a0f; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        input, textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #e2e8f0; font-family: inherit; font-size: 15px; padding: 12px 16px; width: 100%; outline: none; transition: border-color 0.2s; }
        input:focus, textarea:focus { border-color: #6366f1; }
        input::placeholder, textarea::placeholder { color: #475569; }
        .filter-btn { background: none; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 7px 18px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .filter-btn.active, .filter-btn:hover { background: #6366f1; border-color: #6366f1; color: white; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); border-radius: 100px; padding: 6px 16px; font-size: 13px; color: #a5b4fc; margin-bottom: 24px; }
        .stat-card { text-align: center; padding: 32px 20px; }
        .stat-number { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { color: #64748b; font-size: 13px; margin-top: 4px; }
        .glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.15; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(10,10,15,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SK</span>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <button key={item} className={`nav-link ${active === item ? "active" : ""}`} onClick={() => scrollTo(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="Home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        <div className="glow" style={{ width: 500, height: 500, background: "#6366f1", top: "10%", left: "60%" }} />
        <div className="glow" style={{ width: 300, height: 300, background: "#a855f7", top: "50%", left: "20%" }} />
        <div className="container" style={{ animation: "fadeUp 0.8s ease both", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>

            {/* Left — text content */}
            <div style={{ flex: "1 1 480px" }}>
              <div className="hero-badge">
                <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                Available for opportunities
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.05, marginBottom: 20 }}>
                <span style={{ display: "block", background: "linear-gradient(135deg, #f8fafc 40%, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {profile?.name || "Shankar Kumar"}
                </span>
              </h1>
              <p style={{ fontSize: "clamp(16px, 2.2vw, 22px)", color: "#94a3b8", fontWeight: 300, marginBottom: 16, maxWidth: 560 }}>
                Python Developer building <span style={{ color: "#a5b4fc", fontWeight: 500 }}>AI-powered</span> &amp; <span style={{ color: "#a5b4fc", fontWeight: 500 }}>government-grade</span> web systems
              </p>
              <p style={{ color: "#475569", fontSize: 15, marginBottom: 40, maxWidth: 540, lineHeight: 1.7 }}>
                Django · Flask · REST API · NLP · AWS · Docker
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
                <button onClick={() => scrollTo("Contact")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", padding: "12px 28px", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.2s" }}>
                  Get in Touch
                </button>
                <a
                  href={`${API}/static/resume.pdf`}
                  download="Shankar_Kumar_Resume.pdf"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "background 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Resume
                </a>
              </div>
              {stats && (
                <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
                  {[
                    { n: `${stats.years_experience}+`, l: "Years Experience" },
                    { n: `${stats.projects_delivered}`, l: "Projects Delivered" },
                    { n: stats.efficiency_improvement, l: "Efficiency Gain" },
                    { n: stats.delivery_time_reduction, l: "Faster Delivery" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.n}</div>
                      <div style={{ color: "#475569", fontSize: 13, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — profile photo */}
            <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                {/* Glowing ring */}
                <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7, #0ea5e9)", zIndex: 0, animation: "spin 6s linear infinite" }} />
                <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: "#0a0a0f", zIndex: 1 }} />
                <img
                  src={`${API}/static/profile.jpg`}
                  alt="Shankar Kumar"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                  style={{ width: 260, height: 260, borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 2, display: "block" }}
                />
                {/* Fallback initials avatar */}
                <div style={{ width: 260, height: 260, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "2px solid rgba(99,102,241,0.3)", display: "none", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, color: "#6366f1" }}>
                  SK
                </div>
                {/* Online badge */}
                <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 3, background: "#0a0a0f", borderRadius: 100, padding: "6px 14px", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 500 }}>Open to work</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>

      {/* Skills */}
      <section id="Skills" className="section" ref={skillsRef}>
        <div className="container">
          <p className="section-sub" style={{ textTransform: "uppercase", letterSpacing: 3, fontSize: 12, color: "#6366f1", marginBottom: 8 }}>Expertise</p>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-sub">Technologies I work with daily</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {skillCategories.map((cat) => (
              <div key={cat} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: SKILL_COLORS[cat] || "#6366f1" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{cat}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {skills.filter((s) => s.category === cat).map((skill, i) => (
                    <div key={skill.name} data-name={skill.name} data-delay={i * 60}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, color: "#cbd5e1" }}>{skill.name}</span>
                        <span style={{ fontSize: 12, color: "#475569" }}>{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <div className="skill-bar-fill" style={{ width: visibleSkills.has(skill.name) ? `${skill.level}%` : "0%", background: `linear-gradient(90deg, ${SKILL_COLORS[cat] || "#6366f1"}, ${SKILL_COLORS[cat] || "#6366f1"}99)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="Projects" className="section" style={{ background: "rgba(99,102,241,0.03)" }}>
        <div className="container">
          <p className="section-sub" style={{ textTransform: "uppercase", letterSpacing: 3, fontSize: 12, color: "#6366f1", marginBottom: 8 }}>Portfolio</p>
          <h2 className="section-title">Key Projects</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {filteredProjects.map((proj) => {
              const catStyle = PROJECT_CATEGORY_COLORS[proj.category] || { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" };
              return (
                <div key={proj.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.3 }}>{proj.title}</h3>
                    <span style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{proj.category}</span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{proj.description}</p>
                  <ul style={{ paddingLeft: 0, marginBottom: 20, flex: 1 }}>
                    {proj.highlights.map((h, i) => (
                      <li key={i} style={{ listStyle: "none", fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 6, paddingLeft: 18, position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: 7, width: 5, height: 5, background: "#6366f1", borderRadius: "50%", display: "block" }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {proj.tech.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="Experience" className="section">
        <div className="container">
          <p className="section-sub" style={{ textTransform: "uppercase", letterSpacing: 3, fontSize: 12, color: "#6366f1", marginBottom: 8 }}>Career</p>
          <h2 className="section-title">Experience</h2>
          <p className="section-sub">Where I've built things that matter</p>
          <div style={{ position: "relative" }}>
            <div className="timeline-line" />
            <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingLeft: 64 }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                  <div className="timeline-dot" style={{ position: "absolute", left: -64, top: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: exp.current ? "#6366f1" : "#334155" }} />
                  </div>
                  <div className="card">
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9" }}>{exp.role}</h3>
                          {exp.current && <span style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>Current</span>}
                        </div>
                        <p style={{ color: "#6366f1", fontSize: 15, fontWeight: 500, marginTop: 2 }}>{exp.company}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#94a3b8", fontSize: 14 }}>{exp.period}</p>
                        <p style={{ color: "#475569", fontSize: 13 }}>{exp.location}</p>
                      </div>
                    </div>
                    <ul style={{ paddingLeft: 0 }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ listStyle: "none", fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 8, paddingLeft: 20, position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: 9, width: 5, height: 5, background: "#6366f1", borderRadius: "50%", display: "block" }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 24 }}>Education</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                { degree: "Master of Computer Applications (MCA)", school: "IGNOU, New Delhi", year: "Apr 2022" },
                { degree: "Bachelor of Computer Applications (BCA)", school: "IGNOU, New Delhi", year: "Jun 2018" },
              ].map((ed) => (
                <div key={ed.degree} className="card">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 18 }}>🎓</div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 6 }}>{ed.degree}</p>
                  <p style={{ color: "#6366f1", fontSize: 14 }}>{ed.school}</p>
                  <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>{ed.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="Contact" className="section" style={{ background: "rgba(99,102,241,0.03)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="section-sub" style={{ textTransform: "uppercase", letterSpacing: 3, fontSize: 12, color: "#6366f1", marginBottom: 8 }}>Contact</p>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-sub">Have a project in mind? Let's build something great.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 40 }}>
            {[
              { icon: "📧", label: "Email", value: "shankarkm1707@gmail.com" },
              { icon: "📱", label: "Phone", value: "+91 9650360813" },
              { icon: "📍", label: "Location", value: "Greater Noida, Delhi NCR" },
            ].map((c) => (
              <div key={c.label} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <p style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>{c.label}</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <form onSubmit={handleContact}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={{ marginBottom: 16 }} required />
              <textarea placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} style={{ marginBottom: 20 }} required />
              {formStatus && (
                <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: formStatus.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: formStatus.ok ? "#4ade80" : "#f87171", fontSize: 14, border: `1px solid ${formStatus.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                  {formStatus.msg}
                </div>
              )}
              <button className="btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
                {submitting ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ color: "#334155", fontSize: 13 }}>
          Built with <span style={{ color: "#6366f1" }}>FastAPI + React</span> · Shankar Kumar © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
