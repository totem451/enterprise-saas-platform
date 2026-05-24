import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit2, Trash2, Phone, Mail, Building2, Check, X } from 'lucide-react'
import { customersApi } from '../api/customers.js'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input, Select } from '../components/ui/Input.jsx'
import { useAuth } from '../hooks/useAuth.js'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [editError, setEditError] = useState('')

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.get(id),
    onSuccess: (data) => {
      if (!form) setForm({ name: data.name, email: data.email, phone: data.phone || '', company: data.company || '', status: data.status })
    },
  })

  React.useEffect(() => {
    if (customer && !form) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        status: customer.status,
      })
    }
  }, [customer, form])

  const updateMutation = useMutation({
    mutationFn: (data) => customersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setEditing(false)
      setEditError('')
    },
    onError: (err) => {
      setEditError(err.response?.data?.error || 'Update failed')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      navigate('/customers')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="p-8 text-center text-red-600">Customer not found.</div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{customer.company || 'No company'}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setEditing(false); setEditError('') }}
                >
                  <X size={14} /> Cancel
                </Button>
                <Button
                  size="sm"
                  loading={updateMutation.isPending}
                  onClick={() => updateMutation.mutate(form)}
                >
                  <Check size={14} /> Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 size={14} /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm('Delete this customer and all their deals?')) {
                      deleteMutation.mutate()
                    }
                  }}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">Contact Info</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {editing && form ? (
                <>
                  <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <Input
                    label="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <Select
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="LEAD">Lead</option>
                    <option value="INACTIVE">Inactive</option>
                  </Select>
                  {editError && (
                    <p className="text-sm text-red-600">{editError}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Mail size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{customer.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="text-sm text-gray-900">{customer.company || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <Badge value={customer.status} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer since</p>
                    <p className="text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Deals */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">
                Deals ({customer.deals?.length || 0})
              </h2>
            </CardHeader>
            {!customer.deals?.length ? (
              <CardBody>
                <p className="text-sm text-gray-500 text-center py-4">No deals yet.</p>
              </CardBody>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.deals.map((deal) => (
                  <div key={deal.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{deal.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Owner: {deal.owner?.name} · Close: {formatDate(deal.closeDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(deal.value)}
                      </span>
                      <Badge value={deal.stage} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
