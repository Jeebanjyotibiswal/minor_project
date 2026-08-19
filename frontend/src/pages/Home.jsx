import './page.css'

function Home({ onSelect }) {
  return (
    <section className="page page-home">
      <div className="hero-card">
        <h2>Welcome to the AI Analyzer</h2>
        <p>
          Choose one of the AI-backed analysis tools below. You can analyze a GitHub user profile and repositories or upload a resume for review.
        </p>
        <div className="button-row">
          <button type="button" onClick={() => onSelect('github')}>
            GitHub Analyze
          </button>
          <button type="button" onClick={() => onSelect('resume')}>
            Resume Analyze
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home
