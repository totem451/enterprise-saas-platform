import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, DollarSign } from 'lucide-react'
import { dealsApi } from '../api/deals.js'
import { customersApi } from '../api/customers.js'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, Select } from '../components/ui/Input.jsx'
import { useAuth } from '../hooks/useAuth.js'

const STAGES = [
  'PROSPECTING',
  'QUALIFICATION',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
]

const STAGE_LABELS = {
  PROSPECTING: 'Prospecting',
  QUALIFICATION: 'Qualification',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
}

const STAGE_COLORS = {
  PROSPECTING: 'border-t-slate-400',
  QUALIFICATION: 'border-t-purple-500',
  PROPOSAL: 'border-t-amber-400',
  NEGOTIATION: 'border-t-orange-500',
  CLOSED_WON: 'border-t-green-500',
  CLOSED_LOST: 'border-t-red-500',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function AddDealModal({ onClose }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    title: '',
    value: '',
    stage: 'PROSPECTING',
    customerId: '',
    closeDate: '',
    notes: '',
  })
  const [error, setError] = useState('')

  const { data: customersData } = useQuery({
    queryKey: ['customers-all'],
    queryFn: () => customersApi.list({ limit: 100 }),
  })

  const mutation = useMutation({
    mutationFn: dealsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] })
      onClose()
    },
    onError: (err) => setError(err.response?.data?.error || 'Failed to create deal'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    mutation.mutate({ ...form, value: parseFloat(form.value) })
  }

  const customers = customersData?.data || []

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Deal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Deal Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enterprise License Agreement"
            required
          />
          <Input
            label="Value ($) *"
            type="number"
            min="0"
            step="0.01"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="10000"
            required
          />
          <Select
            label="Stage"
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: e.target.value })}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </Select>
          <Select
            label="Customer *"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
            ))}
          </Select>
          <Input
            label="Expected Close Date"
            type="date"
            value={form.closeDate}
            onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
              placeholder="Additional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={mutation.isPending}>
              Add Deal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DealCard({ deal }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-medium text-gray-900 text-sm mb-2 leading-snug">{deal.title}</p>
      <p className="text-xs text-gray-500 mb-3 truncate">
        {deal.customer?.name}
        {deal.customer?.company ? ` · ${deal.customer.company}` : ''}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
          <DollarSign size={13} className="text-gray-400" />
          {formatCurrency(deal.value)}
        </span>
        {deal.closeDate && (
          <span className="text-xs text-gray-400">{formatDate(deal.closeDate)}</span>
        )}
      </div>
      {deal.owner && (
        <p className="text-xs text-gray-400 mt-2">{deal.owner.name}</p>
      )}
    </div>
  )
}

export default function Deals() {
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState('kanban')
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsApi.list({ limit: 100 }),
  })

  const deals = data?.data || []

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage)
    return acc
  }, {})

  const totalPipeline = deals
    .filter((d) => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {deals.length} deals · Pipeline: {formatCurrency(totalPipeline)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 font-medium transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
          </div>
          {user?.role === 'ADMIN' && (
            <Button onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Add Deal
            </Button>
          )}
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage] || []
            const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0)
            return (
              <div
                key={stage}
                className={`flex-shrink-0 w-64 bg-gray-50 rounded-xl border-t-4 ${STAGE_COLORS[stage]} border border-gray-200 border-t-0 overflow-hidden`}
                style={{ borderTopWidth: '4px' }}
              >
                <div className={`px-3 pt-3 pb-2 border-t-4 ${STAGE_COLORS[stage].replace('border-t-', 'border-')}`}
                  style={{ borderTopWidth: '4px', borderTopStyle: 'solid' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{STAGE_LABELS[stage]}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  {stageDeals.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(stageTotal)}</p>
                  )}
                </div>
                <div className="px-3 pb-3 space-y-2.5 max-h-[600px] overflow-y-auto">
                  {stageDeals.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No deals</p>
                  ) : (
                    stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Close Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{deal.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {deal.customer?.name}
                      {deal.customer?.company && <span className="text-gray-400"> · {deal.customer.company}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge value={deal.stage} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(deal.value)}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(deal.closeDate) || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{deal.owner?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && <AddDealModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
