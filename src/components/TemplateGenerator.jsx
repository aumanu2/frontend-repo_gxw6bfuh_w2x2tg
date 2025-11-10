import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { FileText, Wand2 } from 'lucide-react'

export default function TemplateGenerator() {
  const [templates, setTemplates] = useState([])
  const [selected, setSelected] = useState(null)
  const [variables, setVariables] = useState({})
  const [output, setOutput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.defaultTemplates().then(setTemplates).catch(e => setError(e.message))
  }, [])

  useEffect(() => {
    if (!selected) return
    const initial = {}
    selected.variables.forEach(v => { initial[v] = '' })
    setVariables(initial)
    setOutput('')
  }, [selected])

  const onChangeVar = (key, val) => setVariables(prev => ({ ...prev, [key]: val }))

  const generate = async () => {
    try {
      setSaving(true)
      setError('')
      const res = await api.generate(selected, variables)
      setOutput(res.content)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Wand2 className="h-5 w-5"/>Generate Documents</h2>
        <p className="text-gray-600 mt-1">Pick a template, fill variables, and instantly draft a ready-to-review document.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            {templates.map((t, idx) => (
              <button key={idx} onClick={() => setSelected(t)} className={`w-full text-left rounded-lg border p-3 hover:bg-gray-50 ${selected?.name===t.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <div className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="h-4 w-4"/>{t.name}</div>
                <div className="text-xs text-gray-500 mt-1 capitalize">{t.category}</div>
              </button>
            ))}
          </div>
          <div className="md:col-span-1">
            {selected ? (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800">Variables</h3>
                <div className="mt-3 space-y-3">
                  {selected.variables.map((v) => (
                    <div key={v} className="grid gap-1">
                      <label className="text-sm text-gray-600">{v}</label>
                      <input value={variables[v] || ''} onChange={e => onChangeVar(v, e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={`Enter ${v.replaceAll('_',' ')}`} />
                    </div>
                  ))}
                </div>
                <button onClick={generate} disabled={!selected || saving} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Generating...' : 'Generate'}
                </button>
              </div>
            ) : (
              <div className="text-gray-500">Select a template to begin.</div>
            )}
          </div>
          <div className="md:col-span-1">
            <div className="rounded-lg border border-gray-200 p-4 h-full">
              <h3 className="font-semibold text-gray-800">Preview</h3>
              {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
              <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{output || 'Generated text will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
