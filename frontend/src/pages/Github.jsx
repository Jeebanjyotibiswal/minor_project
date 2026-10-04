import { useState } from 'react'
import ProcessingState from '../components/ProcessingState'
import ScoreRing from '../components/ScoreRing'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function GithubAnalyzer({ onBack, onNavigateResume }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const sampleUsers = ['JanmejaySamal', 'torvalds', 'shadcn', 'facebook']

  const handleSearch = async (userToSearch) => {
    const targetUser = (userToSearch || username).trim()
    setError('')
    setResult(null)

    if (!targetUser) {
      setError('Please enter a GitHub username or organization handle.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/github-analyzer?username=${encodeURIComponent(targetUser)}`)
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.detail || `Analysis failed (${response.status}): ${response.statusText}`)
      } else {
        setResult(payload)
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to connect to the backend AI service.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(username)
  }

  const handleReset = () => {
    setUsername('')
    setResult(null)
    setError('')
  }

  // Score breakdown bar
  const ScoreBar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(value / max) * 100}%`,
          background: color || 'var(--gradient-brand)',
          borderRadius: 999,
          transition: 'width 0.8s ease-out',
        }} />
      </div>
    </div>
  )

  const scoreData = result?.github_score
  const breakdownMaxes = {
    'Profile Completeness': 10,
    'Community Presence': 15,
    'Repository Quality': 35,
    'Commit Activity': 25,
    'Language Diversity': 15,
  }
  const breakdownColors = {
    'Profile Completeness': '#818cf8',
    'Community Presence': '#22d3ee',
    'Repository Quality': '#10b981',
    'Commit Activity': '#f59e0b',
    'Language Diversity': '#a78bfa',
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: 1040, padding: '1rem 1.5rem' }}>
      {/* Top Header / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onBack}>
          <span>← Back Home</span>
        </button>
        <div className="badge-pill primary">
          <span>🐙 GitHub Codebase &amp; Architecture Intelligence</span>
        </div>
      </div>

      {/* Input / Search Workspace */}
      {!loading && !result && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              Analyze GitHub Profile &amp; Repositories
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Deep technical analysis of codebase structure, activity patterns, engineering practices, and AI architecture reviews.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}
              >
                github.com/
              </span>
              <input
                id="github-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                style={{
                  paddingLeft: '7.8rem',
                  fontSize: '1.05rem',
                  height: '3.2rem',
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Quick sample chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try demo:</span>
                {sampleUsers.map((user) => (
                  <button
                    key={user}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                    onClick={() => {
                      setUsername(user)
                      handleSearch(user)
                    }}
                  >
                    @{user}
                  </button>
                ))}
              </div>

              <button id="github-analyze-btn" type="submit" className="btn btn-primary btn-lg" style={{ minWidth: 190 }}>
                <span>Analyze Profile</span>
                <span>→</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="alert-banner error">
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div>
                <strong>Analysis Notice:</strong> {error}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Experience */}
      {loading && (
        <ProcessingState
          title="Auditing GitHub Profile &amp; Codebase Architecture..."
          stages={[
            'Fetching public repositories, commit trees &amp; branch stats',
            'Evaluating engineering practices (Tests, CI/CD, README)',
            'Isolating flagship &amp; top repositories by impact',
            'Synthesizing senior architecture review with AI',
            'Calculating your GitHub Developer Score',
          ]}
        />
      )}

      {/* Results Analytics Dashboard */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* ═══════════════════════════════
              GITHUB DEVELOPER SCORE — TOP HERO
          ═══════════════════════════════ */}
          {scoreData && (
            <div
              className="glass-panel"
              style={{
                padding: '2.5rem',
                background: 'linear-gradient(135deg, rgba(21, 28, 46, 0.97) 0%, rgba(14, 19, 31, 0.97) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
                <span className="badge-pill primary" style={{ fontSize: '0.8rem' }}>
                  ✦ Overall GitHub Developer Score
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '1.5rem 0' }}>
                {/* Big Score Ring */}
                <ScoreRing score={scoreData.score} size={160} strokeWidth={12} label="GitHub Score" />

                {/* Grade + Breakdown */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff', lineHeight: 1 }}>
                      {scoreData.grade}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                      — {scoreData.grade_label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Calculated from profile completeness, community presence, repository quality, commit activity, and language diversity.
                  </p>

                  {/* Score Breakdown bars */}
                  {scoreData.breakdown && Object.entries(scoreData.breakdown).map(([key, val]) => (
                    <ScoreBar
                      key={key}
                      label={key}
                      value={val}
                      max={breakdownMaxes[key] || 10}
                      color={breakdownColors[key]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Candidate Profile Header Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(21, 28, 46, 0.95) 0%, rgba(14, 19, 31, 0.95) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {result.profile?.avatar_url && (
                <img
                  src={result.profile.avatar_url}
                  alt={result.profile.name || 'avatar'}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: '3px solid #6366f1',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                  }}
                />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.75rem', color: '#ffffff', margin: 0 }}>
                    {result.profile?.name || result.profile?.username}
                  </h2>
                  {result.profile?.html_url && (
                    <a
                      href={result.profile.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="badge-pill primary"
                      style={{ textDecoration: 'none' }}
                    >
                      @{result.profile?.username} ↗
                    </a>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.4rem 0 0.8rem 0' }}>
                  {result.profile?.bio || 'Full-stack & Software Engineer'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge-pill info">⭐ {result.profile?.followers ?? 0} Followers</span>
                  <span className="badge-pill info">👥 {result.profile?.following ?? 0} Following</span>
                  <span className="badge-pill primary">📦 {result.profile?.public_repos ?? 0} Public Repos</span>
                  {result.profile?.location && result.profile.location !== 'N/A' && (
                    <span className="badge-pill">📍 {result.profile.location}</span>
                  )}
                  {result.profile?.company && result.profile.company !== 'N/A' && (
                    <span className="badge-pill">🏢 {result.profile.company}</span>
                  )}
                  {result.profile?.blog && result.profile.blog !== 'N/A' && (
                    <a href={result.profile.blog} target="_blank" rel="noreferrer" className="badge-pill info" style={{ textDecoration: 'none' }}>
                      🔗 Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              <span>Search Another Profile</span>
            </button>
          </div>

          {/* Strongest / Flagship Repository Spotlight */}
          {result.strongest_repo && (
            <div
              className="glass-card"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge-pill warning" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  🏆 Flagship / Most Impactful Repository
                </span>
                <span className={`badge-pill ${result.strongest_repo.activity === 'Active' ? 'success' : result.strongest_repo.activity === 'Inactive' ? 'warning' : 'danger'}`}>
                  ● {result.strongest_repo.activity}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                <a
                  href={result.strongest_repo.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#ffffff', textDecoration: 'none' }}
                >
                  {result.strongest_repo.name} <span style={{ color: '#818cf8', fontSize: '1.1rem' }}>↗</span>
                </a>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {result.strongest_repo.description || 'No description provided on repository.'}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <span className="badge-pill info">💻 {result.strongest_repo.language || 'Codebase'}</span>
                <span className="badge-pill primary">⭐ {result.strongest_repo.stars} Stars</span>
                <span className="badge-pill primary">🍴 {result.strongest_repo.forks} Forks</span>
                <span className="badge-pill warning">⚠️ {result.strongest_repo.issues} Open Issues</span>
                <span className="badge-pill success">{result.strongest_repo.readme ? '✅ Verified README' : '❌ No README'}</span>
                <span className="badge-pill">{result.strongest_repo.testing ? '✅ Automated Tests' : '⚪ Limited Tests'}</span>
                {result.strongest_repo.license && (
                  <span className="badge-pill info">📜 {result.strongest_repo.license}</span>
                )}
              </div>
            </div>
          )}

          {/* All Analyzed Repositories Fleet Grid */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Repository Fleet Overview</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Audited active repositories and technical implementation signals
                </p>
              </div>
              <span className="badge-pill primary">
                {result.repo_analysis?.length || 0} Repositories Audited
              </span>
            </div>

            {Array.isArray(result.repo_analysis) && result.repo_analysis.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {result.repo_analysis.map((repo) => (
                  <div
                    key={repo.name}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                          <a href={repo.url} target="_blank" rel="noreferrer" style={{ color: '#9aa5ff', textDecoration: 'none' }}>
                            {repo.name} ↗
                          </a>
                        </h4>
                        <span className={`badge-pill ${repo.activity === 'Active' ? 'success' : repo.activity === 'Inactive' ? 'warning' : 'danger'}`} style={{ fontSize: '0.7rem' }}>
                          {repo.activity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {repo.description || 'No description provided.'}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>💻 {repo.language || 'Code'}</span>
                        <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>⭐ {repo.stars}</span>
                        <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>🍴 {repo.forks}</span>
                        <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>{repo.readme ? '✅ README' : '❌ README'}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last commit: {repo.last_commit_date ? new Date(repo.last_commit_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No repository analysis available.</p>
            )}
          </div>

          {/* AI Senior Architect Reviews */}
          {Array.isArray(result.repository_reports) && result.repository_reports.length > 0 && (
            <div className="glass-card" style={{ background: 'linear-gradient(180deg, rgba(21, 28, 46, 0.7) 0%, rgba(14, 19, 31, 0.9) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                    Senior Architect Code &amp; Architectural Reviews
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Generated by AI multi-agent evaluation pipeline on real codebase metadata
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {result.repository_reports.map((report) => (
                  <div
                    key={report.name}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, color: '#818cf8', fontSize: '1.1rem' }}>
                        📦 Audit for: {report.name}
                      </h4>
                      <span className="badge-pill primary">AI Architect Evaluation</span>
                    </div>

                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.92rem',
                        lineHeight: 1.7,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      {report.ai_review}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bottom Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <span>🐙 Analyze Another GitHub Profile</span>
            </button>

            {onNavigateResume && (
              <button type="button" className="btn btn-primary" onClick={onNavigateResume}>
                <span>Analyze Resume Next 📄</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
