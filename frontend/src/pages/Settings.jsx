import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { User, Lock, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { authApi } from '../api/auth.js'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'

export default function Settings() {
  const { user } = useAuth()
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Passwords do not match')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('Password must be at least 6 characters')
      return
    }
    // In a real app you'd call an API endpoint
    setPwSuccess('Password change functionality would be implemented here.')
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-full text-indigo-700 text-xl font-bold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Role & Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Role & Permissions</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm text-gray-700">Your role:</p>
              <Badge value={user?.role} />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {user?.role === 'ADMIN' ? (
                <>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Create, edit, and delete customers
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Create, edit, and delete deals
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> View all reports and metrics
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Full system access
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> View customers and deals
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> View dashboard metrics
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-red-400">✗</span> Cannot create or modify records
                  </p>
                </>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                placeholder="••••••••"
              />
              <Input
                label="New Password"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
              {pwError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{pwError}</p>
              )}
              {pwSuccess && (
                <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">{pwSuccess}</p>
              )}
              <Button type="submit">Update Password</Button>
            </form>
          </CardBody>
        </Card>

        {/* About */}
        <Card>
          <CardBody>
            <p className="text-sm font-semibold text-gray-900 mb-1">CRM Platform</p>
            <p className="text-xs text-gray-500">
              Version 1.0.0 · Built with React 18, Express 5, Prisma ORM, and SQLite
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
