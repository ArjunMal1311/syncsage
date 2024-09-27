import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { sheetId, range, value } = await request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    
    const googleSheets = google.sheets({ version: 'v4', auth: client as any });

    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[value]]
      }
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Failed to update cell:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cell' }, { status: 500 });
  }
}