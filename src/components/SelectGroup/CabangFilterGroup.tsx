import React, { useState } from 'react';
import DATAS from '../../common/files/statusROPFilter.json';
import useFetch from '../../hooks/useFetch';
import { GET_CABANG } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const CabangFilterGroup = ({
  value,
  setValue,
  className,
  typeOnly,
  isUser,
}: {
  value: string;
  setValue: any;
  className?: string;
  typeOnly?: boolean;
  isUser?: boolean;
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [list, setList] = useState<any>();

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  let LIST = DATAS;

  if (typeOnly) {
    LIST = DATAS.filter((item: any) => item.value != 'all');
  } else if (isUser) {
  }

  if (!isUser) {
    LIST = DATAS.filter(
      (item: any) => item.value != 'WAITING' && item.value != 'APPROVED',
    );
  }

  React.useEffect(() => {
    getList();
  }, []);

  async function getList() {
    const { state, data, error } = await useFetch({
      url: GET_CABANG,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      const doCabang = data.map((item: any) => {
        return { label: item.nm_induk, value: item?.kd_induk };
      });
      setList(doCabang);
    } else {
      setList([]);
    }
  }

  return (
    <div
      className={`${className} relative z-20 w-full flex items-center rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 outline-none transition focus-within:border-primary dark:border-form-strokedark dark:bg-form-input`}
    >
      <div className="flex-1">
        <select
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            changeTextColor();
          }}
          className={`w-full appearance-none bg-transparent outline-none ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Cabang
          </option>
          {list?.map((item: any, index: number) => (
            <option
              key={index}
              value={`${item.value} - ${item.label}`}
              className="text-body dark:text-bodydark"
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-shrink-0 cursor-pointer">
        {value ? (
          <svg
            onClick={(e) => {
              e.stopPropagation();
              setValue('');
            }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="#637381"
            ></path>
          </svg>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CabangFilterGroup;
