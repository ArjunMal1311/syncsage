"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle, Database, FileSpreadsheet, Home, PlusCircle, Settings, User } from "lucide-react"
import Link from 'next/link'
import axios from 'axios'

interface User {
  id: string;
  name: string;
  email: string;
  googleSheets: GoogleSheet[];
}

interface GoogleSheet {
  id: string;
  sheetId: string;
  name: string;
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("sheets")
  const [newSheetUrl, setNewSheetUrl] = useState("")
  const [newSheetName, setNewSheetName] = useState("")
  const [sheets, setSheets] = useState<GoogleSheet[]>(user.googleSheets || [])

  const handleAddSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/sheets', { url: newSheetUrl, name: newSheetName })
      if (response.status === 200) {
        setSheets([...sheets, response.data])
        setNewSheetUrl("")
        setNewSheetName("")
      }
    } catch (error) {
      console.error('Failed to add sheet:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6" />
            SyncSage
          </h1>
        </div>
        <nav className="mt-8">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto p-4">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            <span>{user.name}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">Welcome, {user.name}</h2>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Connected Sheets */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Connected Google Sheets</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="divide-y divide-gray-200">
                  {sheets.map((sheet) => (
                    <Link href={`/syncview/${sheet.id}`} key={sheet.id} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-5 w-5 text-green-500" />
                        <span>{sheet.name}</span>
                      </div>
                      <Badge variant="default">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </Link>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Add New Sheet */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Google Sheet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSheet} className="space-y-4">
                <div>
                  <label htmlFor="sheet-name" className="block text-sm font-medium text-gray-700">
                    Sheet Name
                  </label>
                  <Input
                    id="sheet-name"
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    placeholder="My New Sheet"
                  />
                </div>
                <div>
                  <label htmlFor="sheet-url" className="block text-sm font-medium text-gray-700">
                    Google Sheet URL
                  </label>
                  <Input
                    id="sheet-url"
                    value={newSheetUrl}
                    onChange={(e) => setNewSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                </div>
                <Button type="submit">Add Sheet</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}