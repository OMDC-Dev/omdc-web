import {
  Card,
  Chip,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';
import { colors } from '@material-tailwind/react/types/generic';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FINANCE_UPDATE_COA,
  GET_ICON,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_DETAIL,
} from '../../api/routes';
import formatRupiah from '../../common/formatRupiah';
import { calculateSaldo, downloadPDF } from '../../common/utils';
import FileModal from '../../components/Modal/FileModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import DefaultLayout from '../../layout/DefaultLayout';
import COAModal from '../../components/Modal/COAModal';
import { Margin, usePDF } from 'react-to-pdf';
import Button from '../../components/Button';

const DownloadReport: React.FC = () => {
  const {
    toggle,
    visible,
    hide,
    show,
    changeType,
    type,
    changeContext,
    context,
  } = useModal();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const state = location.state;

  const IS_REPORT = state?.isReport;
  const IS_PUSHED = state?.pushed;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, []);

  // data state
  const [data, setData] = React.useState(state || []);

  // COA
  const [coa, setCoa] = React.useState<string>();
  const [showCoa, setShowCoa] = React.useState<boolean>(false);
  const [coaChange, setCoaChange] = React.useState(false);
  const [icon, setIcon] = React.useState<any>({ icon: '', iconMobile: '' });
  const [status, setStatus] = React.useState<any>();

  // Data Modal State
  const [showFile, setShowFile] = React.useState(false);

  const opt = {
    filename: 'report.pdf',
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.MEDIUM,
      // default is 'A4'
      format: 'A4',
      // default is 'portrait'
      orientation: 'landscape',
    },
  };

  const { toPDF, targetRef } = usePDF(opt);

  const RID = data?.id;

  React.useEffect(() => {
    getIcon();
  }, []);

  async function getIcon() {
    const { state, data, error } = await useFetch({
      url: GET_ICON,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIcon(data);
    } else {
      setIcon(null);
    }
  }

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
    }
  }

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
      case 'DONE':
        return { tx: 'Selesai', color: 'green' };
        break;
      case 'REJECTED':
        return { tx: 'DItolak', color: 'red' };
        break;
      default:
        return { tx: 'Menunggu Disetujui', color: 'amber' };
        break;
    }
  };

  function onReportButtonPressed(e: any) {
    e.preventDefault();
    if (data?.childId) {
      navigate(`/reimbursement/${data?.childId}`, {
        replace: false,
        state: {
          pushed: true,
        },
      });
    } else {
      navigate(`/reimbursement/${data?.id}/report`, {
        replace: false,
        state: data,
      });
    }
  }

  function onSeeButtonPressed(e: any) {
    e.preventDefault();
    if (data?.parentId) {
      navigate(`/reimbursement/${data?.parentId}`, {
        replace: false,
        state: {
          pushed: true,
        },
      });
    }
  }

  React.useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [location.key]);

  async function getDetails(id: any) {
    changeType('LOADING');
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

  // DELETE PENGAJUAN
  async function deletePengajuan() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_DETAIL(RID),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
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
      setCoaChange(false);
    } else {
      changeType('FAILED');
    }
  }

  function renderDownloadReportButton() {
    return (
      <div className=" border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <Button onClick={() => toPDF()}>Download PDF</Button>
      </div>
    );
  }

  function RenderLabel({
    children,
    child,
  }: {
    children: any;
    child?: boolean;
  }) {
    return (
      <span className=" text-sm font-medium text-black dark:text-white">
        {children}
      </span>
    );
  }

  function RenderValue({
    children,
    child,
  }: {
    children: any;
    child?: boolean;
  }) {
    return (
      <div className={` text-sm font-bold ${child ? 'text-black-2' : ''} `}>
        {children}
      </div>
    );
  }

  // ======================== GAP RENDER STATUS PERSETUJUAN
  function renderStatusPersetujuan() {
    return (
      <div className="rounded-sm bg-white border-b py-4">
        <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
          <RenderLabel>Status Persetujuan</RenderLabel>
          <RenderValue>{STATUS_WORDING(data?.status).tx}</RenderValue>
        </div>
        <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
          <RenderLabel>Status Approval</RenderLabel>
        </div>
        {status?.accepted_by?.map((item: any, index: number) => {
          return (
            <div className="flex justify-between border-stroke py-1 px-10 dark:border-strokedark">
              <RenderValue>{item.nm_user}</RenderValue>
              <RenderValue child={true}>
                {STATUS_WORDING(item?.status).tx}
              </RenderValue>
            </div>
          );
        })}
        <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
          <RenderLabel>Catatan</RenderLabel>
        </div>
        {status?.notes?.map((item: any, index: number) => {
          return (
            <div className="flex justify-between border-stroke py-1 px-10 dark:border-strokedark">
              <RenderValue>{item.title}</RenderValue>
              <RenderValue>{item.msg}</RenderValue>
            </div>
          );
        })}
      </div>
    );
  }

  function renderFormPengajuan() {
    const DATA = [
      {
        title: 'No. Dok',
        value: data?.no_doc,
      },
      {
        title: 'Kategori Permintaan',
        value: data?.tipePembayaran,
      },
      {
        title: 'Jenis R.O.P',
        value: data?.jenis_reimbursement,
      },
      {
        title: 'COA / Grup Biaya',
        value: data?.coa,
      },
      {
        title: 'Tanggal Invoice',
        value: data?.tanggal_reimbursement,
      },
      {
        title: 'Cabang',
        value: data?.kode_cabang,
      },
      {
        title: 'No. WA',
        value: data?.requester?.nomorwa,
      },
      {
        title: 'Jenis Pembayaran',
        value: data?.payment_type == 'CASH' ? 'Cash' : 'Transfer',
      },
      {
        title: 'Nama Client / Vendor',
        value: data?.name || '-',
      },
      {
        title: 'Deskripsi',
        value: data?.description,
      },
    ];
    return (
      <div className="rounded-sm bg-white border-b py-4">
        {DATA.map((item, index) => {
          return (
            <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
              <RenderLabel>{item.title}</RenderLabel>
              <RenderValue>{item.value}</RenderValue>
            </div>
          );
        })}
      </div>
    );
  }

  function renderItemData() {
    return (
      <div className="rounded-sm bg-white border-b py-4">
        <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
          <RenderLabel>Item</RenderLabel>
        </div>
        {data?.item?.map((item: any, index: number) => {
          return (
            <div className="flex justify-between border-stroke py-1 px-10 dark:border-strokedark">
              <RenderValue>{item.name}</RenderValue>
              <RenderValue child>
                {formatRupiah(item.nominal, true)}
              </RenderValue>
            </div>
          );
        })}
        <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
          <RenderLabel>Total Nominal</RenderLabel>
          <RenderValue>{data.nominal}</RenderValue>
        </div>
        {data?.realisasi && (
          <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
            <RenderLabel>Nominal Realisasi</RenderLabel>
            <RenderValue>{data.realisasi}</RenderValue>
          </div>
        )}
        {data?.pengajuan_ca && (
          <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
            <RenderLabel>Nominal Cash Advance</RenderLabel>
            <RenderValue>{data.pengajuan_ca}</RenderValue>
          </div>
        )}
        {data?.realisasi && (
          <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
            <RenderLabel>Saldo</RenderLabel>
            <RenderValue>
              {calculateSaldo(data?.nominal, data?.realisasi)}
            </RenderValue>
          </div>
        )}
        {data?.pengajuan_ca && (
          <div className="flex justify-between border-stroke py-1 px-6.5 dark:border-strokedark">
            <RenderLabel>Saldo</RenderLabel>
            <RenderValue>
              {calculateSaldo(data?.pengajuan_ca, data?.nominal)}
            </RenderValue>
          </div>
        )}
      </div>
    );
  }

  function renderBankData() {
    if (data?.payment_type == 'CASH') return;
    const DATA = [
      {
        title: 'Nama Bank',
        value: data?.bank_detail?.bankname,
      },
      {
        title: 'Nama Pemilik Rekening',
        value: data?.bank_detail?.accountname,
      },
      {
        title: 'Nomor Rekening',
        value: data?.bank_detail?.accountnumber,
      },
      {
        title: 'Bank Pengirim ( Finance )',
        value: data?.finance_bank,
      },
    ];
    return (
      <div className="rounded-sm bg-white border-b py-4">
        {DATA.map((item, index) => {
          return (
            <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
              <RenderLabel>{item.title}</RenderLabel>
              <RenderValue>{item.value}</RenderValue>
            </div>
          );
        })}
      </div>
    );
  }

  function renderAttachment() {
    if (data?.file?.type == 'application/pdf') return;
    return (
      <img
        className="block h-115 w-115 object-contain mt-4"
        src={data.attachment}
        alt="Logo"
      />
    );
  }

  // ========================================================

  return (
    <DefaultLayout center={true}>
      <div className="hidden xl:block  w-full sm:max-w-xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {renderDownloadReportButton()}
      </div>

      <div
        ref={targetRef}
        className="grid grid-cols-1 gap-4 bg-white place-items-center"
      >
        <div className="flex flex-col gap-4 w-4/5">
          <div className="  flex justify-start p-4.5">
            <img
              className="block h-24 w-24 object-contain"
              src={`data:image/png;base64,${icon.icon}`}
              alt="Logo"
            />
          </div>
          <div className=" flex gap-8">
            <div className=" flex-1">
              {renderStatusPersetujuan()}
              {renderFormPengajuan()}
            </div>
            <div className=" flex-1">
              {renderItemData()}
              {renderBankData()}
              {renderAttachment()}
            </div>
          </div>
        </div>
      </div>
      {/* MODAL CONTAINER */}
      {/* <Modal visible={visible} toggle={toggle} /> */}
      <FileModal
        type={data?.file_info?.type}
        data={data?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => (context == 'COA' ? onCOAUpdate() : deletePengajuan())}
        onDone={() =>
          context !== 'COA' ? navigate('/', { replace: true }) : null
        }
      />
      <COAModal
        visible={showCoa}
        toggle={() => setShowCoa(!showCoa)}
        value={(val: any) => {
          setCoa(val);
          setCoaChange(true);
        }}
      />
    </DefaultLayout>
  );
};

export default DownloadReport;
