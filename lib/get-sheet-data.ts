import { db } from "./db"
import axios from 'axios'

interface GoogleSheetCell {
  formattedValue?: string;
}

interface GoogleSheetRow {
  values: GoogleSheetCell[];
}

export const getSheetData = async (id: string) => {
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

    const rows: string[][] = sheetData.values.map(row => 
        row.map(cell => cell || '')
    )

    const updatedSheet = await db.googleSheet.update({
        where: { id },
        data: {
            updatedAt: new Date(),
            syncEvents: {
                create: {
                    status: 'completed',
                    userId: sheet.userId,
                    sheetRows: {
                        create: rows.map((row, index) => ({
                            rowNumber: index,
                            rowData: row,
                        })),
                    },
                },
            },
        },
        include: { 
            syncEvents: { 
                include: { 
                    sheetRows: true 
                } 
            } 
        },
    })

    return updatedSheet
}