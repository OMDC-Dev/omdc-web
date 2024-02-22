import React from 'react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';

const ListBarangModal = ({
  visible,
  toggle,
  data,
  onDeletePress,
  value,
}: {
  visible: boolean;
  toggle: any;
  data?: any;
  value?: any;
  onDeletePress?: any;
}) => {
  if (!visible) return null;

  // state
  const [list, setList] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    setList(data);
  }, [visible, data]);

  React.useEffect(() => {
    onFiltered(search);
  }, [search]);

  function onFiltered(key: string) {
    const filtered = list.filter(
      (item: { nm_barang: string; value: string }) => {
        return item.nm_barang.toLowerCase().includes(key.toLowerCase());
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
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 pt-2 pb-4 mb-4.5">
          <div className=" flex-1">Barang Ditambahkan</div>
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
          {onFiltered(search) &&
            onFiltered(search).map((item: any, index: number) => {
              return (
                <div onClick={() => onSaveButtonPress(item)}>
                  <ListItem
                    ripple={false}
                    className=" cursor-default hover:bg-black"
                  >
                    <div className=" flex flex-col">
                      <span className=" text-base font-bold text-white mb-2">
                        {item?.nm_barang}
                      </span>
                      <span className=" text-xs text-blue-gray-300">
                        Stock: {item?.requestData?.stock}
                      </span>
                      <span className=" text-xs text-blue-gray-300">
                        Permintaan: {item?.requestData?.request}
                      </span>
                      <span className=" text-xs text-blue-gray-300">
                        Keterangan: {item?.requestData?.keterangan || '-'}
                      </span>
                    </div>
                    <ListItemSuffix className="flex gap-x-4 cursor-pointer">
                      <span
                        onClick={() => onDeletePress(item?.id)}
                        className=" font-bold text-red-500"
                      >
                        Hapus
                      </span>
                    </ListItemSuffix>
                  </ListItem>
                </div>
              );
            })}
        </List>
      </div>
    </Dialog>
  );
};

export default ListBarangModal;
