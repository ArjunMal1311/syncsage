"use client"
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, FileSpreadsheet, RefreshCw, Settings } from "lucide-react"
import { toast, Toaster } from 'sonner'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { useSocket } from "@/providers/socket-provider"
import { google } from 'googleapis'

interface SyncViewProps {
    sheet: {
        id: string;
        sheetId: string;
        name: string;
        userId: string;
        columns: any[];
        createdAt: string;
        updatedAt: string;
        rows: string[][];
    };
}

export default function SyncView({ sheet: initialSheet }: SyncViewProps) {
    const [sheet, setSheet] = useState(initialSheet);
    const { socket, isConnected, subscribeToSheet, unsubscribeFromSheet } = useSocket();
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    const handleSheetUpdate = useCallback((updatedSheet: any) => {
        console.log("Received sheet update:", updatedSheet);
        setSheet(updatedSheet);
        setLastUpdateTime(new Date());
        toast.success('Sheet data updated');
    }, []);

    useEffect(() => {
        console.log("Socket connection status:", isConnected);
        if (isConnected) {
            console.log("Subscribing to sheet:", sheet.id);
            subscribeToSheet(sheet.id);

            socket.on('sheet_update', handleSheetUpdate);

            return () => {
                console.log("Unsubscribing from sheet:", sheet.id);
                unsubscribeFromSheet();
                socket.off('sheet_update', handleSheetUpdate);
            };
        }
    }, [isConnected, sheet.id, subscribeToSheet, unsubscribeFromSheet, socket, handleSheetUpdate]);

    const [sheetData, setSheetData] = useState(sheet.rows || []);

    useEffect(() => {
        setSheetData(sheet.rows || []);
    }, [sheet]);

    const maxColumns = Math.max(...sheetData.map(row => row.length));

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
            const response = await fetch('/api/updateSheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sheetId: sheet.sheetId,
                    range: range,
                    value: value
                }),
            });

            const result = await response.json();

            if (result.success) {
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
                            {isConnected ? (
                                <Badge variant="default" className="text-sm py-1">
                                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Syncing
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-sm py-1">
                                    Offline
                                </Badge>
                            )}
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
                                    {sheetData.map((row : any, rowIndex : any) => (
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
                                    <p className="text-2xl font-bold">{lastUpdateTime.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Sync Frequency</p>
                                    <p className="text-2xl font-bold">Every 10 seconds</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Total Records</p>
                                    <p className="text-2xl font-bold">{sheetData.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}