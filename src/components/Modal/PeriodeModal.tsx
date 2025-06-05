import React from 'react';
import Button from '../Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';

const PeriodeModal = ({
  visible,
  toggle,
  value,
  startDate,
  endDate,
}: {
  visible: boolean;
  toggle: any;
  value?: any;
  startDate?: any;
  endDate?: any;
}) => {
  const [dateRange, setDateRange] = React.useState<any>([
    {
      startDate: startDate,
      endDate: endDate,
      key: 'selection',
    },
  ]);

  if (!visible) return null;

  function onSaveButtonPress() {
    // set callback value
    value({
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    });

    // clear state
    setDateRange([
      {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
      },
    ]);

    // toggle modal
    toggle();
  }

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Atur Periode</div>
          <XMarkIcon
            className=" w-5 h-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              toggle();
              setDateRange([
                {
                  startDate: startDate,
                  endDate: endDate,
                  key: 'selection',
                },
              ]);
            }}
          />
        </div>
        <div className="flex justify-center items-center my-8">
          <DateRange
            editableDateInputs={true}
            onChange={(item: any) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
        </div>
        <Button onClick={onSaveButtonPress}>Simpan</Button>
      </div>
    </Dialog>
  );
};

export default PeriodeModal;
