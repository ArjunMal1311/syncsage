"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ArrowLeft, CheckCircle, FileSpreadsheet, Pause, Play, RefreshCw, Settings } from "lucide-react"
import { toast, Toaster } from 'sonner'
import axios from 'axios'
import { Input } from "@/components/ui/input"


interface SyncViewProps {
    sheet: {
        id: string;
        sheetId: string;
        name: string;
        userId: string;
        columns: any[];
        createdAt: string;
        updatedAt: string;
        syncEvents: {
            id: string;
            userId: string;
            googleSheetId: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            sheetRows: {
                id: string;
                syncEventId: string;
                rowData: any[];
                rowNumber: number;
                createdAt: string;
                updatedAt: string;
            }[];
        }[];
    };
}

export default function SyncView({ sheet }: SyncViewProps) {
    const lastSyncEvent = sheet.syncEvents[sheet.syncEvents.length - 1];
    const [isSyncing, setIsSyncing] = useState(lastSyncEvent?.status === 'SYNCING');
    const [lastSyncTime, setLastSyncTime] = useState(lastSyncEvent?.createdAt || '');
    const [editedCell, setEditedCell] = useState<{ row: number, col: number, value: string } | null>(null);
    const [sheetData, setSheetData] = useState(lastSyncEvent?.sheetRows.map(row => row.rowData) || []);

    const maxColumns = Math.max(...sheetData.map(row => row.length));

    const toggleSync = async () => {
        try {
            const response = await axios.post(`/api/sheets/${sheet.id}/sync`, { action: isSyncing ? 'pause' : 'resume' })
            setIsSyncing(!isSyncing)
            toast(isSyncing ? 'Sync paused' : 'Sync resumed', { icon: isSyncing ? '⏸️' : '▶️' })
        } catch (error) {
            console.error('Failed to toggle sync:', error)
            toast.error('Failed to toggle sync')
        }
    }

    const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
        const newSheetData = [...sheetData];
        newSheetData[rowIndex][colIndex] = value;
        setSheetData(newSheetData);
    }

    const handleCellBlur = async (rowIndex: number, colIndex: number, value: string) => {
        const column = String.fromCharCode(65 + colIndex);
        const row = rowIndex + 1;
        const range = `Sheet1!${column}${row}`;

        try {
            const response = await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${sheet.sheetId}/values/${range}?valueInputOption=RAW`
            );

            if (response.status === 200) {
                toast.success('Cell updated successfully');
                const newSheetData = [...sheetData];
                newSheetData[rowIndex][colIndex] = value;
                setSheetData(newSheetData);
            } else {
                throw new Error('Failed to update cell');
            }
        } catch (error) {
            console.error('Failed to update cell:', error);
            toast.error('Failed to update cell');
        }
    }

    console.log(sheet)

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
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Dashboard
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Toaster />
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">Sync View: {sheet.name}</h2>
                        <div className="flex items-center space-x-4">
                            <Badge variant={isSyncing ? "default" : "secondary"} className="text-sm py-1">
                                {isSyncing ? (
                                    <><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Syncing</>
                                ) : (
                                    <><Pause className="mr-1 h-3 w-3" /> Paused</>
                                )}
                            </Badge>
                            <Button onClick={toggleSync}>
                                {isSyncing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                {isSyncing ? 'Pause Sync' : 'Resume Sync'}
                            </Button>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Sync Settings
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Google Sheet Data */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Google Sheet Data</CardTitle>
                            <CardDescription>Live preview of the Google Sheet data (editable)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Array.from({ length: maxColumns }).map((_, index) => (
                                            <TableHead key={index}>Column {index + 1}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sheetData.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {Array.from({ length: maxColumns }).map((_, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <Input
                                                        value={row[cellIndex] || ''}
                                                        onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                                                        onBlur={(e) => handleCellBlur(rowIndex, cellIndex, e.target.value)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Sync Information card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Sync Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Last Sync</p>
                                    <p className="text-2xl font-bold">{new Date(lastSyncTime).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Sync Frequency</p>
                                    <p className="text-2xl font-bold">Every 15 minutes</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Total Records</p>
                                    <p className="text-2xl font-bold">{lastSyncEvent?.sheetRows.length || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sync Logs card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sync Logs</CardTitle>
                            <CardDescription>Recent synchronization events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sheet.syncEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{new Date(event.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>Sync Event</TableCell>
                                                <TableCell>
                                                    {event.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                                    {event.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                                    {event.status === 'SYNCING' && <RefreshCw className="h-5 w-5 text-blue-500" />}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}