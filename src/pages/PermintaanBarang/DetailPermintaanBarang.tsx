import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import useModal from '../../hooks/useModal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import useFetch from '../../hooks/useFetch';
import { DETAIL_REQUEST_BARANG, REIMBURSEMENT_DETAIL } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { Card, Chip, List, ListItem } from '@material-tailwind/react';
import moment from 'moment';

const DetailPermintaanBarang: React.FC = () => {
  const { toggle, visible, hide, show } = useModal();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // data state
  const [data, setData] = React.useState<any>([]);
  const [barang, setBarang] = React.useState<any>([]);

  const state = location.state;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    } else {
      setData(state);
      getDetails(id);
    }
  }, []);

  async function getDetails(id: any) {
    show();
    const { state, data, error } = await useFetch({
      url: DETAIL_REQUEST_BARANG(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setBarang(data);
    } else {
      hide();
    }
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className=" sm:hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Pengajuan
              </h3>
              <Chip
                variant={'outlined'}
                color={'light-blue'}
                value={data?.status_pb || 'Menunggu'}
              />
            </div>
            <div className=" p-6.5 flex flex-col gap-y-6">
              <div className=" w-full flex justify-between">
                <label className="mb-3 block text-black dark:text-white">
                  Status Approval
                </label>
                <span className=" text-white font-bold">
                  {data?.status_approve || 'Menunggu'}
                </span>
              </div>
              <div className=" w-full flex justify-between">
                <label className="mb-3 block text-black dark:text-white">
                  Tanggal Persetujuan
                </label>
                <span className=" text-white font-bold">
                  {data?.tgl_approve || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Data Permintaan
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      ID Permintaan Barang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.id_pb}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nama Induk Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.nm_induk}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nama Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.nm_cabang}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Alamat Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.alamat}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Waktu Pengajuan
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {moment(data?.tgl_trans).format('ll')} {data?.jam_trans}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="hidden sm:block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Pengajuan
              </h3>
              <Chip
                variant={'outlined'}
                color={'light-blue'}
                value={data?.status_pb || 'Menunggu'}
              />
            </div>
            <div className=" p-6.5 flex flex-col gap-y-6">
              <div className=" w-full flex justify-between">
                <label className="mb-3 block text-black dark:text-white">
                  Status Approval
                </label>
                <span className=" text-white font-bold">
                  {data?.status_approve || 'Menunggu'}
                </span>
              </div>
              <div className=" w-full flex justify-between">
                <label className="mb-3 block text-black dark:text-white">
                  Tanggal Persetujuan
                </label>
                <span className=" text-white font-bold">
                  {data?.tgl_approve || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Barang
              </h3>
            </div>
            <div className=" p-6.5 flex flex-col gap-y-6">
              <div className=" w-full">
                <List>
                  {barang?.map((item: any, index: number) => {
                    return (
                      <ListItem
                        key={item + index}
                        ripple={false}
                        className="py-2 pr-1 pl-4 bg-form-input hover:bg-black"
                      >
                        <div className=" flex flex-col">
                          <span className=" text-base font-bold text-white mb-2">
                            {item?.nm_barang}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Stock: {item?.jml_kemasan} {item?.nm_kemasan}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Permintaan: {item?.qty_stock} {item?.nm_kemasan}
                          </span>
                          <span className=" text-xs text-blue-gray-300">
                            Keterangan: {item?.requestData?.keterangan || '-'}
                          </span>
                          <span className=" mt-4 text-xs text-blue-gray-300">
                            Status Approve: {item?.status_approve || '-'}
                          </span>
                          <span className="text-xs text-blue-gray-300">
                            Tanggal Approve: {item?.tgl_approve || '-'}
                          </span>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DetailPermintaanBarang;
