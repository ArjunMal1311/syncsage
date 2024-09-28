"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, ChevronDown, User, Lock, Database, Bell, Key, FileSpreadsheet, Home, Settings } from "lucide-react"

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  // Add other user properties as needed
}

interface UserSettingsProps {
  user: User
}

export default function UserSettings({ user }: UserSettingsProps) {
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    company: user.company || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [syncPreferences, setSyncPreferences] = useState({
    frequency: '1h',
    notifications: true,
    apiKey: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  })

  const handleProfileChange = (e : any) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e : any) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSyncPreferenceChange = (name : string, value : any) => {
    setSyncPreferences(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = (e : any) => {
    e.preventDefault()
    console.log('Profile updated:', profileForm)
  }

  const handlePasswordSubmit = (e : any) => {
    e.preventDefault()
    console.log('Password changed:', passwordForm)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6" />
            SyncSage
          </h1>
        </div>
        <nav className="mt-8">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <h1 className="text-3xl font-bold px-4 py-4 mb-6 pl-8 bg-white w-full">User Settings</h1>
        <div className="container mx-auto py-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="profile">
              <AccordionTrigger className="text-xl font-semibold">
                <User className="mr-2" /> Profile Information
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Update Your Profile</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profileForm.company}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <Button type="submit">Update Profile</Button>
                    </form>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="password">
              <AccordionTrigger className="text-xl font-semibold">
                <Lock className="mr-2" /> Change Password
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Change Your Password</CardTitle>
                    <CardDescription>Ensure your account is using a strong password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <Button type="submit">Change Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accounts">
              <AccordionTrigger className="text-xl font-semibold">
                <Database className="mr-2" /> Connected Accounts
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Connected Accounts</CardTitle>
                    <CardDescription>Control your connected Google and database accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="google" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="google">Google Accounts</TabsTrigger>
                        <TabsTrigger value="database">Database Accounts</TabsTrigger>
                      </TabsList>
                      <TabsContent value="google">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">john.doe@gmail.com</p>
                              <p className="text-sm text-gray-500">Connected on 2023-05-15</p>
                            </div>
                            <Button variant="outline">Disconnect</Button>
                          </div>
                          <Button>
                            <CheckCircle className="mr-2 h-4 w-4" /> Connect Another Google Account
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="database">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Main PostgreSQL Database</p>
                              <p className="text-sm text-gray-500">Connected on 2023-06-01</p>
                            </div>
                            <Button variant="outline">Disconnect</Button>
                          </div>
                          <Button>
                            <CheckCircle className="mr-2 h-4 w-4" /> Connect New Database
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sync">
              <AccordionTrigger className="text-xl font-semibold">
                <Bell className="mr-2" /> Sync Preferences
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Settings</CardTitle>
                    <CardDescription>Customize your sync preferences and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <Select
                        value={syncPreferences.frequency}
                        onValueChange={(value) => handleSyncPreferenceChange('frequency', value)}
                      >
                        <SelectTrigger id="sync-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">Every 15 minutes</SelectItem>
                          <SelectItem value="30m">Every 30 minutes</SelectItem>
                          <SelectItem value="1h">Every hour</SelectItem>
                          <SelectItem value="6h">Every 6 hours</SelectItem>
                          <SelectItem value="12h">Every 12 hours</SelectItem>
                          <SelectItem value="24h">Every 24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={syncPreferences.notifications}
                        onCheckedChange={(checked) => handleSyncPreferenceChange('notifications', checked)}
                      />
                      <Label htmlFor="notifications">Enable sync notifications</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex">
                        <Input
                          id="api-key"
                          value={syncPreferences.apiKey}
                          onChange={(e) => handleSyncPreferenceChange('apiKey', e.target.value)}
                          type="password"
                          className="flex-grow"
                        />
                        <Button variant="outline" className="ml-2">
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Use this API key to access SyncSage programmatically</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  )
}