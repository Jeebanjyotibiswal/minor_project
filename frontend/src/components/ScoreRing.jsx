import React from 'react'

export default function ScoreRing({ score = 0, size = 120, strokeWidth = 10, label = 'ATS Score' }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeScore / 100) * circumference

  // Dynamic color based on score tier
  let strokeColor = '#10b981' // emerald for 75+
  let glowColor = 'rgba(16, 185, 129, 0.35)'
  let statusText = 'Excellent'

  if (safeScore < 50) {
    strokeColor = '#f43f5e' // rose
    glowColor = 'rgba(244, 63, 94, 0.35)'
    statusText = 'Needs Work'
  } else if (safeScore < 75) {
    strokeColor = '#f59e0b' // amber
    glowColor = 'rgba(245, 158, 11, 0.35)'
    statusText = 'Moderate'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: size * 0.26, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {safeScore}
          </span>
          <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            / 100
          </span>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strokeColor, textTransform: 'uppercase' }}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  )
}
