import {
  CheckIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  REIMBURSEMENT,
  REIMBURSEMENT_REMARK,
  REIMBURSEMENT_REMARK_CHECK,
} from '../../api/routes';
import DateRange from '../../components/DateRange';
import ModalSelector from '../../components/Modal/ModalSelctor';
import PeriodeModal from '../../components/Modal/PeriodeModal';
import CabangFilterGroup from '../../components/SelectGroup/CabangFilterGroup';
import TipeFilterGroup from '../../components/SelectGroup/TipeFilterGroup';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import useRiwayatSayafilter from '../../hooks/useRiwayatSayaFilter';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  formatCurrencyToNumber,
  openInNewTab,
  removeFromState,
} from '../../common/utils';
import formatRupiah from '../../common/formatRupiah';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import CabangModal from '../../components/Modal/CabangModal';
moment.locale('id');

const TABLE_HEAD = [
  'Pengajuan',
  'No. Doc.',
  'Cabang',
  'User',
  'Tanggal Invoice',
  'Tipe Pembayaran',
  'Deskripsi',
  'Amount',
  'Ref Dokumen Report',
  'Nominal Realisasi',
  'Saldo',
  'Bukti Pembayaran',
  'Keterangan Status',
  '',
  '',
];

function RemarkCA() {
  const [rList, setRList] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [showPeriode, setShowPeriode] = React.useState<boolean>(false);
  const [selectedId, setSelectedId] = React.useState<number>(0);
  const [selectedMark, setSelectedMark] = React.useState<boolean>(false);
  const [showCabang, setShowCabang] = React.useState<boolean>(false);
  const [selectedCabang, setSelectedCabang] = React.useState<any>([]);

  const navigate = useNavigate();

  // reimbursement akses
  const { toggle, visible, type, changeType, hide, show } = useModal();

  // filter store
  const { tipeFilter, cabangFilter, startDate, endDate, setFilters } =
    useRiwayatSayafilter();

  React.useEffect(() => {
    getReimbursementList(false, tipeFilter, startDate, endDate, cabangFilter);
  }, [tipeFilter, startDate, endDate, cabangFilter, page]);

  async function getReimbursementList(
    clear?: boolean,
    type?: string,
    startDate?: any,
    endDate?: any,
    cabang?: any,
  ) {
    changeType('LOADING');
    show();
    setLoading(true);
    const typeParam =
      type && type !== 'all' ? `&type=${type?.toUpperCase()}` : '';
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
    const cabangParam = cabang ? `&cabang=${cabang}` : '';

    const filterParam = typeParam + startDateParam + endDateParam + cabangParam;

    const { state, data, error } = await useFetch({
      url:
        REIMBURSEMENT_REMARK +
        `?limit=${limit}&page=${page}&cari=${clear ? '' : search}` +
        filterParam,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setRList(data?.rows);
      setPageInfo(data?.pageInfo);
      hide();
    } else {
      setLoading(false);
      setRList([]);
      hide();
    }
  }

  function statusChip(status: number) {
    if (status == 1) {
      return <Chip variant={'outlined'} color="green" value={'Sudah Dicek'} />;
    } else {
      return <Chip variant={'outlined'} color="amber" value={'Belum Dicek'} />;
    }
  }

  async function handleOnCheck() {
    changeType('LOADING');
    setLoading(true);

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_REMARK_CHECK(selectedId, !selectedMark),
      method: 'POST',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      changeType('SUCCESS');
    } else {
      setLoading(false);
      changeType('FAILED');
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex-col flex sm:flex-row sm:items-center  justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Remark Pengajuan Cash Advance
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Monitoring Cash advance Report
              </Typography>
            </div>
          </div>
          <div className="w-full flex flex-row items-center gap-x-2">
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
            {/* <CabangFilterGroup
              className=" w-full mt-4"
              value={cabangFilter}
              setValue={(val: string) => {
                setPage(1);
                setFilters({ cabangFilter: val });
              }}
            /> */}
          </div>

          <div className="w-full lg:flex lg:items-center lg:space-x-2 space-y-2 lg:space-y-2">
            <TipeFilterGroup
              className="w-full lg:w-1/3 mt-2"
              setValue={(val: string) => {
                setPage(1);
                setFilters({ tipeFilter: val });
              }}
              value={tipeFilter}
            />
            {/* <CashAdvanceFilterGroup
              className="w-full lg:w-1/3"
              setValue={(val: string) => {
                setPage(1);
                setFilters({ caFilter: val });
                //setCaFilter(val);
                // getReimbursementList(
                //   false,
                //   tipeFilter,
                //   val,
                //   ropFilter,
                //   startDate,
                //   endDate,
                //   cabangFilter,
                // );
              }}
              value={caFilter}
            /> */}
            {/* <StatusROPFilterGroup
              className="w-full lg:w-1/3"
              isUser={true}
              setValue={(val: string) => {
                setPage(1);
                setFilters({ ropFilter: val });
                //setROPFilter(val);
                // getReimbursementList(
                //   false,
                //   tipeFilter,
                //   caFilter,
                //   val,
                //   startDate,
                //   endDate,
                //   cabangFilter,
                // );
              }}
              value={ropFilter}
            /> */}
            <div className="w-full">
              <DateRange
                onShowButtonPress={() => setShowPeriode(!showPeriode)}
                periodeStart={startDate}
                periodeEnd={endDate}
                onResetButtonPress={() => {
                  setFilters({ startDate: null, endDate: null });
                }}
              />
            </div>
          </div>
          <div className="w-full mt-2 lg:max-w-[50%]">
            <div className="flex flex-row gap-x-4">
              <div className="w-full flex items-center flex-row justify-between rounded-md border border-stroke p-2 outline-none transition ">
                {selectedCabang.length > 0 ? (
                  <div className="flex-1 flex flex-wrap gap-2 max-h-25 overflow-y-auto">
                    {selectedCabang.map((item: any, index: number) => {
                      return (
                        <Chip
                          variant={'ghost'}
                          color={'blue'}
                          value={item.label}
                          animate={{
                            mount: { y: 0 },
                            unmount: { y: 50 },
                          }}
                          onClose={() =>
                            removeFromState(
                              selectedCabang,
                              item,
                              setSelectedCabang,
                              'value',
                            )
                          }
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-4 text-base">Cabang</p>
                )}
                <div className="flex flex-row items-center justify-center gap-2">
                  <Button
                    color={'blue'}
                    variant={'outlined'}
                    size={'sm'}
                    className={'normal-case max-h-8'}
                    onClick={() => setShowCabang(!showCabang)}
                  >
                    + Tambahkan
                  </Button>
                  <Button
                    color={'blue'}
                    size={'sm'}
                    className={'normal-case max-h-8'}
                    onClick={() => {
                      setPage(1);
                      setFilters({
                        cabangFilter: selectedCabang.map(
                          (item: any) => item.value,
                        ),
                      });
                    }}
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            </div>
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
                    {TABLE_HEAD.map((head) => (
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
                    const calculateSaldo =
                      formatCurrencyToNumber(item.nominal) -
                      formatCurrencyToNumber(item.realisasi);

                    const isLast = index === rList?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={item?.id}>
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
                        {/* <td className={classes}>
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
                        </td> */}
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.tanggal_reimbursement}
                            </Typography>
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
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.description}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nominal}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.childDoc}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.realisasi ? (
                              item?.realisasi
                            ) : (
                              <Chip
                                variant={'ghost'}
                                color="amber"
                                value={'Dalam Proses'}
                              />
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {formatRupiah(calculateSaldo, true)}
                          </Typography>
                        </td>
                        <td
                          className={`${classes} hover:text-blue-500 cursor-pointer font-semibold text-sm`}
                          onClick={() =>
                            item.bukti_attachment
                              ? window.open(
                                  item.bukti_attachment,
                                  '_blank',
                                  'noreferrer',
                                )
                              : null
                          }
                        >
                          {item.bukti_attachment ? 'Bukti Pembayaran' : '-'}
                        </td>
                        <td
                          className={`${classes} sticky right-[8rem] bg-white z-10`}
                        >
                          {statusChip(item?.remarked)}
                        </td>
                        <td
                          className={`${classes} sticky right-[4rem] bg-white z-10`}
                        >
                          <Tooltip content={'Detail'}>
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/reimbursement/${item?.id}`, {
                                  replace: false,
                                  state: item,
                                });
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td
                          className={`${classes} sticky right-0 bg-white z-10`}
                        >
                          <Tooltip
                            content={
                              item.remarked
                                ? 'Tandai Belum Dicek'
                                : 'Tandai Sudah Dicek'
                            }
                          >
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedId(item.id);
                                setSelectedMark(item.remarked);
                                changeType('CONFIRM');
                                show();
                              }}
                            >
                              {item.remarked ? (
                                <XMarkIcon className="h-4 w-4" />
                              ) : (
                                <CheckIcon className="h-4 w-4" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </td>
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
                  size="sm"
                  color="blue"
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
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={handleOnCheck}
        onDone={getReimbursementList}
      />
      <PeriodeModal
        visible={showPeriode}
        startDate={startDate}
        endDate={endDate}
        toggle={() => setShowPeriode(!showPeriode)}
        value={(cb: any) => {
          setFilters({
            startDate: cb.startDate,
            endDate: cb.endDate,
          });
          // setStartDate(cb.startDate);
          // setEndDate(cb.endDate);
        }}
      />
      <CabangModal
        visible={showCabang}
        toggle={() => setShowCabang(!showCabang)}
        value={(val: any) => setSelectedCabang([...selectedCabang, val])}
        filter={selectedCabang}
      />
    </DefaultLayout>
  );
}

export default RemarkCA;
