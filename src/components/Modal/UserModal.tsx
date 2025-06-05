import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, List, ListItem } from '@material-tailwind/react';
import useFetch from '../../hooks/useFetch';
import { GET_BANK, SUPERUSER_GET_USER } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const UserModal = ({
  visible,
  toggle,
  value,
}: {
  visible: boolean;
  toggle: any;
  value?: any;
}) => {
  if (!visible) return null;

  // state
  const [users, setUsers] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    if (!users.length) {
      getUserList();
    }
  }, [visible]);

  async function getUserList(key = '') {
    const { state, data, error } = await useFetch({
      url: SUPERUSER_GET_USER + `?cari=${key}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setUsers(data?.rows);
    } else {
      setUsers([]);
    }
  }

  function onSaveButtonPress(selected: any) {
    value(selected);
    // toggle modal
    toggle();
  }

  function onInputSubmit(e: any) {
    e.preventDefault();

    getUserList(search);
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 pt-2 pb-4 mb-4.5">
          <div className=" flex-1">Pilih User</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <form onSubmit={onInputSubmit}>
            <input
              type="text"
              placeholder="Cari Nama User"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
        <List className=" max-h-56 overflow-y-auto">
          {users?.length ? (
            users.map((item: any) => {
              return (
                <div onClick={() => onSaveButtonPress(item)}>
                  <ListItem className=" text-black">{item?.nm_user}</ListItem>
                </div>
              );
            })
          ) : (
            <span className=" text-center">Tidak ditemukan hasil</span>
          )}
        </List>
      </div>
    </Dialog>
  );
};

export default UserModal;
