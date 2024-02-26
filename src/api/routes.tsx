const PROD = 'https://server.omdc.online/';
const DEV = 'http://127.0.0.1:8080/';

export const BASE_URL = PROD;

// AUTH
export const LOGIN = 'user/login';
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

// BANK
export const GET_BANK = 'bank';
export const GET_BANK_NAME = (code: string, number: string) => {
  return `bank/name?code=${code}&number=${number}`;
};

// SUPERUSER
export const SUPERUSER = 'superuser';
export const PENGAJUAN = 'superuser/pengajuan';
export const SUPERUSER_GET_USER = 'superuser/userlist';
export const DELETE_SUPERUSER = (id: string) => {
  return `superuser/delete/${id}`;
};
export const FINANCE_PENGAJUAN = 'finance/pengajuan';
export const FINANCE_ACCEPTANCE = (id: number) => {
  return `finance/acceptance/${id}?status=DONE`;
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

// DEPT
export const DEPT = 'dept';
