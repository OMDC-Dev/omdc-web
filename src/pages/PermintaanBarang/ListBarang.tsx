import * as React from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button as MButton,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import {
  CREATE_REQUEST_BARANG,
  GET_BARANG,
  GET_CABANG_DETAIL,
} from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import formatRupiah from '../../common/formatRupiah';
import Button from '../../components/Button';
import BarangModal from '../../components/Modal/BarangModal';
import CabangModal from '../../components/Modal/CabangModal';
import AnakCabangModal from '../../components/Modal/AnakCabangModal';
import ListBarangModal from '../../components/Modal/ListBarangModal';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';

const TABLE_HEAD = [
  'Kode Barang',
  'Nama Barang',
  'Grup Barang',
  'Kategori Barang',
  'Nama Satuan',
  'Harga Barang',
  'Nama Perusahaan',
  'Tanggal Dibuat',
  '',
];

function ListBarang() {
  const [list, setList] = React.useState<any>([]);
  const [keyword, setKeyword] = React.useState<string>();
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);

  // item
  const [cabang, setCabang] = React.useState<any>();
  const [anakCabang, setAnakCabang] = React.useState<any>();
  const [detailCabang, setDetailCabang] = React.useState<any>();
  const [alamat, setAlamat] = React.useState<string>();
  const [barangs, setBarangs] = React.useState<any>([]);
  const [selectedBarang, setSelectedBarang] = React.useState<any>();

  // Modal
  const [barangModal, setBarangModal] = React.useState<boolean>(false);
  const [showCabang, setShowCabang] = React.useState<boolean>(false);
  const [showAnakCabang, setShowAnakCabang] = React.useState<boolean>(false);
  const [showList, setShowList] = React.useState<boolean>(false);

  const { show, hide, toggle, visible, type, changeType } = useModal();

  const navigate = useNavigate();

  React.useEffect(() => {
    getList();
  }, [page]);

  React.useEffect(() => {
    if (anakCabang) {
      getCabangDetail();
    }
  }, [anakCabang]);

  async function getList() {
    setLoading(true);

    const { state, data, error } = await useFetch({
      url: GET_BARANG(keyword) + `&page=${page}&limit=${limit}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.data);
      setPageInfo(data.pageInfo);
      setLoading(false);
    } else {
      setList([]);
      setLoading(false);
    }
  }

  async function getCabangDetail() {
    setLoading(true);

    const { state, data, error } = await useFetch({
      url: GET_CABANG_DETAIL(anakCabang?.value),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setDetailCabang(data);
      const alamat = `${data?.alamat_cabang}\n${data?.kelurahan} - ${data?.kecamatan}\n${data?.kota} - ${data?.provinsi}\n${data?.kd_pos}`;
      setAlamat(alamat);
    } else {
      setDetailCabang({});
    }
  }

  async function createRequest() {
    changeType('LOADING');
    const body = {
      kodeIndukCabang: cabang?.value,
      kodeAnakCabang: anakCabang?.value,
      barang: barangs,
    };

    const { state, data, error } = await useFetch({
      url: CREATE_REQUEST_BARANG,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  // delete item by ID
  function hapusDataById(id: number) {
    let datas = barangs;
    datas = datas.filter((item: any) => item.id !== id);

    for (let index = 0; index < datas.length; index++) {
      const element = datas[index];
      element.id = index;
    }

    setBarangs(datas);
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9">
        <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Data Permintaan Barang
            </h3>
          </div>
          <div className="flex flex-col gap-6 p-4.5">
            <div className="w-full">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Cabang
                </label>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCabang(!showCabang);
                  }}
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                >
                  {cabang?.label || 'Pilih Cabang'}
                </div>
              </div>
            </div>

            {cabang ? (
              <div className="w-full">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Kirim ke
                  </label>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAnakCabang(!showAnakCabang);
                    }}
                    className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  >
                    {anakCabang?.label || 'Pilih Cabang'}
                  </div>
                </div>
              </div>
            ) : null}
            {alamat ? (
              <div className="w-full">
                <label className="mb-3 block text-black dark:text-white">
                  Alamat Pengiriman
                </label>
                <textarea
                  rows={5}
                  disabled
                  placeholder="Masukan Keterangan"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={alamat}
                ></textarea>
              </div>
            ) : null}
          </div>
        </div>

        <Card className="h-full w-full bg-boxdark">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex items-center justify-between gap-8 bg-boxdark">
              <div>
                <Typography variant="h5" color="white">
                  Daftar Barang
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Cari barang untuk mulai menambahkan barang
                </Typography>
              </div>
            </div>
            <div className="w-full bg-boxdark">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  getList();
                }}
              >
                <input
                  type="text"
                  placeholder="Cari barang..."
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 mt-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
              </form>
            </div>
            <div className="w-full bg-boxdark flex pt-4 gap-x-4">
              <div
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowList(!showList);
                }}
                className="w-full cursor-pointer rounded-md border-[1.5px] border-teal-700 bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white "
              >
                {barangs.length} barang ditambahkan
              </div>

              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  changeType('CONFIRM');
                  show();
                }}
                disabled={!barangs?.length || !cabang || !anakCabang}
              >
                Buat Permintaan Barang
              </Button>
            </div>
          </CardHeader>
          {!list.length ? (
            <CardBody>
              <div className=" h-96 flex justify-center items-center text-white font-semibold text-sm text-center">
                {keyword
                  ? 'Tidak ditemukan barang yang sesuai, mohon periksa kembali!'
                  : 'Mulai cari untuk memunculkan list barang'}
              </div>
            </CardBody>
          ) : (
            <>
              <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          className="border-y border-blue-gray-800 bg-strokedark p-4"
                        >
                          <Typography
                            variant="small"
                            className="font-normal leading-none opacity-70 text-whiten"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item: any, index: number) => {
                      const isLast = index === list.length - 1;
                      const classes = isLast
                        ? 'p-4'
                        : 'p-4 border-b border-blue-gray-800';

                      return (
                        <tr key={item?.kd_brg}>
                          <td className={classes}>
                            <div className="flex items-center gap-3 ">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  className="font-normal"
                                >
                                  {item?.kd_brg}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.nm_barang}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Typography
                                variant="small"
                                className="font-normal "
                              >
                                {item?.grup_brg}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.kategory_brg}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.nm_kemasan}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {formatRupiah(item?.hrga_satuan, true)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.nm_comp}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {item?.tgl_create || '-'}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Tambah Barang">
                              <IconButton
                                variant="text"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedBarang(item);
                                  setBarangModal(!barangModal);
                                }}
                              >
                                <DocumentPlusIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="white"
                  className="font-normal"
                >
                  Halaman {page} dari {pageInfo.pageCount}
                </Typography>
                <div className="flex gap-2">
                  <MButton
                    disabled={page < 2 || loading}
                    variant="outlined"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page - 1);
                    }}
                  >
                    Previous
                  </MButton>
                  <MButton
                    disabled={page == pageInfo.pageCount || loading}
                    variant="outlined"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    Next
                  </MButton>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
        <BarangModal
          data={selectedBarang}
          visible={barangModal}
          toggle={() => setBarangModal(!barangModal)}
          value={(val: any) =>
            setBarangs([...barangs, { ...val, id: barangs + 1 }])
          }
        />
        <CabangModal
          visible={showCabang}
          toggle={() => setShowCabang(!showCabang)}
          value={(val: any) => setCabang(val)}
        />
        <AnakCabangModal
          visible={showAnakCabang}
          kodeInduk={cabang?.value}
          toggle={() => setShowAnakCabang(!showAnakCabang)}
          value={(val: any) => setAnakCabang(val)}
        />
        <ListBarangModal
          data={barangs}
          visible={showList}
          toggle={() => setShowList(!showList)}
          onDeletePress={(id: any) => hapusDataById(id)}
        />
        <ModalSelector
          type={type}
          visible={visible}
          toggle={toggle}
          onConfirm={() => createRequest()}
          onDone={() => navigate('/request-barang')}
        />
      </div>
    </DefaultLayout>
  );
}

export default ListBarang;
