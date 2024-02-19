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
