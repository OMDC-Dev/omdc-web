export function hitungTotalNominal(data: any) {
  let total = 0;
  data.forEach((item: any) => {
    // Hilangkan "Rp" dan koma, lalu ubah ke tipe number
    const nominal = Number(
      item.nominal.replace('Rp', '').replace('/./g', '').trim(),
    );
    // Tambahkan nominal ke total
    total += nominal;
  });
  return total;
}
