function formatRupiah(num: any, usePrefix: boolean) {
  let rupiahFormat = num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return usePrefix ? `Rp. ${rupiahFormat}` : rupiahFormat;
}

export default formatRupiah;
