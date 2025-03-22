function formatRupiah(num: any, usePrefix: boolean) {
  if (!num) {
    return usePrefix ? `Rp. 0` : 0;
  }

  // Mengkonversi angka menjadi string dan memisahkan bagian integer dan desimal
  const [integerPart, decimalPart] = num.toString().split('.');

  // Format bagian integer
  let rupiahFormat = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Ambil maksimal 2 angka di belakang koma
  if (decimalPart) {
    rupiahFormat += `,${decimalPart.slice(0, 2)}`; // Ambil maksimal 2 angka
  }

  return usePrefix ? `Rp. ${rupiahFormat}` : rupiahFormat;
}

export default formatRupiah;
