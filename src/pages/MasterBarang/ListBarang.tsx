import * as React from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button as MButton,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { GET_BARANG } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';

const TABLE_HEAD = [
  'Kode Barang',
  'Nama Barang',
  'Grup Barang',
  'Kategori Barang',
  'Nama Satuan',
  'Nama Perusahaan',
  'Tanggal Dibuat',
  '',
];

function ListMasterBarang() {
  const [list, setList] = React.useState<any>([]);
  const [keyword, setKeyword] = React.useState<string>();
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    getList();
  }, [page]);

  async function getList() {
    setLoading(true);

    const { state, data, error } = await useFetch({
      url: GET_BARANG(keyword) + `&page=${page}&limit=${limit}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.data);
      setPageInfo(data.pageInfo);
      setLoading(false);
    } else {
      setList([]);
      setLoading(false);
    }
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex-col flex sm:flex-row sm:items-center  justify-between gap-8">
              <div>
                <Typography variant="h5" color="black">
                  Daftar Barang
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Menampilkan semua barang.
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <MButton
                  variant="filled"
                  size="sm"
                  color="blue"
                  onClick={() =>
                    navigate('/master-barang/add', { replace: false })
                  }
                >
                  Tambah Barang
                </MButton>
              </div>
            </div>
            <div className="w-full ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  getList();
                }}
              >
                <input
                  type="text"
                  placeholder="Cari barang..."
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 mt-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
              </form>
            </div>
          </CardHeader>
          {!list.length ? (
            <CardBody>
              <div className=" h-96 flex justify-center items-center text-black font-semibold text-sm text-center">
                {keyword
                  ? 'Tidak ditemukan barang yang sesuai, mohon periksa kembali!'
                  : 'Mulai cari untuk memunculkan list barang'}
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
                    {list.map((item: any, index: number) => {
                      const isLast = index === list.length - 1;
                      const classes = isLast
                        ? 'p-4'
                        : 'p-4 border-b border-blue-gray-50';

                      return (
                        <tr key={item?.kd_brg}>
                          <td className={classes}>
                            <div className="flex items-center gap-3 ">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  className="font-normal"
                                >
                                  {item?.kd_brg}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.nm_barang}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Typography
                                variant="small"
                                className="font-normal "
                              >
                                {item?.grup_brg}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.kategory_brg}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.nm_kemasan}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.nm_comp}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.tgl_create || '-'}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Edit Barang">
                              <IconButton
                                variant="text"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate('/master-barang/add', {
                                    replace: false,
                                    state: item,
                                  });
                                }}
                              >
                                <DocumentPlusIcon className="h-4 w-4" />
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
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal"
                >
                  Halaman {page} dari {pageInfo?.pageCount}
                </Typography>
                <div className="flex gap-2">
                  <MButton
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
                  </MButton>
                  <MButton
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
                  </MButton>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </DefaultLayout>
  );
}

export default ListMasterBarang;
