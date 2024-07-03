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
import { LIST_REQUEST_BARANG, REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const TABLE_HEAD = [
  'ID PB',
  'ID User',
  'Kirim ke',
  'Cabang',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Jam Transaksi',
  'Status',
  '',
];

function PermintaanBarang() {
  const [list, setList] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');

  const navigate = useNavigate();

  React.useEffect(() => {
    getList();
  }, [page]);

  async function getList(clear?: boolean) {
    setLoading(true);
    const { state, data, error } = await useFetch({
      url:
        LIST_REQUEST_BARANG +
        `?limit=${limit}&page=${page}&cari=${clear ? '' : search}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setList(data.rows);
      setPageInfo(data?.pageInfo);
    } else {
      setLoading(false);
      setList([]);
    }
  }

  function statusChip(status: string) {
    if (status == 'Disetujui') {
      return <Chip variant={'outlined'} color="green" value={'Diterima'} />;
    }

    if (status == 'Ditolak') {
      return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
    }

    return <Chip variant={'outlined'} color="amber" value={status} />;
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex-col flex sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Riwayat Permintaan Barang
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat permintaan barang.
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="filled"
                size="sm"
                color="blue"
                onClick={() => navigate('/barang', { replace: false })}
              >
                Buat Permintaan Barang
              </Button>
            </div>
          </div>
          <div className="relative w-full">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                // getReimbursementList();
                getList();
              }}
            >
              <input
                type="text"
                placeholder="Cari ID PB, cabang, kode cabang..."
                className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 pr-10 mt-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && ( // Tampilkan tombol X jika nilai input tidak kosong
                <button
                  type="button"
                  className="absolute h-11 inset-y-0 top-4 right-0 px-3 flex items-center "
                  onClick={(e) => {
                    e.preventDefault();
                    setSearch('');
                    //getReimbursementList(true);
                    getList(true);
                  }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </CardHeader>
        {!list?.length ? (
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
                  {list?.map((item: any, index) => {
                    const isLast = index === list?.length - 1;
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
                                {item?.id_pb}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.iduser}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nm_cabang}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nm_induk}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.tgl_approve || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {moment(item?.tgl_trans).format('ll') || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.jam_trans}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          {/* <Typography variant="small" className="font-normal">
                            {item?.status}
                          </Typography> */}
                          {statusChip(item?.status_pb)}
                        </td>
                        <td className={classes}>
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/request-barang/${item?.id_pb}`, {
                                  replace: false,
                                  state: item,
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
                  disabled={page == pageInfo.pageCount || loading}
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
    </DefaultLayout>
  );
}

export default PermintaanBarang;
