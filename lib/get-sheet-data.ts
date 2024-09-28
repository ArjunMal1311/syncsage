import { db } from "./db"
import axios from 'axios'

export const getSheetData = async (id: string) => {
    console.log(`Fetching data for sheet ID: ${id}`);
    const sheet = await db.googleSheet.findUnique({ where: { id } })
    if (!sheet) throw new Error("Sheet not found")

    const response = await axios.get<{
        range: string;
        majorDimension: string;
        values: string[][];
    }>(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheet.sheetId}/values/Sheet1!A1:Z100?key=AIzaSyCaLl4bESrb9BMIQjn8JtA_2hUj0zOv6fA`
    )
    const sheetData = response.data

    await db.syncEvent.create({
        data: {
            userId: sheet.userId,
            googleSheetId: sheet.id,
            status: 'completed',
            syncLogs: {
                create: {
                    logMessage: 'Sheet data fetched successfully by Arjun',
                    logLevel: 'info'
                }
            }
        }
    })

    const rows: string[][] = sheetData.values.map(row =>
        row.map(cell => cell || '')
    )

    return {
        ...sheet,
        rows,
        updatedAt: new Date().toISOString(),
    }
}

export async function getLogs(sheetId: string) {
    const logs = await db.syncLog.findMany({
        where: {
            syncEvent: {
                googleSheetId: sheetId
            }
        },
        orderBy: {
            createdAt: 'asc'
        },
        take: 10,
        include: {
            syncEvent: {
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    return logs.map(log => ({
        id: log.id,
        userId: log.syncEvent.userId,
        userName: log.syncEvent.user.name,
        action: log.logMessage,
        logLevel: log.logLevel,
        createdAt: log.createdAt.toISOString()
    }));
}