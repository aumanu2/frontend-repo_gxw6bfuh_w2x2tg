import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import TemplateGenerator from './components/TemplateGenerator'
import QuickAdd from './components/QuickAdd'
import { api } from './lib/api'

function App() {
  const [ready, setReady] = useState(false)
  const [backend, setBackend] = useState('')

  useEffect(() => {
    setBackend(api.baseUrl)
    api.ping().finally(() => setReady(true))
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="font-extrabold">Startup Lawyer</div>
          <nav className="text-sm text-gray-600">Backend: <span className="font-mono">{backend}</span></nav>
        </div>
      </header>
      <main>
        <Hero onGetStarted={() => window.scrollTo({ top: 700, behavior: 'smooth' })} />
        <TemplateGenerator />
        <QuickAdd />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-gray-500">Built for founders and counsel. Not legal advice.</div>
      </footer>
      {!ready && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur flex items-center justify-center text-gray-700">Connecting to backend...</div>
      )}
    </div>
  )
}

export default App
