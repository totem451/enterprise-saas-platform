import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { useRequireAuth } from '../hooks/useAuth.js'

export function Layout() {
  const isAuth = useRequireAuth()

  if (!isAuth) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
