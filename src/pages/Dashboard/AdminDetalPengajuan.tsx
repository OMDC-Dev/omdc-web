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
  formatAmount,
  formatCurrencyToNumber,
  getDataById,
  unformatRupiah,
} from '../../common/utils';
import AdminModal from '../../components/Modal/AdminModal';
import useFetch from '../../hooks/useFetch';
import {
  ACCEPT_MAKER_REIMBURSEMENT,
  ACCEPT_REVIEW_REIMBURSEMENT,
  FINANCE_ACCEPTANCE,
  FINANCE_UPDATE_COA,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_ACCEPTANCE_EXTRA,
  REIMBURSEMENT_DETAIL,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';
import ModalSelector from '../../components/Modal/ModalSelctor';
import COAModal from '../../components/Modal/COAModal';
import BankModal from '../../components/Modal/BankModal';

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
  const [parentData, setParentData] = React.useState<any>();

  const [status, setStatus] = React.useState<any>();

  // COA
  const [coa, setCoa] = React.useState<string>();
  const [showCoa, setShowCoa] = React.useState<boolean>(false);

  // Bank Modal State
  const [showBank, setShowBank] = React.useState<boolean>(false);
  const [selectedBank, setSelectedBank] = React.useState<any>();
  const [saldo, setSaldo] = React.useState<any>();
  const [isNeedBank, setIsNeedBank] = React.useState<boolean>(true);

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
      case 'IDLE':
        return {
          tx: 'Menunggu Direview',
          color: 'amber',
        };
        break;
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
        return { tx: 'Ditolak', color: 'red' };
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
  }, [location.key, type]);

  // get status
  async function getStatus() {
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_ACCEPTANCE(RID),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setStatus(data);
      setSelectedBank({ namaBank: data.finance_bank });
    } else {
      setStatus(EX_STATUS);
    }
  }

  console.log('STATUS', status);

  // acceptance finance
  async function acceptance_fin(statusType: string) {
    changeType('LOADING');
    const status = statusType == 'FIN_ACC' ? 'DONE' : 'REJECTED';

    const fnominal = formatRupiah(unformatRupiah(nominal), true);

    const body = {
      nominal: fnominal,
      note: note,
      coa: coa,
      bank: selectedBank?.namaBank,
      extra: admin.iduser,
    };

    const { state, data, error } = await useFetch({
      url: FINANCE_ACCEPTANCE(RID, status),
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
  async function acceptance(statusType: any) {
    changeType('LOADING');

    const status = statusType == 'ADM_ACC' ? 'APPROVED' : 'REJECTED';

    const fnominal = formatRupiah(unformatRupiah(nominal), false);

    const body = {
      fowarder_id: admin.iduser,
      status: admin ? 'FOWARDED' : status,
      nominal: fnominal,
      note: note,
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

  // acceptance ext
  async function acceptance_ext(statusType: any) {
    changeType('LOADING');

    const status = statusType == 'EXT_ACC' ? 'APPROVED' : 'REJECTED';

    const body = {
      status: status,
      note: note,
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_ACCEPTANCE_EXTRA(RID),
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

  // set status finance
  async function acceptance_reviewer(statusType: string) {
    changeType('LOADING');

    const tStatus = statusType == 'REV_ACC' ? 'APPROVED' : 'REJECTED';

    const body = {
      note: note,
      coa: coa,
      status: tStatus,
    };

    const { state, data, error } = await useFetch({
      url: ACCEPT_REVIEW_REIMBURSEMENT(RID),
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

  // set status finance
  async function acceptance_maker(statusType: string) {
    changeType('LOADING');

    const tStatus = statusType == 'MAK_ACC' ? 'APPROVED' : 'REJECTED';

    const body = {
      note: note,
      coa: coa,
      status: tStatus,
      bank: selectedBank?.namaBank,
    };

    const { state, data, error } = await useFetch({
      url: ACCEPT_MAKER_REIMBURSEMENT(RID),
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
    if (data.jenis_reimbursement == 'Cash Advance Report') {
      getParentDetails(data.parentId);
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

  async function getParentDetails(id: any) {
    show();

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_DETAIL(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setParentData(data);
    } else {
      hide();
    }
  }

  console.log('PARENT', parentData);

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

  // handle sisa and need bank
  React.useEffect(() => {
    if (data.payment_type == 'CASH') {
      setIsNeedBank(false);
    }

    if (data.jenis_reimbursement == 'Cash Advance Report') {
      const ca: number = formatCurrencyToNumber(parentData?.nominal);
      const nom: number = formatCurrencyToNumber(data?.nominal);

      const sisa = ca - nom;

      setSaldo(sisa);

      if (sisa > 0) {
        setIsNeedBank(false);
      }
    }
  }, [parentData, data]);

  // Render coa selector
  function renderCOASelector() {
    if (ADMIN_TYPE == 'ADMIN') {
      if (ACCEPTANCE_STATUS_BY_ID !== 'WAITING') return;
      return (
        <div className="w-full mb-4.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              COA / Grup Biaya
            </label>
            <div
              onClick={() => setShowCoa(!showCoa)}
              className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            >
              {coa || data?.coa || 'Pilih COA'}
            </div>
          </div>
        </div>
      );
    } else if (ADMIN_TYPE == 'REVIEWER') {
      const _status = status?.reviewStatus;
      if (_status !== 'IDLE') return;
      return (
        <div className="w-full mb-4.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              COA / Grup Biaya
            </label>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div
                onClick={() => setShowCoa(!showCoa)}
                className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              >
                {coa || data?.coa || 'Pilih COA'}
              </div>
              {_status == 'IDLE' ? (
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
    } else {
      const _status = status?.status_finance;
      if (_status == 'DONE') return;
      if (_status == 'REJECTED') return;

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

  // === render note
  function renderNote() {
    if (ADMIN_TYPE == 'ADMIN') {
      if (!data.needExtraAcceptance) {
        if (ACCEPTANCE_STATUS_BY_ID !== 'WAITING') {
          return;
        }
      } else {
        if (status?.extraAcceptanceStatus !== 'WAITING') {
          return;
        }
      }
    }
    if (ADMIN_TYPE == 'REVIEWER' && status?.reviewStatus !== 'IDLE') return;
    if (ADMIN_TYPE == 'FINANCE' && status?.status_finance !== 'WAITING') return;
    if (ADMIN_TYPE == 'MAKER' && status?.makerStatus !== 'IDLE') return;

    return (
      <div className=" w-full">
        <label className="mb-2.5 block text-black dark:text-white">
          Catatan ( Opsional )
        </label>
        <textarea
          rows={3}
          placeholder="Masukan Catatan"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    );
  }

  function renderNoteList() {
    if (status?.status == 'WAITING') return;
    return status?.notes?.map((item: any, index: number) => {
      return (
        <div key={item + index} className=" w-full mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            {item.title}
          </label>
          <textarea
            rows={3}
            disabled={true}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            defaultValue={item.msg}
          />
        </div>
      );
    });
  }

  // ===== render acc reject button
  function renderAccRejectButton() {
    if (ADMIN_TYPE == 'ADMIN') {
      if (!data.needExtraAcceptance) {
        if (ACCEPTANCE_STATUS_BY_ID !== 'WAITING') {
          return;
        }
      } else {
        if (status?.extraAcceptanceStatus !== 'WAITING') {
          return;
        }
      }
    }

    if (ADMIN_TYPE == 'REVIEWER' && status?.reviewStatus !== 'IDLE') return;
    if (ADMIN_TYPE == 'FINANCE' && status?.status_finance !== 'WAITING') return;
    if (ADMIN_TYPE == 'MAKER' && status?.makerStatus !== 'IDLE') return;

    let title = '';
    if (ADMIN_TYPE == 'FINANCE') {
      title =
        data?.bank_detail?.bankname && data?.payment_type == 'TRANSFER'
          ? 'Konfirmasi Dana Ditransfer'
          : 'Konfirmasi Dana Diterima';
    } else {
      title = 'Setujui Pengajuan';
    }

    let context_acc;
    let context_rej;

    if (ADMIN_TYPE == 'ADMIN') {
      if (data.extraAcceptance.iduser == user.iduser) {
        context_acc = 'EXT_ACC';
        context_rej = 'EXT_REJ';
      } else {
        context_acc = 'ADM_ACC';
        context_rej = 'ADM_REJ';
      }
    } else if (ADMIN_TYPE == 'FINANCE') {
      context_acc = 'FIN_ACC';
      context_rej = 'FIN_REJ';
    } else if (ADMIN_TYPE == 'REVIEWER') {
      context_acc = 'REV_ACC';
      context_rej = 'REV_REJ';
    } else {
      context_acc = 'MAK_ACC';
      context_rej = 'MAK_REJ';
    }

    return (
      <div className=" flex flex-col gap-y-4 mt-4.5">
        <Button
          disabled={
            (ADMIN_TYPE == 'FINANCE' &&
              data?.payment_type == 'TRANSFER' &&
              !selectedBank?.namaBank &&
              isNeedBank) ||
            (ADMIN_TYPE == 'MAKER' &&
              data?.payment_type == 'TRANSFER' &&
              !selectedBank?.namaBank &&
              isNeedBank)
          }
          onClick={(e: any) => {
            e.preventDefault();
            changeType('CONFIRM');
            changeContext(context_acc);
            show();
          }}
        >
          {title}
        </Button>
        <Button
          disabled={
            ADMIN_TYPE == 'FINANCE' &&
            data?.payment_type == 'TRANSFER' &&
            !selectedBank?.namaBank &&
            isNeedBank
          }
          onClick={(e: any) => {
            e.preventDefault();
            changeType('CONFIRM');
            changeContext(context_rej);
            show();
          }}
          className=" bg-red-400 border-red-400"
        >
          Tolak Pengajuan
        </Button>
      </div>
    );
  }

  // ========== render admin selector
  function renderAdminSelector() {
    if (ADMIN_TYPE == 'ADMIN' && ACCEPTANCE_STATUS_BY_ID !== 'WAITING') return;
    if (ADMIN_TYPE == 'REVIEWER') return;
    if (ADMIN_TYPE == 'MAKER') return;
    if (ADMIN_TYPE == 'FINANCE' && status?.status_finance !== 'IDLE') return;

    return (
      <div className="w-full mb-4.5">
        <div>
          <label className="mb-3 block text-black dark:text-white">
            {ADMIN_TYPE == 'FINANCE'
              ? 'Persetujuan Lanjutan ( Opsional )'
              : 'Forward ( Opsional )'}
          </label>
          <div
            onClick={() => setShowAdmin(!showAdmin)}
            className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
          >
            {admin?.nm_user ? admin?.nm_user : 'Pilih Admin'}
          </div>
        </div>
      </div>
    );
  }

  // function render reviewer status process
  function renderReviewerStatus() {
    const reviewStatus = status?.reviewStatus;

    return (
      <div className=" py-4 flex justify-between">
        <span className=" text-black font-bold">Reviewer</span>
        <Chip
          variant={'ghost'}
          color={STATUS_WORDING(reviewStatus, true).color}
          value={STATUS_WORDING(reviewStatus, true).tx}
        />
      </div>
    );
  }

  // render finance process status
  function renderFinanceProcessStatus() {
    const statusFinance = status?.status_finance;

    if (statusFinance == 'IDLE') return;

    return (
      <div className=" py-4 flex justify-between">
        <span className=" text-black font-bold">Finance</span>
        <Chip
          variant={'ghost'}
          color={STATUS_WORDING(statusFinance, true).color}
          value={STATUS_WORDING(statusFinance, true).tx}
        />
      </div>
    );
  }

  function renderDownloadReportButton(isTop: boolean) {
    if (ADMIN_TYPE !== 'FINANCE') return;
    if (data.status_finance !== 'DONE') return;
    if (
      data.jenis_reimbursement == 'Cash Advance' &&
      data.status_finance_child !== 'DONE'
    )
      return;

    let visibility = isTop ? 'sm:hidden' : 'hidden sm:block';

    return (
      <div
        className={`${visibility} rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
      >
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <Button
            onClick={() =>
              navigate(`/reimbursement/${data?.id}/download`, {
                replace: false,
                state: data,
              })
            }
          >
            Download Report
          </Button>
        </div>
      </div>
    );
  }

  // ================= GAP

  function renderStatusPersetujuan() {
    return (
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
                {/* {renderReviewerStatus()} */}
                {status?.accepted_by?.map((item: any, index: number) => {
                  return (
                    <div className=" py-4 flex justify-between">
                      <span className=" text-black font-bold">
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
                {/* {renderFinanceProcessStatus()} */}
              </div>
            </div>

            <div className="w-full mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Nominal Pengajuan{' '}
                {ACCEPTANCE_STATUS_BY_ID !== 'WAITING' && ADMIN_TYPE == 'ADMIN'
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

            {data.jenis_reimbursement == 'Cash Advance Report' && (
              <div>
                <div className="w-full mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Nominal Cash Advance
                  </label>
                  <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                    {parentData?.nominal}
                  </div>
                </div>

                <div className="w-full mb-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Saldo
                  </label>
                  <div className="w-full rounded-md border border-stroke font-bold py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                    {formatRupiah(saldo, true)}
                  </div>
                </div>
              </div>
            )}

            {renderAdminSelector()}
            {renderCOASelector()}
            {renderNoteList()}
            {renderNote()}

            {(data?.payment_type == 'TRANSFER' &&
              ADMIN_TYPE == 'FINANCE' &&
              isNeedBank) ||
            (data?.payment_type == 'TRANSFER' &&
              ADMIN_TYPE == 'MAKER' &&
              isNeedBank) ? (
              <div className="mb-full mt-2 mb-12">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Bank Pengirim ( Finance )
                  </label>
                  <div
                    onClick={() =>
                      (ADMIN_TYPE == 'FINANCE' &&
                        status?.status_finance == 'WAITING') ||
                      (ADMIN_TYPE == 'MAKER' && status?.makerStatus == 'IDLE')
                        ? setShowBank(!showBank)
                        : null
                    }
                    className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  >
                    {selectedBank?.namaBank || 'Pilih Bank'}
                  </div>
                </div>
              </div>
            ) : null}

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

            {/* {ADMIN_TYPE == 'FINANCE' && status?.status_finance == 'WAITING' ? (
              <div className=" mt-4.5">
                <Button
                  disabled={
                    data?.payment_type == 'TRANSFER' && !selectedBank?.namaBank
                  }
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
            ) : null} */}

            {renderAccRejectButton()}
          </div>
        </div>
      </div>
    );
  }

  // =================== GAP

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {renderDownloadReportButton(true)}
        <div className=" sm:hidden">{renderStatusPersetujuan()}</div>

        <div className="flex flex-col gap-9">
          {renderDownloadReportButton(false)}
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
                      Jenis Request of Payment
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.jenis_reimbursement}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Kategori Permintaan
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.tipePembayaran}
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
          <div className="hidden sm:block">{renderStatusPersetujuan()}</div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Data User
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Nama
                    </label>
                    <div className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.requester?.nm_user || '-'}
                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Jabatan
                    </label>
                    <div className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.requester?.level_user || '-'}
                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Departemen
                    </label>
                    <div className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.requester?.departemen || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
        rid={data?.id}
        toggle={() => setShowAdmin(!showAdmin)}
        value={(val: any) => setAdmin(val)}
      />
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => {
          if (context == 'ADM_ACC' || context == 'ADM_REJ') {
            acceptance(context);
          }

          if (context == 'EXT_ACC' || context == 'EXT_REJ') {
            acceptance_ext(context);
          }

          if (context == 'FIN_ACC' || context == 'FIN_REJ') {
            acceptance_fin(context);
          }

          if (context == 'REV_ACC' || context == 'REV_REJ') {
            acceptance_reviewer(context);
          }

          if (context == 'MAK_ACC' || context == 'MAK_REJ') {
            acceptance_maker(context);
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
      <BankModal
        visible={showBank}
        toggle={() => setShowBank(!showBank)}
        value={(val: any) => {
          setSelectedBank(val);
        }}
      />
    </DefaultLayout>
  );
};

export default AdminDetailPengajuan;
