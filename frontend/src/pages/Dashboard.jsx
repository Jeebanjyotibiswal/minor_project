import React from 'react'
import ScoreRing from '../components/ScoreRing'

export default function Dashboard({ setView }) {
  return (
    <div className="container animate-fade-in" style={{ maxWidth: 1040, padding: '1rem 1.5rem' }}>
      {/* Top Welcome Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(21, 28, 46, 0.95) 0%, rgba(14, 19, 31, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="badge-pill primary" style={{ marginBottom: '0.6rem' }}>
              ✦ Candidate Profile Hub
            </span>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              Career Intelligence Overview
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: 620 }}>
              Synthesize your technical portfolio across ATS resume compatibility, GitHub codebase hygiene, and engineering maturity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setView('resume'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>Audit Resume</span>
              <span>→</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setView('github'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>Audit GitHub</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillars Overview Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Pillar 1: Resume Health */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
          <ScoreRing score={85} size={110} strokeWidth={9} label="ATS Readiness" />
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.3rem' }}>
              Resume Keyword Alignment
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Strong density for Backend & Full-Stack keywords.
            </p>
          </div>
        </div>

        {/* Pillar 2: GitHub Architecture */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
          <ScoreRing score={80} size={110} strokeWidth={9} label="Codebase Quality" />
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.3rem' }}>
              Repository Health
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Verified documentation and active commit patterns.
            </p>
          </div>
        </div>

        {/* Pillar 3: Engineering Standards */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
          <ScoreRing score={70} size={110} strokeWidth={9} label="Practices Audit" />
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.3rem' }}>
              Production Readiness
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Opportunity to add CI/CD and Docker containerization.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          🎯 Recommended Profile Milestones
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Follow this blueprint to rank in the top 5% of candidate screenings
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '1.2rem', color: '#34d399' }}>✓</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                1. Standardize ATS Section Headers
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Use universal headings (Experience, Technical Skills, Education) for 100% parser pass rates.
              </div>
            </div>
            <span className="badge-pill success">Completed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '1.2rem', color: '#818cf8' }}>●</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                2. Add Architecture Diagrams & GIFs to Flagship Repo
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Recruiters spend under 30 seconds scanning repos; visual diagrams prove design maturity instantly.
              </div>
            </div>
            <span className="badge-pill warning">Recommended</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '1.2rem', color: '#64748b' }}>○</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                3. Configure GitHub Actions Workflow for Automated Tests
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Adding a passing build badge demonstrates continuous integration readiness.
              </div>
            </div>
            <span className="badge-pill info">Next Step</span>
          </div>
        </div>
      </div>
    </div>
  )
}
