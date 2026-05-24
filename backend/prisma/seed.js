import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Alex Johnson',
      role: 'ADMIN',
    },
  })

  // Create viewer user
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@demo.com' },
    update: {},
    create: {
      email: 'viewer@demo.com',
      password: await bcrypt.hash('demo1234', 10),
      name: 'Sam Rivera',
      role: 'VIEWER',
    },
  })

  console.log('Created users:', admin.email, viewer.email)

  // Create customers
  const customersData = [
    {
      name: 'Marcus Thompson',
      email: 'marcus.thompson@techcorp.com',
      phone: '+1-555-0101',
      company: 'TechCorp Solutions',
      status: 'ACTIVE',
    },
    {
      name: 'Elena Rodriguez',
      email: 'elena.r@innovatech.io',
      phone: '+1-555-0102',
      company: 'InnovaTech Inc',
      status: 'ACTIVE',
    },
    {
      name: 'James Wilson',
      email: 'j.wilson@globalfin.com',
      phone: '+1-555-0103',
      company: 'Global Finance Group',
      status: 'ACTIVE',
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@nexuscloud.com',
      phone: '+1-555-0104',
      company: 'Nexus Cloud Systems',
      status: 'LEAD',
    },
    {
      name: 'Daniel Chen',
      email: 'd.chen@alphaventures.co',
      phone: '+1-555-0105',
      company: 'Alpha Ventures',
      status: 'LEAD',
    },
    {
      name: 'Sarah Mitchell',
      email: 'smitchell@brightdata.net',
      phone: '+1-555-0106',
      company: 'BrightData Analytics',
      status: 'ACTIVE',
    },
    {
      name: 'Robert Kim',
      email: 'rkim@peakperformance.biz',
      phone: '+1-555-0107',
      company: 'Peak Performance Ltd',
      status: 'INACTIVE',
    },
    {
      name: 'Laura Fernandez',
      email: 'l.fernandez@streamlineops.com',
      phone: '+1-555-0108',
      company: 'Streamline Operations',
      status: 'ACTIVE',
    },
  ]

  const customers = []
  for (const data of customersData) {
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    })
    customers.push(customer)
  }

  console.log(`Created ${customers.length} customers`)

  // Create deals
  const dealsData = [
    {
      title: 'Enterprise License Agreement',
      value: 48000,
      stage: 'CLOSED_WON',
      closeDate: new Date('2024-11-15'),
      notes: 'Annual enterprise license for 250 seats. Smooth negotiation.',
      customerId: customers[0].id,
      ownerId: admin.id,
    },
    {
      title: 'Cloud Migration Project',
      value: 32000,
      stage: 'NEGOTIATION',
      closeDate: new Date('2025-02-28'),
      notes: 'Full cloud migration from on-premise. Final contract review in progress.',
      customerId: customers[1].id,
      ownerId: admin.id,
    },
    {
      title: 'Analytics Platform Subscription',
      value: 15000,
      stage: 'PROPOSAL',
      closeDate: new Date('2025-01-31'),
      notes: 'Presented platform demo. Awaiting decision from their CTO.',
      customerId: customers[2].id,
      ownerId: viewer.id,
    },
    {
      title: 'Security Audit & Implementation',
      value: 22000,
      stage: 'QUALIFICATION',
      closeDate: new Date('2025-03-15'),
      notes: 'Initial discovery call completed. Security needs assessment scheduled.',
      customerId: customers[3].id,
      ownerId: admin.id,
    },
    {
      title: 'Data Warehouse Setup',
      value: 18500,
      stage: 'PROSPECTING',
      closeDate: new Date('2025-04-01'),
      notes: 'Identified via LinkedIn outreach. Initial interest confirmed.',
      customerId: customers[4].id,
      ownerId: viewer.id,
    },
    {
      title: 'BI Dashboard Implementation',
      value: 9800,
      stage: 'CLOSED_WON',
      closeDate: new Date('2024-12-01'),
      notes: 'Custom dashboard suite delivered on time.',
      customerId: customers[5].id,
      ownerId: admin.id,
    },
    {
      title: 'Legacy System Upgrade',
      value: 41000,
      stage: 'CLOSED_LOST',
      closeDate: new Date('2024-10-30'),
      notes: 'Lost to competitor. Budget constraints cited.',
      customerId: customers[6].id,
      ownerId: viewer.id,
    },
    {
      title: 'Process Automation Suite',
      value: 27500,
      stage: 'PROPOSAL',
      closeDate: new Date('2025-02-14'),
      notes: 'Proposal sent covering RPA and workflow automation modules.',
      customerId: customers[7].id,
      ownerId: admin.id,
    },
    {
      title: 'SaaS Platform Onboarding',
      value: 12000,
      stage: 'QUALIFICATION',
      closeDate: new Date('2025-03-01'),
      notes: 'Needs analysis done. Budget approved internally.',
      customerId: customers[0].id,
      ownerId: viewer.id,
    },
    {
      title: 'API Integration Package',
      value: 8500,
      stage: 'PROSPECTING',
      closeDate: new Date('2025-04-15'),
      notes: 'Referred by existing client. Early stage discussion.',
      customerId: customers[1].id,
      ownerId: admin.id,
    },
    {
      title: 'Staff Training & Enablement',
      value: 6000,
      stage: 'NEGOTIATION',
      closeDate: new Date('2025-01-20'),
      notes: 'Training program scoped for 50 staff. Final pricing being discussed.',
      customerId: customers[2].id,
      ownerId: admin.id,
    },
    {
      title: 'Compliance Management Tool',
      value: 19000,
      stage: 'PROSPECTING',
      closeDate: new Date('2025-05-01'),
      notes: 'New regulation driving urgency. Demo scheduled.',
      customerId: customers[3].id,
      ownerId: viewer.id,
    },
  ]

  for (const data of dealsData) {
    await prisma.deal.create({ data })
  }

  console.log(`Created ${dealsData.length} deals`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
