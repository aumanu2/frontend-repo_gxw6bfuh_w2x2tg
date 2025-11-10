import { useEffect, useMemo, useState } from 'react'
import { Plus, FileText, Building2, BriefcaseBusiness, Settings, Shield, Scale, ArrowRight, Sparkles } from 'lucide-react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header() {
  return (
    <div className="w-full py-6 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white font-black">SL</div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Startup Lawyer</h1>
          <p className="text-xs md:text-sm text-gray-500 -mt-1">All your legal matters, organized.</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-gray-600">
        <a className="px-3 py-2 hover:text-gray-900" href="#templates">Templates</a>
        <a className="px-3 py-2 hover:text-gray-900" href="#matters">Matters</a>
        <a className="px-3 py-2 hover:text-gray-900" href="#clients">Clients</a>
        <a className="px-3 py-2 hover:text-gray-900" href="/test" title="System test">Status</a>
      </div>
    </div>
  )
}

function Stat({label, value}){
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function Templates() {
  const [templates, setTemplates] = useState([])
  const [selected, setSelected] = useState(null)
  const [vars, setVars] = useState({})
  const [generated, setGenerated] = useState(null)

  useEffect(() => {
    fetch(`${apiBase}/api/templates/defaults`).then(r=>r.json()).then(setTemplates)
  }, [])

  const onSelect = (tpl) => {
    setSelected(tpl)
    const initial = {}
    tpl.variables.forEach(v => initial[v] = '')
    setVars(initial)
    setGenerated(null)
  }

  const updateVar = (k, v) => setVars(prev => ({...prev, [k]: v}))

  const generate = async () => {
    const res = await fetch(`${apiBase}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: selected, variables: vars })
    })
    const data = await res.json()
    setGenerated(data)
  }

  return (
    <section id="templates" className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-600"/>
        <h2 className="text-xl font-semibold text-gray-900">Document Generator</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <button key={i} onClick={() => onSelect(t)} className={`text-left rounded-xl border p-4 hover:shadow transition ${selected?.name===t.name? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
            <p className="font-medium text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-500 mt-1 capitalize">{t.category}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Fill Variables</h3>
            <div className="grid grid-cols-1 gap-3">
              {selected.variables.map((v) => (
                <div key={v} className="grid gap-1">
                  <label className="text-sm text-gray-600">{v.replaceAll('_',' ')}</label>
                  <input value={vars[v]||''} onChange={(e)=>updateVar(v, e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" placeholder={`Enter ${v}`} />
                </div>
              ))}
            </div>
            <button onClick={generate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
              <Sparkles className="h-4 w-4"/> Generate
            </button>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Preview</h3>
            <div className="prose max-w-none whitespace-pre-wrap text-sm text-gray-800">
              {generated?.content || 'Generated content will appear here...'}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function QuickCreate() {
  const [clientName, setClientName] = useState('')
  const [jurisdiction, setJurisdiction] = useState('Delaware')
  const [companyType, setCompanyType] = useState('C-Corp')
  const [status, setStatus] = useState(null)

  const createClient = async () => {
    const res = await fetch(`${apiBase}/api/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { name: clientName, jurisdiction, company_type: companyType } })
    })
    const data = await res.json()
    if(res.ok) setStatus(`Client created: ${data.id}`)
    else setStatus(`Error: ${data.detail}`)
  }

  const createMatter = async () => {
    const res = await fetch(`${apiBase}/api/matter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { title: 'Incorporation', status: 'open' } })
    })
    const data = await res.json()
    if(res.ok) setStatus(`Matter created: ${data.id}`)
    else setStatus(`Error: ${data.detail}`)
  }

  return (
    <section id="clients" className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-600"/>
        <h2 className="text-xl font-semibold text-gray-900">Quick Create</h2>
      </div>
      <div className="bg-white rounded-xl border p-5 grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">Client/Company Name</label>
          <input className="w-full px-3 py-2 border rounded-lg" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Acme, Inc."/>
        </div>
        <div>
          <label className="text-sm text-gray-600">Jurisdiction</label>
          <input className="w-full px-3 py-2 border rounded-lg" value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)} placeholder="Delaware"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">Company Type</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={companyType} onChange={e=>setCompanyType(e.target.value)}>
            <option>LLC</option>
            <option>C-Corp</option>
            <option>S-Corp</option>
          </select>
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button onClick={createClient} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            <Plus className="h-4 w-4"/> Create Client
          </button>
          <button onClick={createMatter} className="inline-flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg">
            <BriefcaseBusiness className="h-4 w-4"/> New Matter
          </button>
        </div>
        {status && <p className="md:col-span-3 text-sm text-gray-700">{status}</p>}
      </div>
    </section>
  )
}

function Matters() {
  const [items, setItems] = useState([])
  useEffect(()=>{ fetch(`${apiBase}/api/matter?limit=20`).then(r=>r.json()).then(setItems) }, [])
  return (
    <section id="matters" className="space-y-6">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-indigo-600"/>
        <h2 className="text-xl font-semibold text-gray-900">Matters</h2>
      </div>
      <div className="grid gap-3">
        {items.map((m)=> (
          <div key={m._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{m.title}</p>
              <p className="text-xs text-gray-500 capitalize">{m.status}</p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">Open <ArrowRight className="h-4 w-4"/></button>
          </div>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [counts, setCounts] = useState({ clients: 0, matters: 0, documents: 0 })
  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/api/client`).then(r=>r.json()),
      fetch(`${apiBase}/api/matter`).then(r=>r.json()),
      fetch(`${apiBase}/api/document`).then(r=>r.json()),
    ]).then(([c, m, d])=> setCounts({ clients: c.length||0, matters: m.length||0, documents: d.length||0 }))
    .catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Header/>
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-6 space-y-10">
        <section className="rounded-2xl border bg-white p-6 md:p-8 grid md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-3 space-y-3">
            <div className="inline-flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-sm">
              <Shield className="h-4 w-4"/> Startup legal made simple
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Incorporate, fundraise, and protect IP in one place</h2>
            <p className="text-gray-600">Generate documents, track matters, and keep clients organized. No legalese required.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Clients" value={counts.clients}/>
            <Stat label="Matters" value={counts.matters}/>
            <Stat label="Docs" value={counts.documents}/>
          </div>
        </section>

        <Templates/>
        <QuickCreate/>
        <Matters/>

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-indigo-600"/>
            <h2 className="text-xl font-semibold text-gray-900">Compliance Checklist</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            {[
              'Founder IP assignment executed',
              'Equity plan and option grants tracked',
              'Board/consents archived',
              'Data room organized',
              'Privacy policy up to date',
              'NDA policy in place'
            ].map((item)=> (
              <li key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-indigo-600 rounded-full"/> {item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
