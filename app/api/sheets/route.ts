import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/current-user'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, name } = await req.json()
    const sheetId = extractSheetId(url)

    if (!sheetId) {
      return NextResponse.json({ error: 'Invalid Google Sheet URL' }, { status: 400 })
    }

    const newSheet = await db.googleSheet.create({
      data: {
        sheetId,
        name,
        userId: currentUser.id,
        columns: [], 
      },
    })

    return NextResponse.json(newSheet, { status: 200 })
  } catch (error) {
    console.error('Failed to add sheet:', error)
    return NextResponse.json({ error: 'Failed to add sheet' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sheets = await db.googleSheet.findMany({
      where: { userId: currentUser.id },
    })

    return NextResponse.json(sheets, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch sheets:', error)
    return NextResponse.json({ error: 'Failed to fetch sheets' }, { status: 500 })
  }
}

function extractSheetId(url: string): string | null {
  const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}
