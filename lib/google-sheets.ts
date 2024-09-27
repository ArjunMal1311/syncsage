import { google } from 'googleapis';

const sheets = google.sheets('v4');

export const getGoogleSheetData = async (spreadsheetId: string, range: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values;
};

export const updateGoogleSheetData = async (
  spreadsheetId: string,
  range: string,
  values: any[]
) => {
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });
  return response.data;
};