import { useState } from 'react'
import './page.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function GithubAnalyzer({ onBack }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!username.trim()) {
      setError('Please enter a GitHub username.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/github-analyzer?username=${encodeURIComponent(username.trim())}`)
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.detail || `Request failed: ${response.statusText}`)
      } else {
        setResult(payload)
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
        <h2>GitHub Analyzer</h2>
        <p>Enter a GitHub username to analyze the public profile and repository health.</p>
        <form className="search-form" onSubmit={handleSubmit}>
          <label>
            GitHub Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="octocat"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing�' : 'Analyze GitHub'}
          </button>
        </form>

        {error && <div className="status error">{error}</div>}

        {result && (
          <div className="result-grid">
            <div className="result-card">
              <h3>Profile Summary</h3>
              <p><strong>Name:</strong> {result.profile?.name || 'N/A'}</p>
              <p><strong>Followers:</strong> {result.profile?.followers ?? 'N/A'}</p>
              <p><strong>Following:</strong> {result.profile?.following ?? 'N/A'}</p>
              <p><strong>Public repos:</strong> {result.profile?.public_repos ?? 'N/A'}</p>
              <p><strong>Bio:</strong> {result.profile?.bio || 'No bio available.'}</p>
            </div>

            <div className="result-card full-width">
              <h3>Repository Analysis</h3>
              {Array.isArray(result.repo_analysis) && result.repo_analysis.length > 0 ? (
                result.repo_analysis.slice(0, 5).map((repo) => (
                  <div key={repo.name} className="repo-summary">
                    <h4>{repo.name}</h4>
                    <p>{repo.description}</p>
                    <p><strong>Activity:</strong> {repo.activity}</p>
                    <p><strong>Last commit:</strong> {repo.last_commit_date || 'Unknown'}</p>
                    <p><strong>Stars:</strong> {repo.stars}</p>
                  </div>
                ))
              ) : (
                <p>No repository analysis data available.</p>
              )}
            </div>

            {Array.isArray(result.repository_reports) && result.repository_reports.length > 0 && (
              <div className="result-card full-width">
                <h3>AI Repository Reviews</h3>
                {result.repository_reports.slice(0, 3).map((report) => (
                  <div key={report.name} className="repo-review">
                    <h4>{report.name}</h4>
                    <pre>{report.ai_review}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default GithubAnalyzer
