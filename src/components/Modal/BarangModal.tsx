import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';

const BarangModal = ({
  visible,
  toggle,
  value,
  data,
  needLampiran,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
  value?: any;
  data?: any;
  needLampiran?: boolean;
}) => {
  const [stock, setStock] = React.useState<string>();
  const [permintaan, setPermintaan] = React.useState<string>();
  const [keterangan, setKeterangan] = React.useState<string>();
  const [image, setImage] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const buttonDisabledByAkses = needLampiran ? !image : false;

  if (!visible) return null;

  function onSaveButtonPress() {
    // set callback value
    value({
      nm_barang: data?.nm_barang,
      kode_barang: data?.kd_brg,
      requestData: {
        stock: stock,
        request: permintaan,
        keterangan: keterangan || '-',
        attachment: image,
      },
    });

    // clear state
    setStock('');
    setPermintaan('');
    setKeterangan('');

    // toggle modal
    toggle();
  }

  // handle attachment
  function handleAttachment(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 1048576;

    if (file.size > maxSize) {
      alert(
        'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 1 MB.',
      );
      inputRef.current.value = '';
    } else {
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64string: any = reader.result;

        const splitted = base64string?.split(';base64,');

        setImage(splitted[1]);
      };
    }
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
            Jumlah Stock ( {data?.nm_kemasan} )
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
            Jumlah Permintaan ( {data?.nm_kemasan} )
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
        {needLampiran && (
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Lampiran
            </label>
            <input
              type="file"
              className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              accept="image/*"
              onChange={handleAttachment}
              ref={inputRef}
            />
          </div>
        )}
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

export default BarangModal;
