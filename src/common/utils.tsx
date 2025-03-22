import moment from 'moment/min/moment-with-locales';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');
import { useAuth } from '../hooks/useAuth';
import formatRupiah from './formatRupiah';

export function hitungTotalNominal(data: any) {
  let total = 0;
  data.forEach((item: any) => {
    // Ambil nominal dan konversi ke number
    const nominalString = item.nominal.trim();

    // Pisahkan bagian desimal dan ambil maksimal 2 angka di belakang koma
    const parts = nominalString.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : '00'; // Ambil maksimal 2 angka desimal

    // Gabungkan kembali dan konversi ke number
    const nominal = Number(integerPart + '.' + decimalPart);
    // Tambahkan nominal ke total
    total += nominal;
  });
  return total;
}

export function unformatRupiah(rupiah: any) {
  // Mengganti koma dengan titik, menghapus titik ribuan, dan menghapus 'Rp'
  return rupiah.replace(/,/g, '.').replace(/\./g, '').replace('Rp', '').trim();
}

export const downloadPDF = (base64Data: string, fileName: string) => {
  // Membuat blob dari data Base64
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Membuat URL objek untuk blob
  const url = URL.createObjectURL(blob);

  // Membuat link untuk mengunduh file PDF
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'document.pdf';

  // Klik link secara otomatis untuk memicu unduhan
  a.click();

  // Menghapus URL objek setelah digunakan
  URL.revokeObjectURL(url);
};

export const downloadPDFDirect = (url: string, fileName: string) => {
  // Membuat link untuk mengunduh file PDF
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'document.pdf';

  // Klik link secara otomatis untuk memicu unduhan
  a.click();

  // Menghapus URL objek setelah digunakan
  URL.revokeObjectURL(url);
};

export function getDataById(data: any, id: any, idKey: string, key: string) {
  for (var i = 0; i < data?.length; i++) {
    if (data[i][idKey] === id) {
      return data[i][key];
    }
  }
}

export function generateRandomNumber(min: number, max: number) {
  // Menghasilkan nomor acak di antara min (inklusif) dan max (inklusif)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const cekAkses = (akses: string) => {
  /**
   * REIMBURSEMENT -> 1170 -> #1
   * PERMINTAAN BARANG -> 1157 -> #2
   * PENGUMUMAN -> 1171 -> #3
   * EXPORT EXCELL -> 1175 -> #4
   * PAYMENT REQUEST -> 1176 -> #5
   * NO PB NEED ATTACHMENT -> 1179 -> #6
   * ADMIN PB -> 999123 -> #7
   * NO NEED APPROVAL -> 1177 -> #8
   * MASTER BARANG -> 1128 -> #9
   * ACCEPT MULTIPLE -> 1190 -> #10
   * WORKPLAN -> 1199 -> #11
   */
  const { user } = useAuth();

  const kd = user?.kodeAkses;

  if (akses == '#1') {
    return kd.findIndex((item: string) => item == '1170') !== -1;
  }

  if (akses == '#2') {
    return kd.findIndex((item: string) => item == '1157') !== -1;
  }

  if (akses == '#3') {
    return kd.findIndex((item: string) => item == '1171') !== -1;
  }

  if (akses == '#4') {
    return kd.findIndex((item: string) => item == '1175') !== -1;
  }

  if (akses == '#5') {
    return kd.findIndex((item: string) => item == '1176') !== -1;
  }

  if (akses == '#6') {
    return kd.findIndex((item: string) => item == '1179') !== -1;
  }

  if (akses == '#7') {
    return kd.findIndex((item: string) => item == '999123') !== -1;
  }

  if (akses == '#8') {
    return kd.findIndex((item: string) => item == '1177') !== -1;
  }

  if (akses == '#9') {
    return kd.findIndex((item: string) => item == '1128') !== -1;
  }

  if (akses == '#10') {
    return kd.findIndex((item: string) => item == '1190') !== -1;
  }

  if (akses == '#11') {
    return kd.findIndex((item: string) => item == '1199') !== -1;
  }
};

export function compressImage(
  file: File,
  maxSize: number,
  handleAttachment: any,
) {
  const image = new Image();
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = () => {
    image.src = reader.result as string;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      let scaleFactor = 1;

      if (file.size > maxSize) {
        scaleFactor = maxSize / file.size;
      }

      canvas.width = image.width * scaleFactor;
      canvas.height = image.height * scaleFactor;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
          });

          handleAttachment({
            target: {
              files: [compressedFile],
            },
          });
        },
        'image/jpeg',
        0.7,
      ); // Adjust quality as needed
    };
  };
}

// ===== function to calculate saldo
export const calculateSaldo = (nominal = '', realisasi = '') => {
  if (!nominal || !realisasi) {
    return '-';
  }

  const intNominal = parseInt(nominal.replace('Rp. ', '').replace(/\./g, ''));
  const intRealisasi = parseInt(
    realisasi.replace('Rp. ', '').replace(/\./g, ''),
  );

  const saldo = intNominal - intRealisasi;

  return 'Rp. ' + formatRupiah(saldo, false);
};

export function hitungSelisihHari(tanggalAwal: Date, tanggalAkhir: Date) {
  // Menggunakan moment untuk membuat objek tanggal dari string atau tipe data tanggal JavaScript
  const awal = moment(tanggalAwal);
  const akhir = moment(tanggalAkhir);

  // Menghitung selisih dalam hari
  const selisih = akhir.diff(awal, 'days');

  return selisih;
}

export function formatAmount(amountString: string) {
  // Hapus 'Rp.', spasi, dan koma dari string
  const cleanedString = amountString.replace(/Rp\.|\s|,/g, '');
  // Parse string menjadi bilangan bulat
  const amount = parseInt(cleanedString, 10);
  return amount;
}

export function formatCurrencyToNumber(currencyString: string) {
  if (!currencyString) return 0;

  // Hapus 'Rp.' di awal string (jika ada) dan semua titik sebagai pemisah ribuan
  let cleanedString = currencyString
    .replace(/^Rp\.?\s?/, '')
    .replace(/\./g, '');

  // Ganti koma menjadi titik sebagai pemisah desimal
  cleanedString = cleanedString.replace(',', '.');

  return parseFloat(cleanedString) || 0;
}

function convertToPreviewLink(downloadLink: string) {
  const downloadPrefix = 'https://drive.google.com/uc?export=download&id=';
  const previewPrefix = 'https://drive.google.com/file/d/';
  const previewSuffix = '/preview';

  if (downloadLink.startsWith(downloadPrefix)) {
    const fileId = downloadLink.slice(downloadPrefix.length);
    return `${previewPrefix}${fileId}${previewSuffix}`;
  } else {
    return 'Invalid download link format';
  }
}

export const openInNewTab = (url: string) => {
  const previewUrl = convertToPreviewLink(url);
  window.open(previewUrl, '_blank', 'noreferrer');
};

export const getFormattedDateTable = (date: any, format?: any) => {
  if (!date) {
    return '-';
  }

  return moment(date).format(format ?? 'LL');
};

export const removeFromState = (
  stateData = [],
  value: any,
  setState: any,
  stateKey = '',
) => {
  const filterState = stateData.filter(
    (item) => item[stateKey] !== value[stateKey],
  );

  setState(filterState);
};

export const standardizeDate = (dateString?: string | Date) => {
  const formats = ['YYYY-MM-DD', 'DD-MM-YYYY'];
  return moment(dateString, formats, true).format('DD-MM-YYYY');
};
