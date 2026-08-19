import { useState } from 'react'
import './page.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function ResumeAnalyzer({ onBack }) {
  const [file, setFile] = useState(null)
  const [pdfPath, setPdfPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [review, setReview] = useState(null)

  async function handleFileSubmit(event) {
    event.preventDefault()
    setError('')
    setReview(null)

    if (!file) {
      setError('Please select a PDF resume file.')
      return
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.')
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
        setError(payload?.detail || `Request failed: ${response.statusText}`)
      } else {
        setReview(payload.review)
      }
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePathSubmit(event) {
    event.preventDefault()
    setError('')
    setReview(null)

    if (!pdfPath.trim()) {
      setError('Please enter the PDF path.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/resume_analyzer?pdf_path=${encodeURIComponent(pdfPath.trim())}`)
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.detail || `Request failed: ${response.statusText}`)
      } else {
        setReview(payload.review)
      }
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-analyzer">
      <div className="panel">
        <button type="button" className="secondary" onClick={onBack}>
          <span aria-hidden="true">←</span> Back Home
        </button>
        <h2>Resume Analyzer</h2>
        <p>Upload a resume PDF or provide a server-side PDF path to get an AI-powered review.</p>

        <form className="file-form" onSubmit={handleFileSubmit}>
          <label>
            Upload PDF Resume
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing�' : 'Analyze File'}
          </button>
        </form>

        <div className="divider">OR</div>

        <form className="path-form" onSubmit={handlePathSubmit}>
          <label>
            Server PDF Path
            <input
              type="text"
              value={pdfPath}
              onChange={(event) => setPdfPath(event.target.value)}
              placeholder="Path to resume PDF on server"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing�' : 'Analyze Path'}
          </button>
        </form>

        {error && <div className="status error">{error}</div>}

        {review && (
          <div className="review-card">
            <h3>Resume Review</h3>
            {review.error ? (
              <pre>{JSON.stringify(review, null, 2)}</pre>
            ) : (
              <div className="review-grid">
                <div>
                  <p><strong>Score:</strong> {review.score ?? 'N/A'}</p>
                  <p><strong>Skills:</strong> {Array.isArray(review.skills) ? review.skills.join(', ') : 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Strengths:</strong></p>
                  <ul>{Array.isArray(review.strengths) ? review.strengths.map((item, index) => <li key={index}>{item}</li>) : 'N/A'}</ul>
                </div>
                <div>
                  <p><strong>Weaknesses:</strong></p>
                  <ul>{Array.isArray(review.weaknesses) ? review.weaknesses.map((item, index) => <li key={index}>{item}</li>) : 'N/A'}</ul>
                </div>
                <div>
                  <p><strong>Recommendations:</strong></p>
                  <ul>{Array.isArray(review.recommendations) ? review.recommendations.map((item, index) => <li key={index}>{item}</li>) : 'N/A'}</ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ResumeAnalyzer
