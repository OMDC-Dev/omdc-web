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
import {
  DELETE_PENGUMUMAN,
  DELETE_SUPERUSER,
  GET_NOTIFICATION,
  SUPERUSER,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import useNotif from '../../store/useNotif';
import { useAuth } from '../../hooks/useAuth';
import TypeGroup from '../../components/SelectGroup/TypeGroup';
import DeptGroup from '../../components/SelectGroup/DeptGroup';
import { generateRandomNumber } from '../../common/utils';

const TABLE_HEAD = [
  'ID User',
  'Nama User',
  'Departemen',
  'Level User',
  'Tipe User',
  '',
];

function SuperAdmin() {
  const [list, setList] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  // === Pengumuman
  const [name, setName] = React.useState<string>('');
  const [typeAcc, setTypeAcc] = React.useState<string>('');
  const [dept, setDept] = React.useState<string>('');
  const [jabatan, setJabatan] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
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
      url: SUPERUSER + `?page=${page}&limit=${limit}&get=1`,
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

  async function createAccount() {
    changeType('LOADING');

    const genid = `AC${
      typeAcc == 'ADMIN' ? 'ADM' : 'FIN'
    }${generateRandomNumber(100, 999)}`;

    const body = {
      iduser: genid,
      nm_user: name,
      level_user: jabatan,
      departemen: dept,
      password: password,
      type: typeAcc,
    };

    const { state, data, error } = await useFetch({
      url: SUPERUSER,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  async function deleteAccount() {
    changeType('LOADING');

    const { state, data, error } = await useFetch({
      url: DELETE_SUPERUSER(selected),
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
            Tambah Admin atau Finance Baru
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Nama User
            </label>
            <input
              type="text"
              placeholder="Masukan Nama"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="w-full">
            <TypeGroup value={(val) => setTypeAcc(val)} />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Jabatan
            </label>
            <input
              type="text"
              placeholder="Masukan Jabatan"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setJabatan(e.target.value)}
              value={jabatan}
            />
          </div>

          <div className="w-full">
            <DeptGroup value={(val) => setDept(val)} />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Password ( min. 6 karakter )
            </label>
            <input
              type="password"
              placeholder="Masukan Password"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className=" w-full">
            <Button
              disabled={
                !name ||
                !typeAcc ||
                !dept ||
                !password ||
                !jabatan ||
                password.length < 6
              }
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                setContext('CREATE');
                toggle();
              }}
            >
              Buat Akun
            </Button>
          </div>
        </div>
      </div>

      <Card className="h-full w-full bg-boxdark">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 bg-boxdark">
            <div>
              <Typography variant="h5" color="white">
                Akun Admin dan Finance
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua akun admin dan finance.
              </Typography>
            </div>
          </div>
        </CardHeader>
        {!list?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-white font-semibold text-sm">
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
                        className="border-y border-blue-gray-800 bg-strokedark p-4"
                      >
                        <Typography
                          variant="small"
                          className="font-normal leading-none opacity-70 text-whiten"
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
                      : 'p-4 border-b border-blue-gray-800';

                    return (
                      <tr key={item?.iduser}>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.iduser}
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
                              {item?.nm_user}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.departemen}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.level_user}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.type}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Hapus">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelected(item.iduser);
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
          context == 'CREATE' ? createAccount() : deleteAccount()
        }
      />
    </DefaultLayout>
  );
}

export default SuperAdmin;
