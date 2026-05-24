import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { customersRouter } from './routes/customers.js'
import { dealsRouter } from './routes/deals.js'
import { dashboardRouter } from './routes/dashboard.js'
import { config } from './config.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/customers', customersRouter)
app.use('/api/deals', dealsRouter)
app.use('/api/dashboard', dashboardRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(config.port, () => {
  console.log(`API running on :${config.port}`)
})

export default app
