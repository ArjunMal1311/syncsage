import React from 'react'
import SyncView from './_components/SheetComponent'
import { getSheetData } from '@/lib/get-sheet-data'

const Page = async ({ params }: { params: { id: string } }) => {
    try {
        const sheet = await getSheetData(params.id)

        const formattedSheet = {
            ...sheet,
            createdAt: sheet.createdAt.toISOString(),
            updatedAt: sheet.updatedAt.toString(),
        }

        return (
            <SyncView 
                sheet={formattedSheet as any}
            />
        )
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return <div>Error loading sheet data. Please try again later.</div>
    }
}

export default Page