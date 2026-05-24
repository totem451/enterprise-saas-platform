import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import { dashboardApi } from '../api/dashboard.js'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}

const stageLabels = {
  PROSPECTING: 'Prospect',
  QUALIFICATION: 'Qualify',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negot.',
  CLOSED_WON: 'Won',
  CLOSED_LOST: 'Lost',
}

const stageColors = {
  PROSPECTING: '#6366f1',
  QUALIFICATION: '#8b5cf6',
  PROPOSAL: '#f59e0b',
  NEGOTIATION: '#f97316',
  CLOSED_WON: '#22c55e',
  CLOSED_LOST: '#ef4444',
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-semibold">{payload[0]?.value}</span>
        </p>
        <p className="text-sm text-gray-600">
          Value: <span className="font-semibold">{formatCurrency(payload[1]?.value || 0)}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.metrics,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load dashboard metrics.
      </div>
    )
  }

  const chartData = (data?.dealsByStage || []).map((d) => ({
    name: stageLabels[d.stage] || d.stage,
    stage: d.stage,
    count: d.count,
    value: d.value,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your CRM activity</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <MetricCard
          icon={Users}
          label="Total Customers"
          value={data?.totalCustomers ?? 0}
          color="bg-indigo-600"
        />
        <MetricCard
          icon={Briefcase}
          label="Active Deals"
          value={data?.totalDeals ?? 0}
          color="bg-purple-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Pipeline Value"
          value={formatCurrency(data?.pipeline ?? 0)}
          color="bg-amber-500"
        />
        <MetricCard
          icon={DollarSign}
          label="Won Revenue"
          value={formatCurrency(data?.wonRevenue ?? 0)}
          color="bg-green-600"
        />
      </div>

      {/* Charts + Recent customers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">Deals by Stage</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Count" />
                  <Bar dataKey="value" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="Value" hide />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Recent customers */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recent Customers</h2>
              <Link
                to="/customers"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all
              </Link>
            </CardHeader>
            <div className="divide-y divide-gray-50">
              {(data?.recentCustomers || []).map((c) => (
                <Link
                  key={c.id}
                  to={`/customers/${c.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.company || c.email}</p>
                  </div>
                  <Badge value={c.status} />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
