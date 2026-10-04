import { useState, useEffect } from 'react'

export default function ProcessingState({
  title = 'Analyzing your profile with CareerLens AI...',
  stages = [
    'Extracting document & codebase structure',
    'Auditing technical skill proficiency',
    'Checking ATS compatibility & engineering practices',
    'Synthesizing personalized AI career roadmap',
  ],
}) {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(interval)
  }, [stages.length])

  return (
    <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: 640, margin: '2rem auto' }}>
      {/* Animated Glowing Orb Spinner */}
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem auto' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        />
        <svg
          className="animate-spin-slow"
          viewBox="0 0 80 80"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth="4"
            strokeDasharray="213"
            strokeDashoffset="70"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#ffffff' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '2rem' }}>
        Our multi-agent pipeline is parsing data points and building your architectural review.
      </p>

      {/* Stage Progress List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left', maxWidth: 440, margin: '0 auto' }}>
        {stages.map((stage, idx) => {
          const isDone = idx < activeStage
          const isCurrent = idx === activeStage
          return (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                color: isDone ? '#34d399' : isCurrent ? '#f8fafc' : 'var(--text-muted)',
                fontWeight: isCurrent ? 600 : 400,
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  background: isDone
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isCurrent
                    ? 'rgba(99, 102, 241, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isDone
                    ? '1px solid #10b981'
                    : isCurrent
                    ? '1px solid #6366f1'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isDone ? '#10b981' : isCurrent ? '#818cf8' : 'var(--text-muted)',
                }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span>{stage}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
