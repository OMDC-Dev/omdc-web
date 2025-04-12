import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Dialog } from '@material-tailwind/react';
import DatePicker from '../Forms/DatePicker/DatePicker';
import React from 'react';
import { hitungSelisihHari } from '../../common/utils';
import moment from 'moment';

const WorkplanReortRangeModal = ({
  visible,
  toggle,
  onApply,
}: {
  visible: boolean;
  toggle: any;
  onApply: any;
}) => {
  const [startDate, setStartDate] = React.useState<any>();
  const [endDate, setEndDate] = React.useState<any>();
  const [isLoad, setIsLoad] = React.useState(true);

  function checkInput() {
    const diff = hitungSelisihHari(startDate, endDate);

    if (diff < 0) {
      alert('Periode tidak boleh memiliki selisih kurang dari 0 hari.');
      return;
    }

    const _startDate = moment(startDate, true)
      .startOf('day')
      .format('DD-MM-YYYY');
    const _endDate = moment(endDate, true).endOf('day').format('DD-MM-YYYY');

    onApply ? onApply({ start: _startDate, end: _endDate }) : null;
    toggle();
  }

  React.useEffect(() => {
    setIsLoad(true);
    setStartDate(null);
    setEndDate(null);

    if (visible) {
      setTimeout(() => {
        setIsLoad(false);
      }, 500);
    }
  }, [visible]);

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Download Report</div>
          <XMarkIcon
            className=" w-5 h-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          {!isLoad && (
            <div className="w-full flex flex-col gap-6.5 lg:flex-row">
              <div className="w-full">
                <DatePicker
                  title="Tanggal Mulai ( Tanggal Pembuatan )"
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div className="w-full">
                <DatePicker
                  title="Tanggal Selesai ( Tanggal Pembuatan )"
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6.5">
            <Button
              onClick={() => {
                checkInput();
              }}
              disabled={!startDate || !endDate}
              className="normal-case"
              color={'blue'}
            >
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WorkplanReortRangeModal;
