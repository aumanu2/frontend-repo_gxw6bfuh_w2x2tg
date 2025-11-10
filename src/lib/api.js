const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  baseUrl: BASE_URL,
  ping: () => request('/'),
  list: (collection, limit = 50) => request(`/api/${collection}?limit=${limit}`),
  create: (collection, data) => request(`/api/${collection}`, { method: 'POST', body: JSON.stringify({ data }) }),
  defaultTemplates: () => request('/api/templates/defaults'),
  generate: (template, variables) => request('/api/generate', { method: 'POST', body: JSON.stringify({ template, variables }) }),
}
