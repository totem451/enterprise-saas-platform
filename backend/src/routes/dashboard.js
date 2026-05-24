import { Router } from 'express'
import prisma from '../db/client.js'
import { authMiddleware } from '../middleware/auth.js'

export const dashboardRouter = Router()

dashboardRouter.use(authMiddleware)

// GET /api/dashboard/metrics
dashboardRouter.get('/metrics', async (req, res) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      totalDeals,
      deals,
      recentCustomers,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: 'ACTIVE' } }),
      prisma.deal.count(),
      prisma.deal.findMany({
        select: { stage: true, value: true },
      }),
      prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, company: true, status: true, createdAt: true },
      }),
    ])

    // Aggregate pipeline and won revenue
    let pipeline = 0
    let wonRevenue = 0
    const stageMap = {}

    for (const deal of deals) {
      if (!stageMap[deal.stage]) {
        stageMap[deal.stage] = { stage: deal.stage, count: 0, value: 0 }
      }
      stageMap[deal.stage].count += 1
      stageMap[deal.stage].value += deal.value

      if (!['CLOSED_WON', 'CLOSED_LOST'].includes(deal.stage)) {
        pipeline += deal.value
      }
      if (deal.stage === 'CLOSED_WON') {
        wonRevenue += deal.value
      }
    }

    const stageOrder = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']
    const dealsByStage = stageOrder
      .filter((s) => stageMap[s])
      .map((s) => stageMap[s])

    res.json({
      totalCustomers,
      activeCustomers,
      totalDeals,
      pipeline: Math.round(pipeline * 100) / 100,
      wonRevenue: Math.round(wonRevenue * 100) / 100,
      dealsByStage,
      recentCustomers,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
