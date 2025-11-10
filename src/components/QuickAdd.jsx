import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { PlusCircle } from 'lucide-react'

export default function QuickAdd() {
  const [clients, setClients] = useState([])
  const [matters, setMatters] = useState([])
  const [tasks, setTasks] = useState([])

  const [clientName, setClientName] = useState('')
  const [matterTitle, setMatterTitle] = useState('')
  const [taskTitle, setTaskTitle] = useState('')

  const refresh = async () => {
    const [c, m, t] = await Promise.all([
      api.list('client'),
      api.list('matter'),
      api.list('task'),
    ])
    setClients(c)
    setMatters(m)
    setTasks(t)
  }

  useEffect(() => { refresh() }, [])

  const addClient = async () => {
    if (!clientName) return
    await api.create('client', { name: clientName })
    setClientName('')
    refresh()
  }
  const addMatter = async () => {
    if (!matterTitle) return
    await api.create('matter', { title: matterTitle, status: 'open' })
    setMatterTitle('')
    refresh()
  }
  const addTask = async () => {
    if (!taskTitle) return
    await api.create('task', { title: taskTitle })
    setTaskTitle('')
    refresh()
  }

  return (
    <section className="py-12 bg-white border-t">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><PlusCircle className="h-5 w-5"/>Quick Add</h2>
        <p className="text-gray-600 mt-1">Add clients, matters, and tasks. Data is stored in the database.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Client</h3>
            <div className="mt-2 flex gap-2">
              <input value={clientName} onChange={e=>setClientName(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" placeholder="Acme, Inc."/>
              <button onClick={addClient} className="rounded-md bg-blue-600 px-3 py-2 text-white font-semibold">Add</button>
            </div>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
              {clients.map(c => <li key={c._id}>• {c.name}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Matter</h3>
            <div className="mt-2 flex gap-2">
              <input value={matterTitle} onChange={e=>setMatterTitle(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" placeholder="Seed SAFE"/>
              <button onClick={addMatter} className="rounded-md bg-blue-600 px-3 py-2 text-white font-semibold">Add</button>
            </div>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
              {matters.map(m => <li key={m._id}>• {m.title} <span className="text-xs text-gray-500">({m.status})</span></li>)}
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Task</h3>
            <div className="mt-2 flex gap-2">
              <input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" placeholder="Prepare board consent"/>
              <button onClick={addTask} className="rounded-md bg-blue-600 px-3 py-2 text-white font-semibold">Add</button>
            </div>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
              {tasks.map(t => <li key={t._id}>• {t.title}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
