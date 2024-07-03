import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import useFetch from '../../hooks/useFetch';
import { CEK_INVOICE } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const ItemModal = ({
  visible,
  toggle,
  dismissOnBackdrop,
  value,
  includeData,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  value?: any;
  includeData: any;
}) => {
  const [name, setName] = React.useState<string>('');
  const [nominal, setNominal] = React.useState<string>('');
  const [invoice, setInvoice] = React.useState<string>('');

  const [invoiceError, setInvoiceError] = React.useState<string>('');

  if (!visible) return null;

  async function checkInvoice() {
    const findExt = includeData.find((item: any) => item.invoice == invoice);

    if (findExt) {
      setInvoiceError('No. Invoice telah digunakan');
      return;
    }

    const { state, data, error } = await useFetch({
      url: CEK_INVOICE(invoice),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      onSaveButtonPress();
    } else {
      setInvoiceError(error);
    }
  }

  function onSaveButtonPress() {
    // set callback value
    value({
      name: name,
      nominal: nominal,
      invoice: invoice,
    });

    // clear state
    setName('');
    setNominal('');
    setInvoice('');

    // toggle modal
    toggle();
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Tambah Item</div>
          <XMarkIcon
            className=" w-5 h-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              toggle();
              setName('');
              setNominal('');
              setInvoice('');
            }}
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            No. Invoice / Bukti
          </label>
          <input
            type="text"
            placeholder="Masukan Nomor Invoice"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={invoice}
            onChange={(e) => {
              setInvoice(e.target.value);
              setInvoiceError('');
            }}
          />
          {invoiceError && (
            <p className={' text-red-500 text-sm mt-2'}>{invoiceError}</p>
          )}
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
          disabled={!name || !nominal || !invoice || invoiceError?.length > 1}
          onClick={() => checkInvoice()}
        >
          Simpan
        </Button>
      </div>
    </Dialog>
  );
};

export default ItemModal;
