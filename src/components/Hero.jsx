import { Sparkles } from 'lucide-react'

export default function Hero({ onGetStarted }) {
  return (
    <section className="min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-sm font-medium">
            <Sparkles className="h-4 w-4" /> AI-Powered Legal Workspace
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Startup Lawyer
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Incorporations, financings, NDAs, cap tables, hiring docs—handled in one simple place. Draft, review, and track every legal matter with confidence.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={onGetStarted} className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>
            <a href="/test" className="rounded-md px-4 py-2 font-semibold text-blue-600 hover:text-blue-700">Check Backend</a>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm p-6 border border-gray-100">
          <ul className="space-y-3 text-gray-700">
            <li>• Company formation workflow (LLC, C-Corp)</li>
            <li>• Fundraise toolkit (SAFEs, board consents)</li>
            <li>• Contracts library (NDAs, IP assignments)</li>
            <li>• Task tracking and matter management</li>
            <li>• Secure client records</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
