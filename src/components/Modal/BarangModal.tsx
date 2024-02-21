import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';

const BarangModal = ({
  visible,
  toggle,
  value,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  value?: any;
}) => {
  const [stock, setStock] = React.useState<string>();
  const [permintaan, setPermintaan] = React.useState<string>();
  const [keterangan, setKeterangan] = React.useState<string>();

  if (!visible) return null;

  function onSaveButtonPress() {
    // set callback value
    value({ stock, permintaan, keterangan });

    // clear state
    setStock('');
    setPermintaan('');
    setKeterangan('');

    // toggle modal
    toggle();
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Tambah Barang</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Jumlah Stock ( PCS )
          </label>
          <input
            type="number"
            placeholder="Masukan Stock"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Jumlah Permintaan ( PCS )
          </label>
          <input
            type="number"
            placeholder="Masukan Permintaan"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={permintaan}
            onChange={(e) => setPermintaan(e.target.value)}
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Keterangan
          </label>
          <textarea
            rows={2}
            placeholder="Masukan Keterangan"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          ></textarea>
        </div>
        <Button
          disabled={!stock || !permintaan}
          onClick={() => onSaveButtonPress()}
        >
          Simpan
        </Button>
      </div>
    </Dialog>
  );
};

export default BarangModal;
