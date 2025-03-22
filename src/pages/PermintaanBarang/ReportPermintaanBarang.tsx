import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import useModal from '../../hooks/useModal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import useFetch from '../../hooks/useFetch';
import {
  BARANG,
  DETAIL_REQUEST_BARANG,
  GET_ICON,
  REIMBURSEMENT_DETAIL,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import {
  Button as MButton,
  Card,
  Chip,
  List,
  ListItem,
} from '@material-tailwind/react';
import moment from 'moment';
import FileModal from '../../components/Modal/FileModal';
import Button from '../../components/Button';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { Margin, usePDF } from 'react-to-pdf';

const ReportPermintaanBarang: React.FC = () => {
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

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // data state
  const [data, setData] = React.useState<any>([]);
  const [barang, setBarang] = React.useState<any>([]);
  const [showFile, setShowFile] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<any>();

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

  const ID_PB = data.id_pb;

  console.log(selectedFile);

  const state = location.state;

  const [icon, setIcon] = React.useState<any>({ icon: '', iconMobile: '' });

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
    if (!state) {
      navigate('/', { replace: true });
    } else {
      setData(state);
      getDetails(id);
    }
  }, []);

  async function getDetails(id: any) {
    show();
    const { state, data, error } = await useFetch({
      url: DETAIL_REQUEST_BARANG(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setBarang(data);
    } else {
      hide();
    }
  }

  async function onCancelPengajuan() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: BARANG + `/${ID_PB}`,
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  function statusWording(): { text: string; color: colors } {
    switch (data?.status_approve?.toLowerCase()) {
      case 'ditolak':
        return { text: 'Ditolak', color: 'red' };
        break;
      case 'disetujui sebagian':
        return { text: 'Disetujui Sebagian', color: 'light-blue' };
        break;
      case 'disetujui':
        return { text: 'Disetujui', color: 'green' };
        break;
      default:
        return { text: 'Menunggu', color: 'amber' };
        break;
    }
  }

  function statusPengajuanWording(): { text: string; color: colors } {
    switch (data?.approval_admin_status) {
      case 'REJECTED':
        return { text: 'Ditolak', color: 'red' };
        break;
      case 'APPROVED':
        return { text: 'Disetujui', color: 'green' };
        break;
      default:
        return { text: 'Menunggu', color: 'amber' };
        break;
    }
  }

  function renderStatusApproval(smHidden: boolean) {
    const visibility = smHidden ? 'sm:hidden' : 'hidden sm:block';
    return (
      <div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Status Approval Pengajuan
            </h3>
            <Chip
              variant={'outlined'}
              color={statusPengajuanWording().color}
              value={statusPengajuanWording().text}
            />
          </div>
          <div className=" px-6.5 py-4.5  flex flex-col">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Approval oleh
              </label>
              <span className=" text-black font-bold">
                {data?.approval_admin_name || '-'}
              </span>
            </div>
          </div>
          <div className=" px-6.5 mb-4.5 flex flex-col">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Tanggal Persetujuan
              </label>
              <span className=" text-black font-bold">
                {data?.approval_admin_date || '-'}
              </span>
            </div>
          </div>
          {data.keterangan && (
            <div className=" px-6.5 mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Catatan
              </label>
              <textarea
                rows={3}
                disabled
                placeholder="Masukan Catatan"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={data.keterangan}
              />
            </div>
          )}
          {data.approval_admin_status == 'WAITING' && (
            <div className="w-full px-6.5 mb-4.5">
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  changeType('CONFIRM');
                  changeContext('REJ');
                  show();
                }}
                className=" bg-red-400 border-red-400"
              >
                Batalkan Pengajuan
              </Button>
            </div>
          )}
          {data.status_approve && (
            <div className="w-full px-6.5 mb-4.5">
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                }}
              >
                Download Report
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderStatusPengajuan(smHidden: boolean) {
    const visibility = smHidden ? 'sm:hidden' : 'hidden sm:block';
    return (
      <div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Status Permintaan
            </h3>
            <Chip
              variant={'outlined'}
              color={statusWording().color}
              value={statusWording().text}
            />
          </div>
          <div className=" p-6.5 flex flex-col gap-y-6">
            <div className=" w-full flex justify-between">
              <label className="mb-3 block text-black dark:text-white">
                Tanggal Persetujuan
              </label>
              <span className=" text-black font-bold">
                {data?.tgl_approve || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
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

  function renderFormPengajuan() {
    const DATA = [
      {
        title: 'ID Permintaan Barang',
        value: data?.id_pb,
      },
      {
        title: 'Cabang',
        value: data?.nm_induk,
      },
      {
        title: 'Kirim Ke',
        value: data?.nm_cabang,
      },
      {
        title: `Alamat Pengiriman`,
        value: data?.alamat,
      },
      {
        title: 'Waktu Pengajuan',
        value: `${moment(data?.tgl_trans).format('ll')} ${data?.jam_trans}`,
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

  function renderBarangList() {
    return (
      <div className="rounded-sm bg-white border-b py-4">
        {barang.map((item: any, index: number) => {
          return (
            <>
              <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
                <RenderLabel>{item.nm_barang}</RenderLabel>
                <RenderValue>
                  Stock: {item?.jml_kemasan} {item?.nm_kemasan} | Req:
                  {item?.qty_stock} {item?.nm_kemasan}
                </RenderValue>
              </div>
              <div className="flex justify-between  border-stroke py-1 px-6.5 dark:border-strokedark">
                <RenderValue>Status: {item?.status_approve || '-'}</RenderValue>
              </div>
            </>
          );
        })}
      </div>
    );
  }

  return (
    <DefaultLayout>
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
            <div className=" flex-1">{renderFormPengajuan()}</div>
            <div className=" flex-1">{renderBarangList()}</div>
          </div>
        </div>
      </div>
      <FileModal
        data={selectedFile?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => onCancelPengajuan()}
        onDone={() => {
          hide();
          type == 'SUCCESS'
            ? navigate('/request-barang', { replace: true })
            : null;
        }}
      />
    </DefaultLayout>
  );
};

export default ReportPermintaanBarang;
