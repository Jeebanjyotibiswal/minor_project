import React from 'react'

export default function Footer({ setView }) {
  return (
    <footer
      style={{
        background: '#04060a',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '3.5rem 0 2.5rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                CareerLens AI
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Understand where you stand. Know where you lack. Improve where it matters. AI-powered candidate intelligence for modern engineers.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="badge-pill info" style={{ fontSize: '0.7rem' }}>Llama 3.3 70B</span>
              <span className="badge-pill primary" style={{ fontSize: '0.7rem' }}>Groq LPUs</span>
              <span className="badge-pill success" style={{ fontSize: '0.7rem' }}>LangChain</span>
            </div>
          </div>

          {/* Quick Nav Column */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intelligence Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <button
                  type="button"
                  onClick={() => { setView('resume'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
                >
                  📄 Resume ATS Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setView('github'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
                >
                  🐙 GitHub Profile & Code Reviewer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
                >
                  📊 Career Profile Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Capabilities */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Pillars
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>🔍 ATS Keyword Extraction & Gap Audit</li>
              <li>🏛️ Engineering Practices & Architecture Analysis</li>
              <li>⚡ Real-time LPU Multi-Agent Inference</li>
              <li>🎯 Prioritized AI Career Roadmap (P1/P2/P3)</li>
            </ul>
          </div>

          {/* Architecture / Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Project Information
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.8rem' }}>
              Built as a next-gen developer portfolio analyzer. Safe, zero-retention analysis on public data.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Learn Architecture ↗
            </button>
          </div>
        </div>

        {/* Copyright Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '2rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} CareerLens AI. All rights reserved.
          </div>
          <div>
            Empowering developers with commercial-grade profile intelligence.
          </div>
        </div>
      </div>
    </footer>
  )
}
