import * as XLSX from 'xlsx';

// export function exportToExcell(
//   data: any[],
//   customHeader: any[],
//   title: string,
// ) {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const aoa = XLSX.utils.sheet_add_aoa(worksheet, [customHeader], {
//     origin: 'A1',
//   });
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, title || 'Report');
//   XLSX.writeFile(workbook, title ? `${title}.xlsx` : 'Report.xlsx');
// }
export function exportToExcell(
  data: any[],
  customHeader: any[],
  title: string,
  additionalSheetData?: { sheetName: string; data: any[]; headers: any[] },
) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1
  const worksheet1 = XLSX.utils.json_to_sheet(data);
  XLSX.utils.sheet_add_aoa(worksheet1, [customHeader], { origin: 'A1' });
  XLSX.utils.book_append_sheet(workbook, worksheet1, title || 'Report');

  // Sheet 2 (optional)
  if (additionalSheetData) {
    const { sheetName, data: sheetData, headers } = additionalSheetData;
    const worksheet2 = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.sheet_add_aoa(worksheet2, [headers], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet2, sheetName || 'Sheet2');
  }

  // Write file
  XLSX.writeFile(workbook, title ? `${title}.xlsx` : 'Report.xlsx');
}
