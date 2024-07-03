import React, { useState } from 'react';

const TYPE_DATA = [
  {
    label: 'Admin',
    value: 'ADMIN',
  },
  {
    label: 'Finance',
    value: 'FINANCE',
  },
  {
    label: 'Reviewer',
    value: 'REVIEWER',
  },
  {
    label: 'Maker',
    value: 'MAKER',
  },
];

const TypeGroup = ({ value, onChange }: { value: any; onChange?: any }) => {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
        Tipe Akun
      </label>

      <div className="relative z-20">
        <select
          value={value}
          onChange={onChange}
          className={`relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Pilih tipe
          </option>
          {TYPE_DATA.map((item, index) => {
            return (
              <option
                value={item.value}
                className="text-body dark:text-bodydark"
              >
                {item.label}
              </option>
            );
          })}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default TypeGroup;
