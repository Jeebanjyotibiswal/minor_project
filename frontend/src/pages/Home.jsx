import React from 'react'
import ScoreRing from '../components/ScoreRing'

export default function Home({ setView }) {
  const navigate = (v) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '3.5rem 0 4.5rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          {/* Eyebrow Pill */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span className="badge-pill primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              ✦ Next-Generation Career &amp; Profile Intelligence
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Know Where You Stand.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Build What Comes Next.
            </span>
          </h1>

          {/* Subtitle / Tagline */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 760,
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            CareerLens AI audits your <strong>Resume</strong> and <strong>GitHub Codebase</strong> to uncover your strengths, identify critical ATS gaps, and deliver an actionable career roadmap.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <button
              id="hero-resume-btn"
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('resume')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Analyze My Resume</span>
            </button>

            <button
              id="hero-github-btn"
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('github')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>Analyze GitHub Profile</span>
            </button>
          </div>

          {/* Live Product Preview Card Mockup */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              textAlign: 'left',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
                  careerlens.ai/intelligence/live-demo
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge-pill success">Live AI Evaluation</span>
                <span className="badge-pill primary">Groq Powered</span>
              </div>
            </div>

            {/* Mock Dashboard Content Grid */}
            <div className="grid-3" style={{ alignItems: 'stretch' }}>
              {/* Score Widget */}
              <div
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.8rem 1rem',
                  textAlign: 'center',
                }}
              >
                <ScoreRing score={88} size={110} strokeWidth={9} label="ATS Compatibility" />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  Strong keyword density for Full-Stack &amp; AI Roles
                </p>
              </div>

              {/* GitHub Quality Widget */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>GitHub Engineering</span>
                    <span className="badge-pill success" style={{ fontSize: '0.75rem' }}>Top 10%</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    🏆 Flagship Project: AI Workflow
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                    Active commits with verified README, automated unit tests, and structured CI/CD.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge-pill info" style={{ fontSize: '0.75rem' }}>Python</span>
                  <span className="badge-pill info" style={{ fontSize: '0.75rem' }}>FastAPI</span>
                  <span className="badge-pill success" style={{ fontSize: '0.75rem' }}>Docker ✅</span>
                </div>
              </div>

              {/* Action Roadmap Widget */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Roadmap</span>
                    <span className="badge-pill warning" style={{ fontSize: '0.75rem' }}>Actionable</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.3rem' }}>
                    Priority 01: Quantify Impact
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Add measurable performance metrics (e.g., <em>"reduced latency by 35%"</em>) to resume bullet points.
                  </p>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-accent)', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✦ Generated by Llama 3.3 Senior Architect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section style={{ padding: '5rem 0', background: 'rgba(14, 19, 31, 0.4)', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem auto' }}>
            <span className="badge-pill info" style={{ marginBottom: '0.85rem' }}>Platform Intelligence</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1rem' }}>
              Everything needed to elevate your tech career
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              No generic advice. Deep, granular audits comparing your assets against modern tech hiring standards.
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#818cf8', fontSize: '1.3rem' }}>
                📄
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>ATS Parser &amp; Keyword Audit</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Extracts skills, flags missing keywords, and evaluates formatting against Fortune 500 ATS screening algorithms.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#22d3ee', fontSize: '1.3rem' }}>
                🐙
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>Codebase &amp; Repo Health</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Analyzes commit quality, repository activity, documentation presence, and isolates your flagship repository.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#34d399', fontSize: '1.3rem' }}>
                🛠️
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>Engineering Practices</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Checks for Docker containerization, CI/CD pipelines, automated unit tests, and open-source licensing.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#fbbf24', fontSize: '1.3rem' }}>
                🎯
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>Actionable Career Roadmap</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Provides prioritized steps (P1, P2, P3) with specific instructions on what to fix, build, and optimize next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Workflow) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3.5rem auto' }}>
            <span className="badge-pill primary" style={{ marginBottom: '0.85rem' }}>Workflow</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1rem' }}>
              From raw data to instant clarity
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Get comprehensive technical career diagnostics in seconds.
            </p>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', fontSize: '2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.05)', fontFamily: 'var(--font-display)' }}>
                01
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>1. Provide Assets</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Upload your resume PDF or input your public GitHub handle with zero setup required.
              </p>
            </div>

            <div className="glass-card" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', fontSize: '2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.05)', fontFamily: 'var(--font-display)' }}>
                02
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>2. Multi-Agent Audit</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Groq LPU neural inference parses ATS compatibility, repository architecture, and code hygiene.
              </p>
            </div>

            <div className="glass-card" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', fontSize: '2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.05)', fontFamily: 'var(--font-display)' }}>
                03
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>3. Execute Roadmap</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Review scores, fix missing keywords, improve repository practices, and stand out in hiring pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Section (Engineers vs Recruiters) */}
      <section style={{ padding: '4rem 0 6rem 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <span className="badge-pill primary" style={{ marginBottom: '1rem' }}>Commercial Grade</span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '1rem' }}>
                  Built for Engineers &amp; Technical Recruiters Alike
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Whether you are a developer preparing for top-tier tech interviews or an evaluator seeking structured candidate insights without manually reading dozens of repositories, CareerLens AI provides instant, objective clarity.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('resume')}
                  >
                    Start Analysis Free
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('github')}
                  >
                    GitHub Analysis
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.3rem' }}>
                    ✓ For Candidates &amp; Students
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Stop submitting blind applications. Know your exact ATS score and fix weak spots before recruiters review your profile.
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.3rem' }}>
                    ✓ For Evaluators &amp; Mentors
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Get an instant breakdown of candidate engineering standards, codebase activity, and architectural maturity in under 3 seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
