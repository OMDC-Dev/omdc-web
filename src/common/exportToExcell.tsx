import * as XLSX from 'xlsx';
import { formatCurrencyToNumber } from './utils';
import moment from 'moment';

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
  additionalSheetData2?: { sheetName: string; data: any[]; headers: any[] },
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

  // Sheet 2 (optional)
  if (additionalSheetData2) {
    const { sheetName, data: sheetData, headers } = additionalSheetData2;
    const worksheet3 = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.sheet_add_aoa(worksheet3, [headers], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet3, sheetName || 'Sheet3');
  }

  // Write file
  XLSX.writeFile(workbook, title ? `${title}.xlsx` : 'Report.xlsx');
}

export const createReportData = (data = []): any => {
  const dataMap = data.map((itemCol, index) => {
    const {
      id,
      no_doc,
      jenis_reimbursement,
      tanggal_reimbursement,
      kode_cabang,
      requester_id,
      requester_name,
      name,
      coa,
      item,
      description,
      nominal,
      status,
      status_finance,
      finance_by,
      bank_detail,
      payment_type,
      accepted_date,
      accepted_by,
      realisasi,
      tipePembayaran,
      finance_bank,
      createdAt,
      attachment,
      maker_approve,
      reviewer_approve,
      pengajuan_ca,
      parentDoc,
      childDoc,
      finance_note,
      maker_note,
      bukti_attachment,
      remarked,
    }: any = itemCol;

    // get reference dok
    const getRefDok = () => {
      if (jenis_reimbursement == 'Cash Advance') {
        return childDoc;
      } else if (jenis_reimbursement == 'Cash Advance Report') {
        return parentDoc;
      } else {
        return '';
      }
    };

    const getSaldo = (): number => {
      let saldo: number = 0;
      if (jenis_reimbursement == 'Cash Advance Report') {
        const intNominal = parseInt(
          pengajuan_ca.replace('Rp. ', '').replace(/\./g, ''),
        );
        const intRealisasi = parseInt(
          nominal.replace('Rp. ', '').replace(/\./g, ''),
        );

        saldo = intNominal - intRealisasi;
      }

      return saldo;
    };

    const getBankInfo = () => {
      if (payment_type == 'CASH') {
        return {
          name: requester_name ? requester_name.toUpperCase() : '',
          no: '-',
          bank: '-',
        };
      } else {
        return {
          name: bank_detail.accountname
            ? bank_detail.accountname.toUpperCase()
            : '',
          no: bank_detail.accountnumber,
          bank: bank_detail.bankname,
        };
      }
    };

    const getPaidStatus = () => {
      if (status_finance == 'DONE') {
        return 'PAID';
      } else if (status_finance == 'WAITING') {
        return 'WAITING FINANCE APPROVAL';
      } else if (status_finance == 'IDLE') {
        return 'ON GOING APPROVAL';
      } else {
        return status_finance;
      }
    };

    const getFinAcceptDate = () => {
      if (status_finance == 'DONE') {
        return moment(finance_by.acceptDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
      } else {
        return '-';
      }
    };

    const getTotalPayment = () => {
      if (jenis_reimbursement == 'Cash Advance Report') {
        const saldo = getSaldo();

        if (saldo >= 0) {
          return 0;
        } else {
          return Math.abs(saldo);
        }
      } else {
        return formatCurrencyToNumber(nominal);
      }
    };

    const standardizeDate = (dateString: string) => {
      const formats = ['YYYY-MM-DD', 'DD-MM-YYYY'];
      return moment(dateString, formats, true).format('DD-MM-YYYY');
    };

    // normalize
    const nCabang = kode_cabang.split(' - ')[1].toUpperCase();
    const invMap = item.map((item: any) => item.invoice).join(' |#| ');
    const nNominal = formatCurrencyToNumber(nominal);
    const nNominalCA = formatCurrencyToNumber(pengajuan_ca);
    const nRefDok = getRefDok();
    const nSaldo = getSaldo();
    const nTotalPayment = getTotalPayment();
    const nPaidStatus = getPaidStatus();
    const acceptDate = getFinAcceptDate();
    const nPeriod = moment(maker_approve, 'DD-MM-YYYY')
      .locale('id')
      .format('MMMM')
      .toUpperCase();
    const nDateROP = standardizeDate(tanggal_reimbursement);

    return {
      no: index + 1,
      no_doc,
      nCabang,
      requester_name: requester_name.toUpperCase(),
      tanggal_reimbursement: nDateROP,
      jenis_reimbursement: jenis_reimbursement.toUpperCase(),
      invMap,
      description,
      nNominal,
      nRefDok,
      nNominalCA,
      nSaldo,
      nTotalPayment,
      accName: getBankInfo().name,
      accNo: getBankInfo().no,
      accBank: getBankInfo().bank,
      finance_bank,
      nPaidStatus,
      acceptDate,
      maker_approve: maker_approve || '-',
      nPeriod,
      maker_note,
      finance_note,
      attachment,
      bukti_attachment,
      remarked:
        jenis_reimbursement == 'Cash Advance Report'
          ? remarked
            ? 'SUDAH DICEK'
            : 'BELUM DICEK'
          : 'BUKAN REPORT',
    };
  });

  return dataMap;
};
