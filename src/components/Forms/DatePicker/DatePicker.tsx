import flatpickr from 'flatpickr';
import React, { useEffect } from 'react';

const DatePicker = ({
  onChange,
  title,
  id,
}: {
  onChange: (arg0: Date) => void;
  title?: string;
  id?: string;
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Init flatpickr
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: 'single',
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'Y-m-d',
        onChange: (date) => {
          setSelectedDate(date[0]);
        },
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      });
    }
  }, []);

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {title || 'Pilih Tanggal'}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          className="form-datepicker w-full rounded-md border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          placeholder="mm/dd/yyyy"
          data-class="flatpickr-right"
        />
      </div>
    </div>
  );
};

export default DatePicker;
