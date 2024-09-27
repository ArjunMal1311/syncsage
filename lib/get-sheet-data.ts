import { db } from "./db"
import axios from 'axios'

export const getSheetData = async (id: string) => {
    console.log(`Fetching data for sheet ID: ${id}`);
    const sheet = await db.googleSheet.findUnique({ where: { id } })
    if (!sheet) throw new Error("Sheet not found")

    console.log(`Fetching Google Sheets data for sheet ID: ${sheet.sheetId}`);
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

    console.log(`Returning data for sheet ID: ${id}`);
    return {
        ...sheet,
        rows,
        updatedAt: new Date().toISOString(),
    }
}