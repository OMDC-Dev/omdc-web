import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';

const BarangEditModal = ({
  visible,
  toggle,
  value,
  data,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  value?: any;
  data?: any;
}) => {
  const strStock = parseInt(data?.qty_stock).toString();
  const strPermintaan = parseInt(data?.jml_kemasan).toString();

  const [stock, setStock] = React.useState<string>(strStock);
  const [permintaan, setPermintaan] = React.useState<string>(strPermintaan);

  console.log('SELECTED', strStock);

  if (!visible) return null;

  function onSaveButtonPress() {
    // set callback value
    value({
      id_trans: data?.id_trans,
      stock: stock,
      request: permintaan,
    });

    // clear state
    setStock('');
    setPermintaan('');

    // toggle modal
    toggle();
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Edit Barang</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Jumlah Stock ( {data?.nm_kemasan} )
          </label>
          <input
            type="number"
            placeholder="Masukan Stock"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={stock}
            defaultValue={strStock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Jumlah Permintaan ( {data?.nm_kemasan} )
          </label>
          <input
            type="number"
            placeholder="Masukan Permintaan"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={permintaan}
            defaultValue={strPermintaan}
            onChange={(e) => setPermintaan(e.target.value)}
          />
        </div>

        <Button
          disabled={!stock || !permintaan || Number(permintaan) < 1}
          onClick={() => onSaveButtonPress()}
        >
          Simpan
        </Button>
      </div>
    </Dialog>
  );
};

export default BarangEditModal;
