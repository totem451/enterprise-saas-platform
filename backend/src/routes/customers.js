import { Router } from 'express'
import prisma from '../db/client.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

export const customersRouter = Router()

// All customer routes require authentication
customersRouter.use(authMiddleware)

// GET /api/customers
customersRouter.get('/', async (req, res) => {
  try {
    const { search, status, page = '1', limit = '20' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const where = {}
    if (status && ['ACTIVE', 'INACTIVE', 'LEAD'].includes(status)) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { deals: true } } },
      }),
      prisma.customer.count({ where }),
    ])

    res.json({
      data: customers,
      meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/customers/:id
customersRouter.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        deals: {
          include: { owner: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!customer) return res.status(404).json({ error: 'Customer not found' })
    res.json(customer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/customers
customersRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' })
    }

    const customer = await prisma.customer.create({
      data: { name, email, phone, company, status: status || 'ACTIVE' },
    })
    res.status(201).json(customer)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' })
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/customers/:id
customersRouter.put('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { name, email, phone, company, status },
    })
    res.json(customer)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/customers/:id
customersRouter.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
