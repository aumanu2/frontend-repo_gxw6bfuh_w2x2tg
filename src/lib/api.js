const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const data = await res.json()
      message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data)
    } catch (_) {
      try { message = await res.text() } catch (_) {}
    }
    throw new Error(message)
  }
  return res.json()
}

export const api = {
  baseUrl: BASE_URL,
  ping: () => request('/'),
  list: (collection, limit = 50) => request(`/api/collections/${collection}?limit=${limit}`),
  create: (collection, data) => request(`/api/collections/${collection}`, { method: 'POST', body: JSON.stringify({ data }) }),
  defaultTemplates: () => request('/api/templates/defaults'),
  generate: (template, variables) => request('/api/generate', { method: 'POST', body: JSON.stringify({ template, variables }) }),
}
