import React from 'react'
import { redirect } from 'next/navigation'
import Dashboard from './_components/dashboard'
import { getCurrentUser } from '@/lib/current-user'

const DashboardPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return (
    <div>
      <Dashboard user={currentUser} />
    </div>
  )
}

export default DashboardPage