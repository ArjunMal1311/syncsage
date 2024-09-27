import React from 'react'
import { redirect } from 'next/navigation'
import UserSettings from './_components/settings'
import { getCurrentUser } from '@/lib/current-user'

const SettingsPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return (
    <div>
      <UserSettings user={currentUser} />
    </div>
  )
}

export default SettingsPage