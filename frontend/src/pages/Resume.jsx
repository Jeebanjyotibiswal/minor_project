import { useState, useRef } from 'react'
import ScoreRing from '../components/ScoreRing'
import ProcessingState from '../components/ProcessingState'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function ResumeAnalyzer({ onBack, onNavigateGithub }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [pdfPath, setPdfPath] = useState('')
  const [showPathInput, setShowPathInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [review, setReview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile)
        setError('')
      } else {
        setError('Please drop a valid PDF resume file.')
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please select a valid PDF resume file.')
      }
    }
  }

  const handleFileSubmit = async (event) => {
    if (event) event.preventDefault()
    setError('')
    setReview(null)

    if (!file) {
      setError('Please select or drop a PDF resume file.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/resume_analyzer`, {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.detail || `Request failed (${response.status}): ${response.statusText}`)
      } else {
        setReview(payload.review)
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to connect to AI backend. Please verify that the python service is running.')
    } finally {
      setLoading(false)
    }
  }

  const handlePathSubmit = async (event) => {
    if (event) event.preventDefault()
    setError('')
    setReview(null)

    if (!pdfPath.trim()) {
      setError('Please enter the server-side PDF path.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/resume_analyzer?pdf_path=${encodeURIComponent(pdfPath.trim())}`)
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.detail || `Request failed (${response.status}): ${response.statusText}`)
      } else {
        setReview(payload.review)
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to connect to AI backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setReview(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: 1040, padding: '1rem 1.5rem' }}>
      {/* Top Header / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onBack}>
          <span>← Back Home</span>
        </button>
        <div className="badge-pill info">
          <span>📄 ATS Intelligence Engine</span>
        </div>
      </div>

      {/* Input / Upload Workspace (when no results yet and not loading) */}
      {!loading && !review && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              Upload Resume for AI Evaluation
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Our ATS parser extracts technical skills, identifies missing keywords, and evaluates formatting compatibility.
            </p>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragOver ? '2px dashed #6366f1' : file ? '2px solid rgba(16, 185, 129, 0.4)' : '2px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(99, 102, 241, 0.08)' : file ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.2s ease',
              marginBottom: '1.5rem',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: file ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: file ? '#34d399' : '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                fontSize: '1.6rem',
              }}
            >
              {file ? '✓' : '📄'}
            </div>

            {file ? (
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                  {file.name}
                </h4>
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', alignItems: 'center' }}>
                  <span className="badge-pill success">
                    {(file.size / 1024).toFixed(1)} KB • PDF Ready
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Click to replace</span>
                </div>
              </div>
            ) : (
              <div>
                <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                  Drag & Drop your resume PDF here
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Supports all standard single & multi-page PDF resumes (up to 15MB)
                </p>
                <button type="button" className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowPathInput(!showPathInput)}
              style={{ color: 'var(--text-muted)' }}
            >
              {showPathInput ? '▲ Hide Server Path Option' : '▼ Or enter server PDF path'}
            </button>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!file}
              onClick={handleFileSubmit}
              style={{ minWidth: 200 }}
            >
              <span>Analyze Resume with AI</span>
              <span>→</span>
            </button>
          </div>

          {/* Optional Server Path Drawer */}
          {showPathInput && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                Server File System Path:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={pdfPath}
                  onChange={(e) => setPdfPath(e.target.value)}
                  placeholder="e.g. C:/Users/path/resume.pdf"
                />
                <button type="button" className="btn btn-secondary" onClick={handlePathSubmit}>
                  Analyze Path
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="alert-banner error">
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div>
                <strong>Analysis Error:</strong> {error}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Experience */}
      {loading && (
        <ProcessingState
          title="CareerLens ATS Intelligence is auditing your resume..."
          stages={[
            'Extracting structured text & sections from PDF',
            'Auditing technical skill vocabulary & density',
            'Evaluating ATS keyword matches & formatting syntax',
            'Synthesizing prioritized career roadmap with Llama 3.3',
          ]}
        />
      )}

      {/* Results Analytics Dashboard */}
      {review && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Score Banner Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(21, 28, 46, 0.9) 0%, rgba(14, 19, 31, 0.95) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div style={{ maxWidth: 560 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge-pill primary">CareerLens ATS Verdict</span>
                <span className="badge-pill success">Analysis Complete</span>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem', color: '#ffffff' }}>
                ATS Compatibility & Resume Health
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {review.score >= 75
                  ? 'Your resume shows strong technical keyword alignment with modern hiring filters, with opportunities to quantify project outcomes.'
                  : review.score >= 50
                  ? 'Moderate candidate profile match. Adding specific framework keywords and measurable impact metrics will improve screening pass rates.'
                  : 'Needs revision. Adding missing core skills, action verbs, and standard ATS heading structures will significantly increase recruiter visibility.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <ScoreRing score={review.score ?? 75} size={135} strokeWidth={11} label="Overall ATS Match" />
            </div>
          </div>

          {/* Error fallback if raw json failed */}
          {review.error && (
            <div className="glass-card full-width">
              <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Raw AI Feedback</h3>
              <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {typeof review.error === 'string' ? review.error : JSON.stringify(review, null, 2)}
              </pre>
            </div>
          )}

          {/* 3-Column Metrics Row */}
          {!review.error && (
            <>
              {/* Extracted Technical Skills Tags */}
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Extracted Technical Skills</h3>
                  <span className="badge-pill info">
                    {Array.isArray(review.skills) ? review.skills.length : 0} Identified
                  </span>
                </div>
                {Array.isArray(review.skills) && review.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {review.skills.map((skill, index) => (
                      <span key={index} className="badge-pill primary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                        💻 {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No specific technical skills detected in document text.</p>
                )}
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid-2">
                {/* Strengths Card */}
                <div className="glass-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>✅</span>
                    <h3 style={{ fontSize: '1.15rem', color: '#34d399' }}>Identified Strengths</h3>
                  </div>
                  {Array.isArray(review.strengths) && review.strengths.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                      {review.strengths.map((item, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#f8fafc' }}>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No strengths identified.</p>
                  )}
                </div>

                {/* Missing Keywords & Weaknesses Card */}
                <div className="glass-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>🔍</span>
                    <h3 style={{ fontSize: '1.15rem', color: '#fbbf24' }}>Critical Missing Keywords & Gaps</h3>
                  </div>
                  {Array.isArray(review.missing_keywords) && review.missing_keywords.length > 0 ? (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Recommended keywords to add:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {review.missing_keywords.map((kw, index) => (
                          <span key={index} className="badge-pill warning" style={{ fontSize: '0.8rem' }}>
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {Array.isArray(review.weaknesses) && review.weaknesses.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                      {review.weaknesses.map((item, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: '#f59e0b', fontWeight: 800 }}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No critical weaknesses detected.</p>
                  )}
                </div>
              </div>

              {/* Actionable Prioritized AI Career Roadmap */}
              <div className="glass-card" style={{ background: 'linear-gradient(180deg, rgba(21, 28, 46, 0.7) 0%, rgba(14, 19, 31, 0.9) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🎯</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Your AI Career Roadmap</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Prioritized tactical actions to maximize your profile's hiring impact
                    </p>
                  </div>
                </div>

                {Array.isArray(review.recommendations) && review.recommendations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {review.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.1rem 1.25rem',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            borderRadius: '8px',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          PRIORITY 0{index + 1}
                        </div>
                        <div style={{ flex: 1, fontSize: '0.92rem', color: '#f8fafc', lineHeight: 1.5 }}>
                          {rec}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No additional recommendations.</p>
                )}
              </div>

              {/* Grammar / Formatting Feedback (if any) */}
              {Array.isArray(review.grammar_issues) && review.grammar_issues.length > 0 && (
                <div className="glass-card">
                  <h4 style={{ fontSize: '1.05rem', color: '#fda4af', marginBottom: '0.75rem' }}>
                    📝 Grammar & Formatting Improvements
                  </h4>
                  <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {review.grammar_issues.map((item, index) => (
                      <li key={index} style={{ marginBottom: '0.4rem' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Bottom Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  <span>📄 Analyze Another Resume</span>
                </button>

                {onNavigateGithub && (
                  <button type="button" className="btn btn-primary" onClick={onNavigateGithub}>
                    <span>Proceed to GitHub Analyzer 🐙</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
