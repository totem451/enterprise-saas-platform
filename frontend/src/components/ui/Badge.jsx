import React from 'react'

const statusColors = {
  // Customer status
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  LEAD: 'bg-blue-100 text-blue-800',
  // Deal stages
  PROSPECTING: 'bg-slate-100 text-slate-700',
  QUALIFICATION: 'bg-purple-100 text-purple-800',
  PROPOSAL: 'bg-amber-100 text-amber-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  CLOSED_WON: 'bg-green-100 text-green-800',
  CLOSED_LOST: 'bg-red-100 text-red-800',
  // Role
  ADMIN: 'bg-indigo-100 text-indigo-800',
  VIEWER: 'bg-gray-100 text-gray-700',
}

const labels = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LEAD: 'Lead',
  PROSPECTING: 'Prospecting',
  QUALIFICATION: 'Qualification',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Won',
  CLOSED_LOST: 'Lost',
  ADMIN: 'Admin',
  VIEWER: 'Viewer',
}

export function Badge({ value, className = '' }) {
  const colorClass = statusColors[value] || 'bg-gray-100 text-gray-700'
  const label = labels[value] || value

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {label}
    </span>
  )
}
