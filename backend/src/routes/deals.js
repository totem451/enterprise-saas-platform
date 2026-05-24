import { Router } from 'express'
import prisma from '../db/client.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

export const dealsRouter = Router()

dealsRouter.use(authMiddleware)

// GET /api/deals
dealsRouter.get('/', async (req, res) => {
  try {
    const { stage, customerId, page = '1', limit = '50' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const where = {}
    if (stage) where.stage = stage
    if (customerId) where.customerId = customerId

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, company: true } },
          owner: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.deal.count({ where }),
    ])

    res.json({
      data: deals,
      meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/deals/:id
dealsRouter.get('/:id', async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { id: true, name: true, company: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    })
    if (!deal) return res.status(404).json({ error: 'Deal not found' })
    res.json(deal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/deals
dealsRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, value, stage, closeDate, notes, customerId } = req.body
    if (!title || value === undefined || !customerId) {
      return res.status(400).json({ error: 'title, value, and customerId are required' })
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: parseFloat(value),
        stage: stage || 'PROSPECTING',
        closeDate: closeDate ? new Date(closeDate) : null,
        notes,
        customerId,
        ownerId: req.user.id,
      },
      include: {
        customer: { select: { id: true, name: true, company: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    })
    res.status(201).json(deal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/deals/:id
dealsRouter.put('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, value, stage, closeDate, notes, customerId } = req.body
    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data: {
        title,
        value: value !== undefined ? parseFloat(value) : undefined,
        stage,
        closeDate: closeDate ? new Date(closeDate) : undefined,
        notes,
        customerId,
      },
      include: {
        customer: { select: { id: true, name: true, company: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    })
    res.json(deal)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Deal not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/deals/:id
dealsRouter.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.deal.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Deal not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
