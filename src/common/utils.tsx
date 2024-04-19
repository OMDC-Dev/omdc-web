import moment from 'moment';
import { useAuth } from '../hooks/useAuth';
import formatRupiah from './formatRupiah';

export function hitungTotalNominal(data: any) {
  let total = 0;
  data.forEach((item: any) => {
    // Hilangkan "Rp" dan koma, lalu ubah ke tipe number
    const nominal = Number(
      item.nominal.replace(/\./g, '').replace('Rp', '').trim(),
    );
    // Tambahkan nominal ke total
    total += nominal;
  });
  return total;
}

export function unformatRupiah(rupiah: any) {
  return rupiah.replace(/\./g, '').replace('Rp', '').trim();
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
