import * as XLSX from 'xlsx';

export function exportToExcell(
  data: any[],
  customHeader: any[],
  title: string,
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const aoa = XLSX.utils.sheet_add_aoa(worksheet, [customHeader], {
    origin: 'A1',
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title || 'Report');
  XLSX.writeFile(workbook, title ? `${title}.xlsx` : 'Report.xlsx');
}
