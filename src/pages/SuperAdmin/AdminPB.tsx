import { TrashIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Button as MButton,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import * as React from 'react';
import {
  ADMIN_PB,
  DELETE_SUPERUSER,
  GET_ADMIN_PB,
  SUPERUSER,
} from '../../api/routes';
import Button from '../../components/Button';
import ModalSelector from '../../components/Modal/ModalSelctor';
import UserModal from '../../components/Modal/UserModal';
import DeptGroup from '../../components/SelectGroup/DeptGroup';
import TypeGroup from '../../components/SelectGroup/TypeGroup';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import DefaultLayout from '../../layout/DefaultLayout';

const TABLE_HEAD = ['ID User', 'Nama User', ''];

function AdminPB() {
  const [list, setList] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  // === Pengumuman
  const [selectedUser, setSelectedUser] = React.useState<any>();
  const [typeAcc, setTypeAcc] = React.useState<string>('');
  const [dept, setDept] = React.useState<string>('');
  const [selected, setSelected] = React.useState<any>();

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [context, setContext] = React.useState<string>();

  // === USER MODAL
  const [showUser, setShowUser] = React.useState<boolean>(false);

  React.useEffect(() => {
    getList();
  }, [page, type]);

  async function getList() {
    setLoading(true);
    const { state, data, error } = await useFetch({
      url: GET_ADMIN_PB + `?page=${page}&limit=${limit}`,
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

    const { state, data, error } = await useFetch({
      url: ADMIN_PB(selectedUser?.iduser),
      method: 'POST',
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
      url: ADMIN_PB(selected),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  console.log('LIST', list);

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Tambah Admin Permintaan Barang
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className=" w-full">
            <label className="mb-3 block text-black dark:text-white">
              User
            </label>
            <div
              onClick={() => setShowUser(!showUser)}
              className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            >
              {selectedUser?.nm_user || 'Pilih User'}
            </div>
          </div>

          <div className=" w-full">
            <Button
              disabled={!selectedUser}
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                setContext('CREATE');
                toggle();
              }}
            >
              Tambah Akun
            </Button>
          </div>
        </div>
      </div>

      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Admin Permintaan Barang
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua akun admin permintaan barang.
              </Typography>
            </div>
          </div>
        </CardHeader>
        {!list.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-black font-semibold text-sm">
              Belum ada data
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
              <Typography variant="small" color="black" className="font-normal">
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
        onDone={() => {
          setTypeAcc('');
          setDept('');
          setSelectedUser(null);
        }}
      />
      <UserModal
        visible={showUser}
        toggle={() => setShowUser(!showUser)}
        value={(val: any) => setSelectedUser(val)}
      />
    </DefaultLayout>
  );
}

export default AdminPB;
