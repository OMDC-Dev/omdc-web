import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import {
  Card,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  List,
  ListItem,
  ListItemSuffix,
  Button as MButton,
} from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import Modal from '../../components/Modal/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import FileModal from '../../components/Modal/FileModal';
import { downloadPDF, getDataById, unformatRupiah } from '../../common/utils';
import AdminModal from '../../components/Modal/AdminModal';
import useFetch from '../../hooks/useFetch';
import { FINANCE_ACCEPTANCE, REIMBURSEMENT_ACCEPTANCE } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';

const AdminDetailPengajuan: React.FC = () => {
  const { toggle, visible, hide, show } = useModal();

  const { user } = useAuth();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, []);

  // data state
  const [data, setData] = React.useState(state);
  const [nominal, setNominal] = React.useState(data.nominal);
  const [admin, setAdmin] = React.useState<any>('');
  const [note, setNote] = React.useState<string>('');
  const [status, setStatus] = React.useState<any>();

  // CONST
  const RID = data?.id;
  const EX_STATUS = data?.status;
  const ADMIN_TYPE = user?.type;

  const ACCEPTANCE_STATUS_BY_ID = getDataById(
    status?.accepted_by,
    user?.iduser,
    'iduser',
    'status',
  );

  // Data Modal State
  const [showFile, setShowFile] = React.useState<boolean>(false);
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);

  // Dialog
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [showResultDialog, setShowResultDialog] =
    React.useState<boolean>(false);
  const [dialogtype, setDialogType] = React.useState<string>('OK');
  const [dialogAcctype, setDialogAccType] = React.useState<string>('OK');
  const [finDialog, setFinDialog] = React.useState<boolean>(false);

  const DIALOG_PROPS =
    dialogtype == 'OK'
      ? {
          title: 'Persetujuan Berhasil!',
          message: 'Anda telah berhasil menyetujui pengajuan!',
        }
      : {
          title: 'Persetujuan Gagal!',
          message: 'Persetujuan gagal, mohon coba lagi!',
        };

  const DIALOG_ACC_TYPE = {
    title: 'Konfirmasi',
    message:
      dialogAcctype == 'ACC'
        ? 'Aapakah anda yakin untuk menyetujui pengajuan ini?'
        : 'Apakah anda yakin untuk menolak pengajuan ini',
  };

  // handle status
  const STATUS_WORDING = (
    status: string,
    isFinance?: boolean,
  ): { tx: string; color: colors } => {
    switch (status) {
      case 'WAITING':
        return {
          tx: isFinance ? 'Menunggu Ditransfer' : 'Menunggu Disetujui',
          color: 'amber',
        };
        break;
      case 'APPROVED':
        return { tx: 'Disetujui', color: 'green' };
        break;
      case 'REJECTED':
        return { tx: 'DItolak', color: 'red' };
        break;
      case 'DONE':
        return { tx: 'Selesai', color: 'green' };
        break;
      default:
        return { tx: 'Menunggu Disetujui', color: 'amber' };
        break;
    }
  };

  React.useEffect(() => {
    getStatus();
  }, []);

  // get status
  async function getStatus() {
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_ACCEPTANCE(RID),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setStatus(data);
    } else {
      setStatus(EX_STATUS);
    }
  }

  // acceptance finance
  async function acceptance_fin() {
    setFinDialog(!finDialog);
    show();

    const fnominal = formatRupiah(unformatRupiah(nominal), false);

    const body = {
      nominal: fnominal,
    };

    const { state, data, error } = await useFetch({
      url: FINANCE_ACCEPTANCE(RID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      hide();
      setDialogType('OK');
      setShowResultDialog(!showResultDialog);
    } else {
      hide();
      setDialogType('ERROR');
      setShowResultDialog(!showResultDialog);
    }
  }

  // acceptance
  async function acceptance(statusType: any) {
    setShowDialog(!showDialog);
    show();

    const status = statusType == 'ACC' ? 'APPROVED' : 'REJECTED';

    const fnominal = formatRupiah(unformatRupiah(nominal), false);

    const body = {
      fowarder_id: admin.iduser,
      status: admin ? 'FOWARDED' : status,
      nominal: fnominal,
      note: note || '',
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_ACCEPTANCE(RID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      hide();
      setDialogType('OK');
      setShowResultDialog(!showResultDialog);
    } else {
      hide();
      setDialogType('ERROR');
      setShowResultDialog(!showResultDialog);
    }
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className=" sm:hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Pengajuan
              </h3>
              <Chip
                variant={'outlined'}
                color={STATUS_WORDING(status?.status).color}
                value={STATUS_WORDING(status?.status).tx}
              />
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 border-b pb-4 border-blue-gray-800">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Status Admin
                    </label>
                    {status?.accepted_by.map((item: any, index: number) => {
                      return (
                        <div className=" py-4 flex justify-between">
                          <span className=" text-white font-bold">
                            {item.nm_user}
                          </span>
                          <Chip
                            variant={'ghost'}
                            color={STATUS_WORDING(item?.status).color}
                            value={STATUS_WORDING(item?.status).tx}
                          />
                        </div>
                      );
                    })}
                    {status?.status_finance !== 'IDLE' ? (
                      <div className=" py-4 flex justify-between">
                        <span className=" text-white font-bold">Finance</span>
                        <Chip
                          variant={'ghost'}
                          color={
                            STATUS_WORDING(status?.status_finance, true).color
                          }
                          value={
                            STATUS_WORDING(status?.status_finance, true).tx
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="w-full mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nominal Diajukan ( Ubah nominal bila diperlukan )
                  </label>
                  <input
                    type="text"
                    disabled={
                      ADMIN_TYPE == 'FINANCE'
                        ? data?.status_finance !== 'WAITING'
                        : ACCEPTANCE_STATUS_BY_ID !== 'WAITING'
                    }
                    defaultValue={data?.nominal}
                    placeholder="Masukan Nominal"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    onFocus={() => {
                      const unfr = unformatRupiah(data?.nominal);
                      setNominal(unfr);
                    }}
                    onBlur={() => {
                      const frm = formatRupiah(nominal, true);
                      setNominal(frm);
                    }}
                  />
                </div>

                {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                  <div className="w-full mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Teruskan Approval Admin ( Opsional )
                      </label>
                      <div
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {admin?.nm_user || 'Pilih Admin'}
                      </div>
                    </div>
                  </div>
                ) : null}

                {ADMIN_TYPE == 'ADMIN' ? (
                  <div className=" w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Catatan ( Opsional )
                    </label>
                    <textarea
                      rows={3}
                      disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
                      placeholder="Masukan Catatan"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                ) : null}

                {ADMIN_TYPE == 'FINANCE' &&
                status?.status_finance == 'WAITING' ? (
                  <div className=" mt-4.5">
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setFinDialog(!finDialog);
                      }}
                    >
                      Konfirmasi Sudah Ditransfer
                    </Button>
                  </div>
                ) : null}

                {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                  <div className=" flex flex-col gap-y-4 mt-4.5">
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setDialogAccType('ACC');
                        setShowDialog(!showDialog);
                      }}
                    >
                      Setujui Pengajuan
                    </Button>
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setDialogAccType('RJC');
                        setShowDialog(!showDialog);
                      }}
                      className=" bg-red-400 border-red-400"
                    >
                      Tolak Pengajuan
                    </Button>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Pengajuan
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      No. Dok
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.no_doc}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Jenis Reimbursement
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.jenis_reimbursement}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      COA
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.coa}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Tanggal
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.tanggal_reimbursement}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.kode_cabang}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nomor WhatsApp
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.requester?.nomorwa}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nama Client / Vendor
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.name || '-'}
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label className="mb-3 block text-black dark:text-white">
                    Lampiran
                  </label>
                  <div className=" flex gap-x-4">
                    <div className="w-full truncate rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.file_info?.name}
                    </div>
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        data?.file_info?.type !== 'application/pdf'
                          ? setShowFile(!showFile)
                          : downloadPDF(
                              data?.attachment,
                              data?.file_info?.name,
                            );
                      }}
                    >
                      {data?.file_info?.type !== 'application/pdf'
                        ? 'Lihat'
                        : 'Unduh'}
                    </Button>
                  </div>
                </div>

                <div className="w-full mt-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Deskripsi
                  </label>
                  <textarea
                    rows={6}
                    disabled
                    placeholder="Masukan Deskripsi"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={data?.description}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="hidden sm:block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Status Pengajuan
                </h3>
                <Chip
                  variant={'outlined'}
                  color={STATUS_WORDING(status?.status).color}
                  value={STATUS_WORDING(status?.status).tx}
                />
              </div>
              <form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 border-b pb-4 border-blue-gray-800">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Status Admin
                      </label>
                      {status?.accepted_by.map((item: any, index: number) => {
                        return (
                          <div className=" py-4 flex justify-between">
                            <span className=" text-white font-bold">
                              {item.nm_user}
                            </span>
                            <Chip
                              variant={'ghost'}
                              color={STATUS_WORDING(item?.status).color}
                              value={STATUS_WORDING(item?.status).tx}
                            />
                          </div>
                        );
                      })}
                      {status?.status_finance !== 'IDLE' ? (
                        <div className=" py-4 flex justify-between">
                          <span className=" text-white font-bold">Finance</span>
                          <Chip
                            variant={'ghost'}
                            color={
                              STATUS_WORDING(status?.status_finance, true).color
                            }
                            value={
                              STATUS_WORDING(status?.status_finance, true).tx
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nominal Diajukan ( Ubah nominal bila diperlukan )
                    </label>
                    <input
                      type="text"
                      disabled={
                        ADMIN_TYPE == 'FINANCE'
                          ? data?.status_finance !== 'WAITING'
                          : ACCEPTANCE_STATUS_BY_ID !== 'WAITING'
                      }
                      defaultValue={data?.nominal}
                      placeholder="Masukan Nominal"
                      className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      onFocus={() => {
                        const unfr = unformatRupiah(data?.nominal);
                        setNominal(unfr);
                      }}
                      onBlur={() => {
                        const frm = formatRupiah(nominal, true);
                        setNominal(frm);
                      }}
                    />
                  </div>

                  {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                    <div className="w-full mb-4.5">
                      <div>
                        <label className="mb-3 block text-black dark:text-white">
                          Teruskan Approval Admin ( Opsional )
                        </label>
                        <div
                          onClick={() => setShowAdmin(!showAdmin)}
                          className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                        >
                          {admin?.nm_user || 'Pilih Admin'}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {ADMIN_TYPE == 'ADMIN' ? (
                    <div className=" w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Catatan ( Opsional )
                      </label>
                      <textarea
                        rows={3}
                        disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
                        placeholder="Masukan Catatan"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                    </div>
                  ) : null}

                  {ADMIN_TYPE == 'FINANCE' &&
                  status?.status_finance == 'WAITING' ? (
                    <div className=" mt-4.5">
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          setFinDialog(!finDialog);
                        }}
                      >
                        Konfirmasi Sudah Ditransfer
                      </Button>
                    </div>
                  ) : null}

                  {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                    <div className=" flex flex-col gap-y-4 mt-4.5">
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          setDialogAccType('ACC');
                          setShowDialog(!showDialog);
                        }}
                      >
                        Setujui Pengajuan
                      </Button>
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          setDialogAccType('RJC');
                          setShowDialog(!showDialog);
                        }}
                        className=" bg-red-400 border-red-400"
                      >
                        Tolak Pengajuan
                      </Button>
                    </div>
                  ) : null}
                </div>
              </form>
            </div>
          </div>

          {/* <!-- Sign Up Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Item</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4">
                  <Card className=" rounded-md">
                    <List>
                      {data?.item.map((item: any, index: number) => {
                        return (
                          <ListItem
                            key={item + index}
                            ripple={false}
                            className="py-1 pr-1 pl-4"
                          >
                            {item?.name}
                            <ListItemSuffix className="flex gap-x-4">
                              {formatRupiah(item.nominal, true)}
                            </ListItemSuffix>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                </div>
                <div className="mb-1">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nominal
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={data?.nominal}
                    placeholder="Masukan Nominal"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* <!-- Sign In Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Data Bank
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Bank
                    </label>
                    <div className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.bank_detail?.bankname || '-'}
                    </div>
                  </div>
                </div>

                <div className="w-full mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nomor Rekening
                  </label>
                  <input
                    disabled
                    type="text"
                    placeholder="Masukan Nomor Rekening"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={data?.bank_detail?.accountnumber}
                  />
                </div>

                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={data?.bank_detail?.accountname}
                    placeholder="Nama Pemilik Rekening"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* MODAL CONTAINER */}
      <Modal visible={visible} toggle={toggle} />
      <FileModal
        type={data?.file_info?.type}
        data={data?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
      <AdminModal
        visible={showAdmin}
        toggle={() => setShowAdmin(!showAdmin)}
        value={(val: any) => setAdmin(val)}
      />
      {/* DIALOG */}
      <Dialog
        open={showResultDialog}
        size={'xs'}
        handler={() => setShowResultDialog(!showResultDialog)}
        dismiss={{ enabled: false }}
      >
        <DialogHeader>{DIALOG_PROPS.title}</DialogHeader>
        <DialogBody>{DIALOG_PROPS.message}</DialogBody>
        <DialogFooter>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              setShowResultDialog(!showResultDialog);
              getStatus();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
      {/* DIALOG ACCEPTANCE */}
      <Dialog open={showDialog} handler={() => setShowDialog(!showDialog)}>
        <DialogHeader>{DIALOG_ACC_TYPE.title}</DialogHeader>
        <DialogBody>{DIALOG_ACC_TYPE.message}</DialogBody>
        <DialogFooter>
          <MButton
            variant="text"
            color="red"
            onClick={() => setShowDialog(!showDialog)}
            className="mr-1"
          >
            <span>Batalkan</span>
          </MButton>
          <MButton
            variant="gradient"
            color="green"
            onClick={() => acceptance(dialogAcctype)}
          >
            <span>Konfirmasi</span>
          </MButton>
        </DialogFooter>
      </Dialog>
      {/* DIALOG FINANCE*/}
      <Dialog open={finDialog} handler={() => setFinDialog(!finDialog)}>
        <DialogHeader>Konfirmasi</DialogHeader>
        <DialogBody>
          Apakah anda yakin ingin mengkonfirmasi bahwa dana telah di trasnfer?
        </DialogBody>
        <DialogFooter>
          <MButton
            variant="text"
            color="red"
            onClick={() => setFinDialog(false)}
            className="mr-1"
          >
            <span>Batalkan</span>
          </MButton>
          <MButton
            variant="gradient"
            color="green"
            onClick={() => acceptance_fin()}
          >
            <span>Konfirmasi</span>
          </MButton>
        </DialogFooter>
      </Dialog>
    </DefaultLayout>
  );
};

export default AdminDetailPengajuan;
