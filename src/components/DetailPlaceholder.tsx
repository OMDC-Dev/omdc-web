import { forwardRef } from 'react';

export const DetailPlaceholder = forwardRef<
  HTMLInputElement,
  {
    value?: any;
    label: string;
    isTextArea?: boolean;
    isRow?: boolean;
    rowChildren?: any;
    children?: any;
  }
>(({ value, label, isTextArea, isRow, rowChildren, children }, ref) => {
  return (
    <div className="w-full">
      <label className="mb-3 block text-black dark:text-white">{label}</label>
      <div className={isRow ? 'flex flex-row gap-2.5' : ''}>
        <div
          className={`w-full ${
            isTextArea ? 'h-[100px] overflow-y-auto' : ''
          } rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white`}
        >
          {value}
        </div>
        {rowChildren}
      </div>
      <input ref={ref} type="text" className="hidden" />
      {children}
    </div>
  );
});
