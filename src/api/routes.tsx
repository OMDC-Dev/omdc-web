const PROD = 'https://server.omdc.online/';
const DEV = 'http://127.0.0.1:8080/';
export const DRIVE_API =
  'https://script.google.com/macros/s/AKfycbwhxNwmUw289LNqMF9ger1Hf4X0VUPGBQkhVWgmkVNrhA2i8fFED0kXn1YI20H0Gfrq/exec';

export const BASE_URL = DEV;

// AUTH
export const LOGIN = 'user/login';
export const LOGOUT = 'user/logout';
export const USER_KODE_AKSES = (id: number) => `user/kodeakses/${id}`;
export const USER_COMPLETE = 'user/complete';
export const UPDATE_PASSWORD = 'user/update-password';
export const GET_NOTIFICATION = 'pengumuman';
export const GET_NOTIFICATION_COUNT = 'pengumuman/count';
export const READ_NOTIFICATION = (id: number) => {
  return `pengumuman/read/${id}`;
};
export const DELETE_PENGUMUMAN = (pid: number) => {
  return `pengumuman/${pid}`;
};

// REIMBURSEMENT
export const GET_CABANG = 'cabang';
export const REIMBURSEMENT = 'reimbursement';
export const REIMBURSEMENT_DETAIL = (id: number) => {
  return `reimbursement/${id}`;
};
export const REIMBURSEMENT_ACCEPTANCE = (id: number) => {
  return `reimbursement/status/${id}`;
};
export const REIMBURSEMENT_UPDATE_ADMIN = (id: string, adminId: string) =>
  `reimbursement/update-admin/${id}?adminId=${adminId}`;

// BANK
export const GET_BANK = 'bank';
export const GET_BANK_NAME = (code: string, number: string) => {
  return `bank/name?code=${code}&number=${number}`;
};

// SUPERUSER
export const SUPERUSER = 'superuser';
export const SUPERUSER_REIMBURSEMENT = 'superuser/reimbursement';
export const PENGAJUAN = 'superuser/pengajuan';
export const SUPERUSER_GET_USER = 'superuser/userlist';
export const SUPERUSER_BARANG = 'superuser/barang';
export const DELETE_SUPERUSER = (id: string) => {
  return `superuser/delete/${id}`;
};
export const SUPERUSER_REPORT_EXPORT = (
  startDate: string,
  endDate: string,
  cabang?: string,
  bank?: string,
  tipe?: string,
) => {
  return `superuser/reimbursement/report?startDate=${startDate}&endDate=${endDate}&cabang=${cabang}&bank=${bank}&tipe=${tipe}`;
};

// FINANCE
export const FINANCE_PENGAJUAN = 'finance/pengajuan';
export const FINANCE_ACCEPTANCE = (id: number, status: string) => {
  return `finance/acceptance/${id}?status=${status}`;
};
export const FINANCE_UPDATE_COA = (id: any) => {
  return `finance/update-coa/${id}`;
};

// REQUEST BARANG
export const GET_CABANG_BY_INDUK = (id: number) => {
  return `anakcabang?kd_induk=${id}`;
};
export const GET_CABANG_DETAIL = (id: number) => {
  return `anakcabang/detail?kode=${id}`;
};
export const GET_BARANG = (query = '') => {
  return `barang?cari=${query}`;
};
export const CREATE_REQUEST_BARANG = 'barang/create';
export const LIST_REQUEST_BARANG = 'barang/requested';
export const DETAIL_REQUEST_BARANG = (id: number) => {
  return `barang/requested/detail?id_pb=${id}`;
};
export const BARANG = 'barang';

// DEPT
export const DEPT = 'dept';

// COA
export const GET_COA = (key = '') => {
  return `coa?cari=${key}`;
};

export const COA = 'coa';

// SUPLIER
export const GET_SUPLIER = '/suplier';

// ICON
export const GET_ICON = '/icon';
export const UPDATE_ICON = '/updateIcon';

// Reviwer
export const GET_UNREVIEW_REIMBURSEMENT = 'reviewer/reimbursement';
export const ACCEPT_REVIEW_REIMBURSEMENT = (id: number) =>
  `reviewer/accept/${id}`;

// Maker
export const GET_MAKER_REIMBURSEMENT = 'maker/reimbursement';
export const ACCEPT_MAKER_REIMBURSEMENT = (id: number) => `maker/accept/${id}`;

export const REIMBURSEMENT_ACCEPTANCE_EXTRA = (id: number) => {
  return `reimbursement/extra/${id}`;
};
export const REIMBURSEMENT_REUPLOAD_FILE = (id: string) =>
  `reimbursement/reupload-file/${id}`;

// ADMIN PB
export const GET_ADMIN_PB = '/adminpb';
export const ADMIN_PB = (iduser: string) => `/adminpb/${iduser}`;
export const BARANG_ADMIN_APPROVAL = (id: string, mode: string) =>
  `barang/admin-approval/${id}/${mode}`;

// Master Barang
export const GET_GROUP_BARANG = 'barang/grup';
export const GET_KATEGORY_BARANG = 'barang/kategory';
export const GET_KEMASAN = 'barang/kemasan';
export const GET_SATUAN = 'barang/satuan';
export const CEK_BARKODE_BARANG = (code: string) =>
  `barang/cek-barkode/${code}`;
export const CREATE_BARANG = 'barang/add';
export const UPDATE_BARANG = (kode: string) => `barang/update/${kode}`;

// Invoice
export const CEK_INVOICE = (inv: string) => `invoice/${inv}`;
