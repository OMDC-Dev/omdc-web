import * as React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
  Button as MButton,
  Chip,
  Input,
  Button,
} from '@material-tailwind/react';
import ModalSelector from '../../components/Modal/ModalSelctor';
import {
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import useModal from '../../hooks/useModal';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { WORKPLAN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { cekAkses, delay, getFormattedDateTable } from '../../common/utils';
import {
  WORKPLAN_STATUS,
  getWorkplanStatusText,
} from '../../constants/WorkplanStatus';
import { colors } from '@material-tailwind/react/types/generic';
import { XMarkIcon } from '@heroicons/react/24/solid';
import WorkplanFilterModal from '../../components/Modal/WorkplanFilterModal';
import {
  createWorkplanReportData,
  exportToExcell,
} from '../../common/exportToExcell';
import { useAuth } from '../../hooks/useAuth';
import WorkplanReortRangeModal from '../../components/Modal/WorkplanReportRangeModal';

const TABLE_HEAD = [
  'ID',
  'Tanggal Dibuat',
  'Cabang / Lokasi',
  'Grup',
  'Kategori',
  'PIC',
  'Perihal',
  'Tanggal Mulai',
  'Est. Tanggal Selesai',
  'Status',
  '',
  '',
];

const WorkplanSaya: React.FC = () => {
  const [list, setList] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [search, setSearch] = React.useState<string>('');

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [showWPFilter, setShowWPFilter] = React.useState(false);
  const [showWPRange, setShowWPRange] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const navigate = useNavigate();

  const isWorkplanMaker = cekAkses('#11');
  const { user } = useAuth();

  const { status } = useParams();

  React.useEffect(() => {
    setList([]);
    setPage(1);
    setFilter('');
    getMyWorkplan();
  }, [status]);

  // React.useEffect(() => {
  //   getMyWorkplan();
  // }, []);

  async function getMyWorkplan(clearOn?: string) {
    changeType('LOADING');
    show();
    let param = '';

    if (search) {
      param += clearOn == 'SEARCH' ? '' : `&search=${search}`;
    }

    const _GET_STATUS = _getStatusByParams();

    function _getStatusByParams() {
      if (status == 'waiting') {
        return [WORKPLAN_STATUS.ON_PROGRESS, WORKPLAN_STATUS.REVISON];
      } else if (status == 'pending') {
        return WORKPLAN_STATUS.PENDING;
      } else {
        return WORKPLAN_STATUS.FINISH;
      }
    }

    const { state, data, error } = await useFetch({
      url:
        WORKPLAN +
        `?limit=${limit}&page=${page}${param}&${filter}&status=${_GET_STATUS}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList([]);
      setList(data.rows);
      setPageInfo(data.pageInfo);
      hide();
      changeType('NONE');
    } else {
      console.log(error);
      hide();
      setList([]);
      changeType('NONE');
    }
  }

  async function downloadWorkplan(date: any) {
    changeType('LOADING');
    show();

    const { state, data, error } = await useFetch({
      url:
        WORKPLAN +
        `?limit=5000&page=1&startDate=${date.start}&endDate=${date.end}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      onExportToExcell(data.rows);
    } else {
      hide();
      changeType('ERROR');
    }
  }

  function onExportToExcell(data = []) {
    // Sheet 3
    const reportWP = {
      sheetName: `Report Workplan - ${user.nm_user}`,
      data: createWorkplanReportData(data),
      headers: [
        'NO',
        'ID WORKPLAN',
        'GRUP WORKPLAN',
        'PIC',
        'TANGGAL MULAI',
        'EST. TANGGAL SELESAI',
        'PERIHAL',
        'KATEGORI',
        'BEFORE',
        'AFTER',
        'STATUS',
        'TANGGAL DISETUJUI / SELESAI',
        'DISETUJUI OLEH',
        'LOKASI / CABANG',
        'TANGGAL DIBUAT',
      ],
    };

    exportToExcell(reportWP.data, reportWP.headers, reportWP.sheetName);
    hide();
  }

  React.useEffect(() => {
    // if (filter) {
    //   getMyWorkplan();
    //   console.log('FILTER', filter);
    // }
    getMyWorkplan();
  }, [filter, page]);

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Work in Progress Saya
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua work in progress
              </Typography>
            </div>
            {isWorkplanMaker && (
              <div className="flex flex-col gap-4 lg:flex-row">
                <MButton
                  variant={'outlined'}
                  size="sm"
                  color="blue"
                  onClick={() => setShowWPRange(true)}
                >
                  Download Report
                </MButton>
                <MButton
                  variant="filled"
                  size="sm"
                  color="blue"
                  onClick={() =>
                    navigate('/workplan/pengajuan', { replace: false })
                  }
                >
                  Buat Work in Progress
                </MButton>
              </div>
            )}
          </div>
          <div className="w-full flex flex-row mt-4.5">
            <form
              className="w-full relative"
              onSubmit={(e) => {
                e.preventDefault();
                getMyWorkplan();
              }}
            >
              <input
                type="text"
                placeholder="Cari No. work in progress, cabang, perihal ..."
                className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 pr-10 mt-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && ( // Tampilkan tombol X jika nilai input tidak kosong
                <button
                  type="button"
                  className="absolute inset-y-0 top-4 right-0 px-3 flex items-center"
                  onClick={async (e) => {
                    e.preventDefault();
                    setSearch('');
                    getMyWorkplan('SEARCH');
                  }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </form>
            <IconButton className="m-4" onClick={() => setShowWPFilter(true)}>
              <AdjustmentsHorizontalIcon className=" text-blue-gray-500 w-6 h-6" />
            </IconButton>
          </div>
        </CardHeader>
        {!list?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-black-2 font-semibold text-sm">
              Belum ada work in progress
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
                  {list?.map((item: any, index: number) => {
                    const isLast = index === list?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={item?.iduser}>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.workplan_id}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        {/* <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Chip
                                className="normal-case"
                                variant={'ghost'}
                                color={
                                  item?.jenis_workplan == 'APPROVAL'
                                    ? 'light-blue'
                                    : 'teal'
                                }
                                value={
                                  item?.jenis_workplan == 'APPROVAL'
                                    ? 'Approval'
                                    : 'Non Approval'
                                }
                              />
                            </div>
                          </div>
                        </td> */}
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {getFormattedDateTable(item?.createdAt)}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.cabang_detail
                                ? item?.cabang_detail.nm_induk
                                : item?.custom_location}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.group_type
                                ? item?.group_type == 'MEDIC'
                                  ? 'Medis'
                                  : 'Non Medis'
                                : '-'}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.kategori}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.user_detail?.nm_user}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max max-w-[350px]">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.perihal}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.tanggal_mulai}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.tanggal_selesai}
                            </Typography>
                          </div>
                        </td>
                        <td
                          className={`${classes} sticky right-[8rem] bg-white z-10`}
                        >
                          <div className="w-max">
                            <Chip
                              className="normal-case"
                              variant={'ghost'}
                              color={
                                getWorkplanStatusText(item.status)
                                  .color as colors
                              }
                              value={getWorkplanStatusText(item.status).text}
                            />
                          </div>
                        </td>
                        <td
                          className={`${classes} sticky right-[4rem] bg-white z-10`}
                        >
                          <Tooltip content="Edit">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/workplan/pengajuan/${item.id}`, {
                                  state: {
                                    jenis_workplan: item.jenis_workplan,
                                    isEditMode: true,
                                  },
                                });
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td
                          className={`${classes} sticky right-0 bg-white z-10`}
                        >
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/workplan/pengajuan/${item.id}`, {
                                  state: {
                                    jenis_workplan: item.jenis_workplan,
                                  },
                                });
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
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
                Halaman {page} dari {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <MButton
                  disabled={page < 2 || type == 'LOADING'}
                  variant="outlined"
                  size="sm"
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </MButton>
                <MButton
                  disabled={page == pageInfo?.pageCount || type == 'LOADING'}
                  variant="outlined"
                  size="sm"
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Next
                </MButton>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => {}}
        onDone={() => {}}
      />

      <WorkplanFilterModal
        visible={showWPFilter}
        toggle={() => setShowWPFilter(!showWPFilter)}
        onApply={(flr: string) => setFilter(flr)}
      />

      <WorkplanReortRangeModal
        visible={showWPRange}
        toggle={() => setShowWPRange(!showWPRange)}
        onApply={(selectedDate: any) => downloadWorkplan(selectedDate)}
      />
    </DefaultLayout>
  );
};

export default WorkplanSaya;
