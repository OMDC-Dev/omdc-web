import * as React from 'react';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button as MButton,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { DELETE_PENGUMUMAN, GET_NOTIFICATION } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import useNotif from '../../store/useNotif';
import { useAuth } from '../../hooks/useAuth';

const TABLE_HEAD = ['ID Pengumuman', 'Judul', 'Tanggal Dibuat', '', ''];

function Pengumuman() {
  const [list, setList] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  // === Pengumuman
  const [judul, setJudul] = React.useState<string>('');
  const [pesan, setPesan] = React.useState<string>('');
  const [selected, setSelected] = React.useState<any>();

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [context, setContext] = React.useState<string>();
  const notifStore = useNotif();

  // === User
  const { user } = useAuth();

  // === Navigate
  const navigate = useNavigate();

  React.useEffect(() => {
    getList();
  }, [page, type]);

  async function getList() {
    setLoading(true);
    const { state, data, error } = await useFetch({
      url:
        GET_NOTIFICATION + `?page=${page}&limit=${limit}&owner=${user?.iduser}`,
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

  async function createPengumuman() {
    changeType('LOADING');

    const body = {
      title: judul,
      message: pesan,
    };

    const { state, data, error } = await useFetch({
      url: GET_NOTIFICATION,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setJudul('');
      setPesan('');
    } else {
      changeType('FAILED');
    }
  }

  async function deletePengumuman() {
    changeType('LOADING');

    const { state, data, error } = await useFetch({
      url: DELETE_PENGUMUMAN(selected),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Buat Pengumuman Baru
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Judul Pengumuman
            </label>
            <input
              type="text"
              placeholder="Masukan Judul Pengumuman"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setJudul(e.target.value)}
              value={judul}
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Pesan Pengumuman
            </label>
            <textarea
              rows={4}
              placeholder="Masukan Pesan Pengumuman"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setPesan(e.target.value)}
              value={pesan}
            ></textarea>
          </div>

          <div className=" w-full">
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                setContext('CREATE');
                toggle();
              }}
              disabled={!judul || !pesan}
            >
              Buat Pengumuman
            </Button>
          </div>
        </div>
      </div>

      <Card className="h-full w-full ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Pengumuman
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat pengumuman yang telah dibuat.
              </Typography>
            </div>
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
                  {list?.map((item: any, index: number) => {
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
                                {item?.pid}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.title}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {moment(item?.createdAt).format('lll')}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Lihat">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                notifStore.setNotif({
                                  title: item?.title,
                                  message: item?.message,
                                  date: moment(item?.createdAt).format('lll'),
                                });
                                notifStore.toggle();
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Hapus">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelected(item.pid);
                                changeType('CONFIRM');
                                setContext('DELETE');
                                toggle();
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
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
              <Typography variant="small" color="white" className="font-normal">
                Halaman {page} dari {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <MButton
                  disabled={page < 2 || loading}
                  variant="outlined"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </MButton>
                <MButton
                  disabled={page == pageInfo.pageCount || loading}
                  variant="outlined"
                  size="sm"
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
        onConfirm={() =>
          context == 'CREATE' ? createPengumuman() : deletePengumuman()
        }
      />
    </DefaultLayout>
  );
}

export default Pengumuman;
