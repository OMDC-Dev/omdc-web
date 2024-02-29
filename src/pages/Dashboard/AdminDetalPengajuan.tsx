import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import {
  Card,
  Chip,
  List,
  ListItem,
  ListItemSuffix,
  Button as MButton,
} from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import Modal from '../../components/Modal/Modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import FileModal from '../../components/Modal/FileModal';
import {
  calculateSaldo,
  downloadPDF,
  getDataById,
  unformatRupiah,
} from '../../common/utils';
import AdminModal from '../../components/Modal/AdminModal';
import useFetch from '../../hooks/useFetch';
import {
  FINANCE_ACCEPTANCE,
  FINANCE_UPDATE_COA,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_DETAIL,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';
import ModalSelector from '../../components/Modal/ModalSelctor';
import COAModal from '../../components/Modal/COAModal';

const AdminDetailPengajuan: React.FC = () => {
  const {
    show,
    hide,
    toggle,
    visible,
    type,
    changeType,
    context,
    changeContext,
  } = useModal();

  const { user } = useAuth();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const state = location.state;

  const IS_PUSHED = state?.pushed;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, []);

  // data state
  const [data, setData] = React.useState(state);
  const [nominal, setNominal] = React.useState(data?.nominal);
  const [admin, setAdmin] = React.useState<any>('');

  const [status, setStatus] = React.useState<any>();

  // COA
  const [coa, setCoa] = React.useState<string>();
  const [showCoa, setShowCoa] = React.useState<boolean>(false);

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

  const [note, setNote] = React.useState<string>('');

  // Data Modal State
  const [showFile, setShowFile] = React.useState<boolean>(false);
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);

  // handle status
  const STATUS_WORDING = (
    status: string,
    isFinance?: boolean,
  ): { tx: string; color: colors } => {
    switch (status) {
      case 'WAITING':
        return {
          tx: isFinance ? 'Menunggu Diproses' : 'Menunggu Disetujui',
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
  }, [location.key]);

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
    changeType('LOADING');

    const fnominal = formatRupiah(unformatRupiah(nominal), true);

    const body = {
      nominal: fnominal,
      note: note,
      coa: coa,
    };

    const { state, data, error } = await useFetch({
      url: FINANCE_ACCEPTANCE(RID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      getStatus();
    } else {
      changeType('FAILED');
    }
  }

  // acceptance
  const STATE_NOTE = data?.note;
  async function acceptance(statusType: any) {
    changeType('LOADING');

    const status = statusType == 'ACC' ? 'APPROVED' : 'REJECTED';

    const fnominal = formatRupiah(unformatRupiah(nominal), false);

    const noteStr = `${STATE_NOTE?.length ? STATE_NOTE + `, ${note}` : note}`;

    const body = {
      fowarder_id: admin.iduser,
      status: admin ? 'FOWARDED' : status,
      nominal: fnominal,
      note: noteStr,
      coa: coa,
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_ACCEPTANCE(RID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      getStatus();
    } else {
      changeType('FAILED');
    }
  }

  // CAR
  function onReportButtonPressed(e: any) {
    e.preventDefault();
    if (data?.childId) {
      navigate(`/reimbursement/${data?.childId}`, {
        replace: false,
        state: { pushed: true },
      });
    }
  }

  function onSeeButtonPressed(e: any) {
    e.preventDefault();
    if (data?.parentId) {
      navigate(`/reimbursement/${data?.parentId}`, {
        replace: false,
        state: { pushed: true },
      });
    }
  }

  React.useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [location.key]);

  async function getDetails(id: any) {
    show();
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_DETAIL(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setData(data);
    } else {
      hide();
    }
  }

  async function onCOAUpdate() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: FINANCE_UPDATE_COA(RID),
      method: 'POST',
      data: {
        coa: coa,
      },
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      getStatus();
    } else {
      changeType('FAILED');
      getStatus();
    }
  }

  // Render coa selector
  function renderCOASelector() {
    if (ADMIN_TYPE == 'ADMIN') {
      if (ACCEPTANCE_STATUS_BY_ID !== 'WAITING') return;

      return (
        <div className="w-full mb-4.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">COA</label>
            <div
              onClick={() => setShowCoa(!showCoa)}
              className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            >
              {coa || data?.coa || 'Pilih COA'}
            </div>
          </div>
        </div>
      );
    } else {
      const _status = status?.status_finance;
      return (
        <div className="w-full mb-4.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">COA</label>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div
                onClick={() => setShowCoa(!showCoa)}
                className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              >
                {coa || data?.coa || 'Pilih COA'}
              </div>
              {_status == 'DONE' ? (
                <Button
                  onClick={(e: any) => {
                    e.preventDefault();
                    changeContext('COA');
                    changeType('CONFIRM');
                    show();
                  }}
                >
                  Update COA
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className=" sm:hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Persetujuan
              </h3>
              <Chip
                variant={'outlined'}
                color={STATUS_WORDING(status?.status).color}
                value={STATUS_WORDING(status?.status).tx}
              />
            </div>
            <div>
              <div className="p-6.5">
                <div className="mb-4.5 border-b pb-4 border-blue-gray-800">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Status Approval
                    </label>
                    {status?.accepted_by?.map((item: any, index: number) => {
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
                    Nominal Pengajuan{' '}
                    {ACCEPTANCE_STATUS_BY_ID !== 'WAITING' &&
                    ADMIN_TYPE == 'ADMIN'
                      ? '( Ubah nominal bila diperlukan )'
                      : ''}
                  </label>
                  <input
                    type="text"
                    disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
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

                {renderCOASelector()}

                <div className=" w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Catatan ( Opsional )
                  </label>
                  {ADMIN_TYPE == 'ADMIN' ? (
                    ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                      <textarea
                        rows={3}
                        disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
                        placeholder="Masukan Catatan"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                    ) : (
                      <textarea
                        rows={3}
                        disabled={true}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        defaultValue={data?.note + note}
                      ></textarea>
                    )
                  ) : (
                    <textarea
                      rows={3}
                      disabled={status?.status_finance !== 'WAITING'}
                      placeholder="Masukan Catatan"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={note || data?.finance_note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  )}
                </div>

                {data?.jenis_reimbursement == 'Cash Advance' &&
                data?.status_finance == 'DONE' &&
                data?.childId &&
                !IS_PUSHED ? (
                  <div className="w-full mt-4.5">
                    <Button onClick={onReportButtonPressed}>
                      Lihat Report Realisasi
                    </Button>
                  </div>
                ) : null}
                {data?.jenis_reimbursement == 'Cash Advance Report' &&
                data?.parentId &&
                !IS_PUSHED ? (
                  <div className="w-full mt-4.5">
                    <Button onClick={onSeeButtonPressed}>
                      Lihat Pengajuan Cash Advance
                    </Button>
                  </div>
                ) : null}

                {ADMIN_TYPE == 'FINANCE' &&
                status?.status_finance == 'WAITING' ? (
                  <div className=" mt-4.5">
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        changeType('CONFIRM');
                        changeContext('FIN');
                        show();
                      }}
                    >
                      {data?.bank_detail?.bankname &&
                      data?.payment_type == 'TRANSFER'
                        ? 'Konfirmasi Sudah Ditransfer'
                        : 'Konfirmasi Selesai'}
                    </Button>
                  </div>
                ) : null}

                {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                  <div className=" flex flex-col gap-y-4 mt-4.5">
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        changeType('CONFIRM');
                        changeContext('ACC');
                        show();
                      }}
                    >
                      Setujui Pengajuan
                    </Button>
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        changeType('CONFIRM');
                        changeContext('RJJ');
                        show();
                      }}
                      className=" bg-red-400 border-red-400"
                    >
                      Tolak Pengajuan
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
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
                      {status?.coa || data?.coa}
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
                      Jenis Pembayaran
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.payment_type == 'CASH' ? 'Cash' : 'Transfer'}
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
                  <div className=" flex flex-col gap-4">
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
                  Status Persetujuan
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
                        Status Approval
                      </label>
                      {status?.accepted_by?.map((item: any, index: number) => {
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
                      Nominal Pengajuan{' '}
                      {ACCEPTANCE_STATUS_BY_ID !== 'WAITING' &&
                      ADMIN_TYPE == 'ADMIN'
                        ? '( Ubah nominal bila diperlukan )'
                        : ''}
                    </label>
                    <input
                      type="text"
                      disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
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

                  {renderCOASelector()}

                  <div className=" w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Catatan ( Opsional )
                    </label>
                    {ADMIN_TYPE == 'ADMIN' ? (
                      ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                        <textarea
                          rows={3}
                          disabled={ACCEPTANCE_STATUS_BY_ID !== 'WAITING'}
                          placeholder="Masukan Catatan"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                      ) : (
                        <textarea
                          rows={3}
                          disabled={true}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          defaultValue={data?.note + note}
                        ></textarea>
                      )
                    ) : (
                      <textarea
                        rows={3}
                        disabled={status?.status_finance !== 'WAITING'}
                        placeholder="Masukan Catatan"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={note || data?.finance_note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                    )}
                  </div>

                  {data?.jenis_reimbursement == 'Cash Advance' &&
                  data?.status_finance == 'DONE' &&
                  data?.childId &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onReportButtonPressed}>
                        Lihat Report Realisasi
                      </Button>
                    </div>
                  ) : null}
                  {data?.jenis_reimbursement == 'Cash Advance Report' &&
                  data?.parentId &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onSeeButtonPressed}>
                        Lihat Pengajuan Cash Advance
                      </Button>
                    </div>
                  ) : null}

                  {ADMIN_TYPE == 'FINANCE' &&
                  status?.status_finance == 'WAITING' ? (
                    <div className=" mt-4.5">
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          changeType('CONFIRM');
                          changeContext('FIN');
                          show();
                        }}
                      >
                        {data?.bank_detail?.bankname
                          ? 'Konfirmasi Sudah Ditransfer'
                          : 'Konfirmasi Selesai'}
                      </Button>
                    </div>
                  ) : null}

                  {ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                    <div className=" flex flex-col gap-y-4 mt-4.5">
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          changeType('CONFIRM');
                          changeContext('ACC');
                          show();
                        }}
                      >
                        Setujui Pengajuan
                      </Button>
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          changeType('CONFIRM');
                          changeContext('RJJ');
                          show();
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
                      {data?.item?.map((item: any, index: number) => {
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
                    Total Nominal
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={data?.nominal}
                    placeholder="Masukan Nominal"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {data?.realisasi ? (
                  <>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nominal Realisasi
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={data?.realisasi}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Saldo
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={calculateSaldo(
                          data?.nominal,
                          data?.realisasi,
                        )}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>

          {/* <!-- Sign In Form --> */}
          {data?.bank_detail?.bankname && data?.payment_type == 'TRANSFER' ? (
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
          ) : null}
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
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => {
          if (context == 'ACC' || context == 'RJJ') {
            acceptance(context);
          }

          if (context == 'FIN') {
            acceptance_fin();
          }

          if (context == 'COA') {
            onCOAUpdate();
          }
        }}
        onDone={() => {
          hide();
        }}
      />
      <COAModal
        visible={showCoa}
        toggle={() => setShowCoa(!showCoa)}
        value={(val: any) => setCoa(val)}
      />
    </DefaultLayout>
  );
};

export default AdminDetailPengajuan;
