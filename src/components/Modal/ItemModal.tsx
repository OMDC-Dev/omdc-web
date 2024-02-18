import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ItemModal = ({
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
  const [name, setName] = React.useState<string>('');
  const [nominal, setNominal] = React.useState<string>('');

  if (!visible) return null;

  function onSaveButtonPress() {
    // set callback value
    value({
      name: name,
      nominal: nominal,
    });

    // clear state
    setName('');
    setNominal('');

    // toggle modal
    toggle();
  }

  return (
    <div
      onClick={dismissOnBackdrop ? toggle : null}
      className="fixed z-50 bg-black bg-opacity-40 top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center"
    >
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-72">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Tambah Item</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nama Item
          </label>
          <input
            type="text"
            placeholder="Masukan Nama Item"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nominal
          </label>
          <input
            type="number"
            placeholder="Masukan Nominal"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
          />
        </div>
        <Button
          disabled={!name || !nominal}
          onClick={() => onSaveButtonPress()}
        >
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default ItemModal;
