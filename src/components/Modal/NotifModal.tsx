import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';

const NotifModal = ({
  visible,
  toggle,
  data,
}: {
  visible: boolean;
  toggle: any;
  data: any;
}) => {
  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Pengumuman</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div>
          <span className=" text-title-sm font-bold">
            {data?.title || 'Judul'}
          </span>
          <p className=" mt-1">{data?.message || 'pesan'}</p>
          <div className=" text-xs text-blue-gray-400 mt-4">{data?.date}</div>
        </div>
      </div>
    </Dialog>
  );
};

export default NotifModal;
