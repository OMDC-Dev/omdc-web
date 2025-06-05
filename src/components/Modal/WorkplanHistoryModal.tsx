import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';
import { getFormattedDateTable } from '../../common/utils';

const WorkplanHistoryModal = ({
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
      <div className="rounded-lg border border-stroke bg-white shadow-default p-4 w-full max-h-[calc(100vh-4rem)] flex flex-col">
        {' '}
        {/* Use flex and column direction */}
        <div className="flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className="flex-1">Riwayat Perubahan Tanggal Selesai</div>
          <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        {/* Make the following div take remaining space and allow overflow */}
        <div className="flex-1 flex flex-col gap-2.5 overflow-auto">
          {data?.map((item: any) => {
            return (
              <div className="flex flex-row items-center gap-2.5">
                <div className="font-semibold tetx-sm text-black-2">
                  {item.date}
                </div>
                <div>
                  {' '}
                  -- diubah pada tanggal{' '}
                  {getFormattedDateTable(item.createdAt, 'LLL')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};

export default WorkplanHistoryModal;
