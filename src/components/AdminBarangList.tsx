import { Button, ListItem } from '@material-tailwind/react';
import React from 'react';

export default function AdminBarangList({
  item,
  index,
  selected,
  onShowLampiran,
  onEdit,
  onReject,
  onPress,
}: {
  item: any;
  index: number;
  selected: any;
  onShowLampiran: any;
  onEdit: any;
  onReject: any;
  onPress: any;
}) {
  // status pb
  const statusPB = item?.status_pb?.toLowerCase();
  let statusTextColor = '';

  if (statusPB == 'dibatalkan') {
    statusTextColor = 'text-red-500';
  } else if (statusPB == 'diproses') {
    statusTextColor = 'text-blue-500';
  } else if (statusPB == 'diterima') {
    statusTextColor = 'text-green-500';
  }

  return (
    <ListItem
      onClick={(e) => {
        e.preventDefault();
        onPress();
      }}
      key={item + index}
      ripple={false}
      className="py-2 pr-1 px-4"
    >
      <div className=" flex flex-col w-full">
        <span className=" text-base font-bold text-black mb-2">
          {item?.nm_barang}
        </span>
        <span className=" text-xs text-blue-gray-300">
          Stock: {item?.qty_stock} {item?.nm_kemasan}
        </span>
        <span className=" text-xs text-blue-gray-300">
          Permintaan: {item?.jml_kemasan} {item?.nm_kemasan}
        </span>
        <span className=" text-xs text-blue-gray-300">
          Keterangan: {item?.requestData?.keterangan || '-'}
        </span>
        <span className=" mt-4 text-xs text-blue-gray-300">
          Status Approve:{' '}
          <span className={statusTextColor}>{item?.status_pb || '-'}</span>
        </span>
        <Button
          className=" mt-4"
          size={'sm'}
          variant={'outlined'}
          fullWidth
          color={'blue'}
          onClick={(e) => {
            e.preventDefault();
            onShowLampiran(item);
            // setSelectedFile(item);
            // setShowFile(!showFile);
          }}
        >
          Lihat lampiran
        </Button>
        {item?.status_pb == 'Menunggu Disetujui' &&
          selected?.id_trans == item?.id_trans && (
            <div className=" gap-y-2 flex flex-col lg:flex lg:flex-row mt-2 gap-x-2">
              <Button
                size={'sm'}
                variant={'filled'}
                fullWidth
                color={'blue'}
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(item);
                  // setSelectedBarang(item);
                  // setShowEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                size={'sm'}
                variant={'outlined'}
                fullWidth
                color={'red'}
                onClick={(e) => {
                  e.preventDefault();
                  onReject(item);
                  // changeContext('REJBRG');
                  // changeType('CONFIRM');
                  // setSelectedBarang(item);
                  // show();
                }}
              >
                Tolak
              </Button>
            </div>
          )}
      </div>
    </ListItem>
  );
}
