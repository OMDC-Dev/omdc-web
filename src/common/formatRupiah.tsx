function formatRupiah(num: any, usePrefix: boolean) {
  if (!num) {
    return usePrefix ? `Rp. 0` : 0;
  }

  let rupiahFormat = num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return usePrefix ? `Rp. ${rupiahFormat}` : rupiahFormat;
}

export default formatRupiah;
