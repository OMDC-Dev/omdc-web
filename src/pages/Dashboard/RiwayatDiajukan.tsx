import * as React from 'react';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import {
  FINANCE_PENGAJUAN,
  GET_MAKER_REIMBURSEMENT,
  GET_UNREVIEW_REIMBURSEMENT,
  PENGAJUAN,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import TipeFilterGroup from '../../components/SelectGroup/TipeFilterGroup';
import CashAdvanceFilterGroup from '../../components/SelectGroup/CashAdvanceFilterGroup';
import StatusROPFilterGroup from '../../components/SelectGroup/StatusROPFilterGroup';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import DateRange from '../../components/DateRange';
import PeriodeModal from '../../components/Modal/PeriodeModal';

const TABLE_HEAD = [
  '',
  'Status Approval Saya',
  'Status Pengajuan',
  'Pengajuan',
  'No. Dok',
  'Kategori Permintaan',
  'Pembayaran',
  'Induk Cabang',
  'Diajukan Oleh',
  'Nama Client / Vendor',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Keterangan Status',
];

const TABLE_HEAD_FINANCE = [
  '',
  'Status Pengajuan',
  'Status Finance',
  'Pengajuan',
  'No. Dok',
  'Kategori Permintaan',
  'Pembayaran',
  'Induk Cabang',
  'Diajukan Oleh',
  'Nama Client / Vendor',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Keterangan Status',
];

function RiwayatDiajukan() {
  const [rList, setRList] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [tipeFilter, setTipeFilter] = React.useState<string>('');
  const [caFilter, setCaFilter] = React.useState<string>('');
  const [ropFilter, setROPFilter] = React.useState<string>('');
  const [showPeriode, setShowPeriode] = React.useState<boolean>(false);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const { toggle, visible, type, changeType, hide, show } = useModal();
  const { user } = useAuth();

  const ADMIN_TYPE = user?.type;

  const TABLE =
    ADMIN_TYPE == 'ADMIN' || ADMIN_TYPE == 'REVIEWER' || ADMIN_TYPE == 'MAKER'
      ? TABLE_HEAD
      : TABLE_HEAD_FINANCE;

  const navigate = useNavigate();

  React.useEffect(() => {
    getReimbursementList(
      false,
      tipeFilter,
      caFilter,
      ropFilter,
      startDate,
      endDate,
    );
  }, [page, startDate, endDate]);

  console.log('ADMIN TYPE', ADMIN_TYPE);

  async function getReimbursementList(
    clear?: boolean,
    type?: string,
    ca?: string,
    rop?: string,
    startDate?: any,
    endDate?: any,
  ) {
    changeType('LOADING');
    show();
    const typeParam = (key: string) =>
      type && type !== 'all' ? `&${key}=${type?.toUpperCase()}` : '';

    const caParam = ca && ca !== 'ALL' ? `&statusCA=${ca?.toUpperCase()}` : '';
    const ropParam =
      rop && rop !== 'ALL' ? `&statusROP=${rop?.toUpperCase()}` : '';
    const startDateParam = startDate
      ? `&periodeStart=${moment(startDate)
          .utc()
          .endOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')}`
      : '';
    const endDateParam = endDate
      ? `&periodeEnd=${moment(endDate)
          .utc()
          .add(1, 'day')
          .endOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')}`
      : '';

    let param = '';
    let URL = '';
    if (ADMIN_TYPE == 'ADMIN') {
      URL = PENGAJUAN;
      param = typeParam('type');
      param += '&sort=ADMIN&web=true';
      param += caParam;
      param += ropParam;
      param += startDateParam;
      param += endDateParam;
    } else if (ADMIN_TYPE == 'FINANCE') {
      URL = FINANCE_PENGAJUAN;
      param = typeParam('type');
      param += '&sort=FINANCE';
      param += caParam;
      param += ropParam;
      param += startDateParam;
      param += endDateParam;
    } else if (ADMIN_TYPE == 'REVIEWER') {
      URL = GET_UNREVIEW_REIMBURSEMENT;
      param = typeParam('typePembayaran');
      param += '&sort=REVIEWER';
      param += caParam;
      param += ropParam;
      param += startDateParam;
      param += endDateParam;
    } else {
      URL = GET_MAKER_REIMBURSEMENT;
      param = typeParam('typePembayaran');
      param += '&sort=MAKER';
      param += caParam;
      param += ropParam;
      param += startDateParam;
      param += endDateParam;
    }

    console.log('URL', URL);

    const { state, data, error } = await useFetch({
      url:
        URL +
        `?limit=${limit}&page=${page}&cari=${clear ? '' : search}` +
        param,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setRList(data?.rows);
      setPageInfo(data?.pageInfo);
    } else {
      setRList([]);
      hide();
    }
  }

  function statusChip(status: string, finance: string) {
    switch (status) {
      case 'WAITING':
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
      case 'APPROVED':
        return (
          <Chip
            variant={'outlined'}
            color="green"
            value={finance == 'DONE' ? 'Selesai' : 'Disetujui'}
          />
        );
        break;
      case 'REJECTED':
        return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
        break;
      case 'DONE':
        return <Chip variant={'outlined'} color="green" value={'Selesai'} />;
        break;
      default:
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
    }
  }

  function keteranganStatus(item: any) {
    if (
      item.jenis_reimbursement !== 'Cash Advance' ||
      item.status_finance !== 'DONE' ||
      item.status !== 'APPROVED'
    ) {
      return '-';
    }

    if (
      item.realisasi?.length > 1 &&
      item.childId &&
      item.status_finance_child == 'DONE'
    ) {
      return 'Sudah Dikembalikan';
    } else {
      return item.childId ? 'Belum dikembalikan' : 'Perlu laporan realisasi';
    }
  }

  function renderAdminChip(item: any) {
    let status = '';
    if (ADMIN_TYPE == 'ADMIN') {
      if (item.needExtraAcceptance) {
        const self = item.extraAcceptance.iduser == user.iduser;
        if (self) {
          status = item.extraAcceptanceStatus;
        }
      } else {
        const self = item.accepted_by.find(
          (item: any) => item.iduser == user.iduser,
        );
        status = self.status;
      }
    }

    if (ADMIN_TYPE == 'REVIEWER') {
      status = item.reviewStatus;
    }

    if (ADMIN_TYPE == 'MAKER') {
      status = item.makerStatus;
    }

    if (status == 'APPROVED') {
      return <Chip variant={'outlined'} color="green" value={'Disetujui'} />;
    } else if (status == 'REJECTED') {
      return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
    } else {
      return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 ">
            <div>
              <Typography variant="h5" color="black">
                Diajukan ke Saya
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat pengajuan oleh user.
              </Typography>
            </div>
          </div>
          <div className="relative w-full">
            <form
              className="w-full relative"
              onSubmit={(e) => {
                e.preventDefault();
                getReimbursementList();
              }}
            >
              <input
                type="text"
                placeholder="Cari No. dokumen, coa, kode cabang..."
                className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 pr-10 mt-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && ( // Tampilkan tombol X jika nilai input tidak kosong
                <button
                  type="button"
                  className="absolute inset-y-0 top-4 right-0 px-3 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearch('');
                    getReimbursementList(true);
                  }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
          <div className="w-full lg:flex lg:items-center lg:space-x-2 space-y-2 lg:space-y-2">
            <TipeFilterGroup
              className="w-full lg:w-1/3 mt-2"
              setValue={(val: string) => {
                setTipeFilter(val);
                getReimbursementList(
                  false,
                  val,
                  caFilter,
                  ropFilter,
                  startDate,
                  endDate,
                );
              }}
              value={tipeFilter}
            />
            <CashAdvanceFilterGroup
              className="w-full lg:w-1/3"
              setValue={(val: string) => {
                setCaFilter(val);
                getReimbursementList(
                  false,
                  tipeFilter,
                  val,
                  ropFilter,
                  startDate,
                  endDate,
                );
              }}
              value={caFilter}
            />
            <StatusROPFilterGroup
              className="w-full lg:w-1/3"
              setValue={(val: string) => {
                setROPFilter(val);
                getReimbursementList(
                  false,
                  tipeFilter,
                  caFilter,
                  val,
                  startDate,
                  endDate,
                );
              }}
              value={ropFilter}
            />
          </div>
          <div className=" mt-2">
            <DateRange
              onShowButtonPress={() => setShowPeriode(!showPeriode)}
              periodeStart={startDate}
              periodeEnd={endDate}
              onResetButtonPress={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            />
          </div>
        </CardHeader>

        {!rList?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-black font-semibold text-sm">
              Belum ada pengajuan
            </div>
          </CardBody>
        ) : (
          <>
            <CardBody className="overflow-scroll px-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rList.map((item: any, index) => {
                    const isLast = index === rList?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={item?.id}>
                        <td className={classes}>
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/reimbursement/admin/${item?.id}`, {
                                  replace: false,
                                  state: item,
                                });
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        {ADMIN_TYPE !== 'FINANCE' ? (
                          <td className={classes}>{renderAdminChip(item)}</td>
                        ) : null}
                        <td className={classes}>
                          {statusChip(item?.status, item?.status_finance)}
                        </td>
                        {ADMIN_TYPE == 'FINANCE' ? (
                          <td className={classes}>
                            {/* <Typography variant="small" className="font-normal">
                              {item?.status_finance}
                            </Typography> */}
                            {statusChip(item?.status_finance, '')}
                          </td>
                        ) : null}
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.jenis_reimbursement}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.no_doc}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.tipePembayaran}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.payment_type}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        {/* <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.tanggal_reimbursement}
                            </Typography>
                          </div>
                        </td> */}
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.kode_cabang}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.requester?.nm_user}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.coa}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nominal}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.accepted_date || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {moment(item?.createdAt).format('lll') || '-'}
                          </Typography>
                        </td>
                        {ADMIN_TYPE !== 'FINANCE' ? (
                          <td className={classes}>{keteranganStatus(item)}</td>
                        ) : null}

                        {ADMIN_TYPE == 'FINANCE' ? (
                          <td className={classes}>{keteranganStatus(item)}</td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography variant="small" color="black" className="font-normal">
                Page {page} of {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <Button
                  disabled={page < 2 || loading}
                  variant="outlined"
                  size="sm"
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={page == pageInfo?.pageCount || loading}
                  variant="outlined"
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
      <ModalSelector type={type} visible={visible} toggle={toggle} />
      <PeriodeModal
        visible={showPeriode}
        startDate={startDate}
        endDate={endDate}
        toggle={() => setShowPeriode(!showPeriode)}
        value={(cb: any) => {
          setStartDate(cb.startDate);
          setEndDate(cb.endDate);
        }}
      />
    </DefaultLayout>
  );
}

export default RiwayatDiajukan;
