import { useState } from 'react'
import Home from './pages/Home.jsx'
import GithubAnalyzer from './pages/Github.jsx'
import ResumeAnalyzer from './pages/Resume.jsx'
import './App.css'

function App() {
  const [view, setView] = useState('home')

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>AI Service Analyzer</h1>
          <p>Analyze GitHub profiles or resumes with the AI backend service.</p>
        </div>
        <nav className="app-nav">
          <button type="button" onClick={() => setView('home')} disabled={view === 'home'}>
            Home
          </button>
          <button type="button" onClick={() => setView('github')}>
            GitHub Analyze
          </button>
          <button type="button" onClick={() => setView('resume')}>
            Resume Analyze
          </button>
        </nav>
      </header>

      <main className="app-content">
        {view === 'home' && <Home onSelect={setView} />}
        {view === 'github' && <GithubAnalyzer onBack={() => setView('home')} />}
        {view === 'resume' && <ResumeAnalyzer onBack={() => setView('home')} />}
      </main>
    </div>
  )
}

export default App
