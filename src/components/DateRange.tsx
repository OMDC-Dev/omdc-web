import * as React from 'react';
import { Button } from '@material-tailwind/react';
import moment from 'moment';

export default function DateRange({
  onShowButtonPress,
  periodeStart,
  periodeEnd,
  onResetButtonPress,
}: {
  onShowButtonPress: any;
  periodeStart: any;
  periodeEnd: any;
  onResetButtonPress: any;
}) {
  const formattedDate = (date: any) => {
    if (!date) {
      return '';
    }

    return moment(date).format('DD/MM/YYYY');
  };

  return (
    <div className="flex flex-row gap-x-2 lg:w-1/2">
      <div
        onClick={onShowButtonPress}
        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
      >
        {periodeStart || periodeEnd
          ? `${formattedDate(periodeStart)} - ${formattedDate(periodeEnd)}`
          : 'Pilih Periode'}
      </div>
      <Button color={'blue'} onClick={onResetButtonPress}>
        Reset
      </Button>
    </div>
  );
}
