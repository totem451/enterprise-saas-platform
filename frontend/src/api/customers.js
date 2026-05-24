import api from './axios.js'

export const customersApi = {
  list: (params) =>
    api.get('/customers', { params }).then((r) => r.data),

  get: (id) =>
    api.get(`/customers/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/customers', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/customers/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/customers/${id}`).then((r) => r.data),
}
