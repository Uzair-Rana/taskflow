import axios from 'axios'

const baseURL = '/'

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Cache-Control'] = 'no-cache'
  return config
})

let refreshing = false
const queue = []

function processQueue(error, token = null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  queue.length = 0
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
      refreshing = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw new Error('No refresh token')
        let resp
        try {
          resp = await axios.post(`${baseURL}api/auth/token/refresh/`, { refresh })
        } catch {
          resp = await axios.post(`${baseURL}api/auth/refresh/`, { refresh })
        }
        const newAccess = resp.data.access
        localStorage.setItem('access', newAccess)
        processQueue(null, newAccess)
        refreshing = false
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        refreshing = false
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: (payload) => api.post('/api/auth/login/', payload),
  logout: (payload) => api.post('/api/auth/logout/', payload),
  me: () => api.get('/api/auth/me/'),
}

export const tenants = {
  register: (payload) => api.post('/api/tenants/', payload),
  invite: (payload) => api.post('/api/tenants/invite/', payload),
  users: () => api.get('/api/tenants/users/'),
  settingsGet: () => api.get('/api/tenant/settings/'),
  settingsPatch: (payload) => api.patch('/api/tenant/settings/', payload),
  all: () => api.get('/api/tenants/all/'),
  delete: (id) => api.delete(`/api/tenants/delete/${id}/`),
}

export const usersApi = {
  role: (id, payload) => api.patch(`/api/users/${id}/role/`, payload),
  deactivate: (id) => api.patch(`/api/users/${id}/deactivate/`),
}

export const projects = {
  list: () => api.get('/api/projects/'),
  create: (payload) => api.post('/api/projects/', payload),
  get: (id) => api.get(`/api/projects/${id}/`),
  update: (id, payload) => api.put(`/api/projects/${id}/`, payload),
  remove: (id) => api.delete(`/api/projects/${id}/`),
}

export const tasks = {
  list: (params) => api.get('/api/tasks/', { params }),
  create: (payload) => api.post('/api/tasks/', payload),
  get: (id) => api.get(`/api/tasks/${id}/`),
  update: (id, payload) => api.put(`/api/tasks/${id}/`, payload),
  remove: (id) => api.delete(`/api/tasks/${id}/`),
  status: (id, payload) => api.patch(`/api/tasks/${id}/status/`, payload),
  assign: (id, payload) => api.post(`/api/tasks/${id}/assign/`, payload),
  commentsList: (id) => api.get(`/api/tasks/${id}/comments/`),
  commentsAdd: (id, payload) => api.post(`/api/tasks/${id}/comments/`, payload),
}

export const chat = {
  messages: () => api.get('/api/chat/messages/'),
}
