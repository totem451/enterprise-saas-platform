import api from './axios.js'

export const dashboardApi = {
  metrics: () =>
    api.get('/dashboard/metrics').then((r) => r.data),
}
