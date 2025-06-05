import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Dialog } from '@material-tailwind/react';
import TipePembayaranGroup from '../SelectGroup/TipePembayaranGroup';
import React from 'react';
import WorkplanTypeGroup from '../SelectGroup/WorkplanTypeGroup';
import CabangModal from './CabangModal';
import WorkplanTypeStatus from '../SelectGroup/WorkplanTypeStatus';

const WorkplanFilterModal = ({
  visible,
  toggle,
  onApply,
}: {
  visible: boolean;
  toggle: any;
  onApply: any;
}) => {
  const [kategori, setKategori] = React.useState('');
  const [workplanType, setWorkplanType] = React.useState('');
  const [status, setStatus] = React.useState('');

  // cabang
  const [showCabang, setShowCabang] = React.useState(false);
  const [cabang, setCabang] = React.useState<any>();

  let CURRENT_FILTER = `fKategori=${kategori}&fType=${workplanType}&fStatus=${status}&fCabang=${
    cabang?.value ?? ''
  }`;

  if (!visible) return null;

  function onResetFilter() {
    setKategori('');
    setWorkplanType('');
    setStatus('');
    setCabang(null);
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Tambah Filter</div>
          <XMarkIcon
            className=" w-5 h-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <TipePembayaranGroup
              value={kategori}
              setValue={(val: any) => setKategori(val)}
            />
          </div>

          {/* <WorkplanTypeGroup value={workplanType} setValue={setWorkplanType} /> */}

          <div className="w-full">
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                Cabang
              </label>
              <div
                onClick={() => setShowCabang(!showCabang)}
                className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              >
                {cabang?.label || 'Pilih Cabang'}
              </div>
            </div>
          </div>

          {/* <WorkplanTypeStatus value={status} setValue={setStatus} /> */}

          <div className="flex flex-row justify-center mt-4 gap-4">
            <Button
              onClick={() => {
                onApply(CURRENT_FILTER);
                toggle();
              }}
              className="normal-case"
              color={'blue'}
            >
              Terapkan Filter
            </Button>
            <Button
              onClick={onResetFilter}
              className="normal-case"
              variant={'outlined'}
              color={'blue'}
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      <CabangModal
        visible={showCabang}
        toggle={() => setShowCabang(!showCabang)}
        value={(val: any) => setCabang(val)}
      />
    </Dialog>
  );
};

export default WorkplanFilterModal;
