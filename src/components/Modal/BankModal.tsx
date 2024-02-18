import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { List, ListItem } from '@material-tailwind/react';
import useFetch from '../../hooks/useFetch';
import { GET_BANK } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const BankModal = ({
  visible,
  toggle,
  dismissOnBackdrop,
  value,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  value?: any;
}) => {
  if (!visible) return null;

  // state
  const [banks, setBanks] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>('');
  const [filtered, setFiltered] = React.useState<any>([]);

  React.useEffect(() => {
    if (!banks.length) {
      getBankList();
    }
  }, [visible]);

  async function getBankList() {
    const { state, data, error } = await useFetch({
      url: GET_BANK,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setBanks(data);
    } else {
      setBanks([]);
    }
  }

  React.useEffect(() => {
    onFilteredBank(search);
  }, [search]);

  function onFilteredBank(key: string) {
    const filtered = banks.filter(
      (item: { namaBank: string; kodeBank: string }) => {
        return item.namaBank.toLowerCase().includes(key.toLowerCase());
      },
    );

    return filtered;
  }

  function onSaveButtonPress(selected: any) {
    value(selected);
    // toggle modal
    toggle();
  }

  return (
    <div
      onClick={dismissOnBackdrop ? toggle : null}
      className="fixed z-50 bg-black bg-opacity-40 top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center"
    >
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-96">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 pt-2 pb-4 mb-4.5">
          <div className=" flex-1">Pilih Bank</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <input
            type="text"
            placeholder="Cari Bank"
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
                  <ListItem className=" text-white">{item?.namaBank}</ListItem>
                </div>
              );
            })}
        </List>
      </div>
    </div>
  );
};

export default BankModal;
