import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, List, ListItem } from '@material-tailwind/react';
import useFetch from '../../hooks/useFetch';
import { GET_CABANG, SUPERUSER } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const AdminModal = ({
  visible,
  toggle,
  dismissOnBackdrop,
  requesterId,
  value,
  rid,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  requesterId?: string;
  value?: any;
  rid?: number;
}) => {
  if (!visible) return null;

  // state
  const [list, setList] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    if (!list.length) {
      getList();
    }
  }, [visible]);

  async function getList() {
    console.log(requesterId);
    let param = '';
    if (requesterId) {
      param += `&exceptId=${requesterId}`;
    }

    if (rid) {
      param += `&rid=${rid}`;
    }

    const { state, data, error } = await useFetch({
      url: SUPERUSER + `?limit=1000${param}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.rows);
    } else {
      setList([]);
    }
  }

  React.useEffect(() => {
    onFilteredBank(search);
  }, [search]);

  function onFilteredBank(key: string) {
    const filtered = list.filter((item: { nm_user: string; value: string }) => {
      return item.nm_user.toLowerCase().includes(key.toLowerCase());
    });

    return filtered;
  }

  function onSaveButtonPress(selected: any) {
    value(selected);
    // toggle modal
    toggle();
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 pt-2 pb-4 mb-4.5">
          <div className=" flex-1">Pilih Approval</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <input
            type="text"
            placeholder="Cari..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <List className=" max-h-56 overflow-y-auto">
          {onFilteredBank(search) &&
            onFilteredBank(search).map((item: any, index: number) => {
              return (
                <div onClick={() => onSaveButtonPress(item)}>
                  <ListItem className=" text-black">{item?.nm_user}</ListItem>
                </div>
              );
            })}
        </List>
      </div>
    </Dialog>
  );
};

export default AdminModal;
