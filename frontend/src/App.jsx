import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home.jsx'
import GithubAnalyzer from './pages/Github.jsx'
import ResumeAnalyzer from './pages/Resume.jsx'
import './App.css'

function App() {
  const [view, setView] = useState('home')

  const navigate = (v) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentView={view} setView={navigate} />

      <main className="main-content" style={{ flex: 1 }}>
        {view === 'home' && <Home setView={navigate} />}
        {view === 'github' && (
          <GithubAnalyzer
            onBack={() => navigate('home')}
            onNavigateResume={() => navigate('resume')}
          />
        )}
        {view === 'resume' && (
          <ResumeAnalyzer
            onBack={() => navigate('home')}
            onNavigateGithub={() => navigate('github')}
          />
        )}
      </main>

      <Footer setView={navigate} />
    </div>
  )
}

export default App
