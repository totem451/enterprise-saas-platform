import api from './axios.js'

export const dealsApi = {
  list: (params) =>
    api.get('/deals', { params }).then((r) => r.data),

  get: (id) =>
    api.get(`/deals/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/deals', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/deals/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/deals/${id}`).then((r) => r.data),
}
