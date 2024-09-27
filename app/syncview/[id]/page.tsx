import { db } from '@/lib/db'
import React from 'react'
import SyncView from './_components/SheetComponent'
import { notFound } from 'next/navigation'
import { getSheetData } from '@/lib/get-sheet-data'

const Page = async ({ params }: { params: { id: string } }) => {

        const sheet = await getSheetData(params.id)

        const lastSyncEvent = sheet.syncEvents[0]
        const isSyncing = lastSyncEvent?.status === 'SYNCING'
        const lastSyncTime = lastSyncEvent?.createdAt.toISOString() || ''

        const formattedSheet = {
            ...sheet,
            createdAt: sheet.createdAt.toISOString(),
            updatedAt: sheet.updatedAt.toISOString(),
            syncEvents: sheet.syncEvents.map(event => ({
                ...event,
                createdAt: event.createdAt.toISOString(),
                updatedAt: event.updatedAt.toISOString(),
            })),
        }

        return (
            <SyncView 
                sheet={formattedSheet as any}
            />
        )
    
}

export default Page