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
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import GrupModal from '../../components/Modal/GrupModal';
import KategoryModal from '../../components/Modal/KategoryModal';
import SuplierModal from '../../components/Modal/SuplierModal';
import KemasanModal from '../../components/Modal/KemasanModal';
import SatuanModal from '../../components/Modal/SatuanModal';
import formatRupiah from '../../common/formatRupiah';
import Button from '../../components/Button';
import { generateRandomNumber } from '../../common/utils';
import { CEK_BARKODE_BARANG, CREATE_BARANG } from '../../api/routes';
import ModalSelector from '../../components/Modal/ModalSelctor';
import PickListGroup from '../../components/SelectGroup/PickListGrup';

function ListMasterBarangInput() {
  const { show, hide, toggle, visible, type, changeType } = useModal();

  // Input State
  const [kodeBarang, setKodeBarang] = React.useState<any>();
  const [barcodeBarang, setBarcodeBarang] = React.useState<string>('');
  const [namaBarang, setNamaBarang] = React.useState<string>();
  const [qtyBarang, setQtyBarang] = React.useState<string>('');
  const [hargaSatuan, setHargaSatuan] = React.useState<string>('');
  const [hargaKemasan, setHargaKemasan] = React.useState<string>('');
  const [hppSatuan, setHPPSatuan] = React.useState<string>('');
  const [hppKemasan, setHPPKemasan] = React.useState<string>('');
  const [hargaJualSatuan, setHargaJualSatuan] = React.useState<string>('');
  const [hargaJualKemasan, setHargaJualKemasan] = React.useState<string>('');

  // Modal state
  const [grupModal, setGrupModal] = React.useState(false);
  const [kategoryModal, setKategoryModal] = React.useState(false);
  const [suplierModal, setSuplierModal] = React.useState(false);
  const [kemasanModal, setKemasanModal] = React.useState(false);
  const [satuanModal, setSatuanModal] = React.useState(false);

  // Modal Selected Value
  const [grup, setGrup] = React.useState<string>();
  const [kategory, setKategory] = React.useState<string>();
  const [suplier, setSuplier] = React.useState<any>();
  const [kemasan, setKemasan] = React.useState<string>();
  const [satuan, setSatuan] = React.useState<string>();

  // Other
  const [status, setStatus] = React.useState<any>('AKTIF');
  const [barcodeAva, setBarcodeAva] = React.useState(false);
  const [barcodeLoading, setBarcodeLoading] = React.useState(false);
  const [barcodeError, setBarcodeError] = React.useState<string>();

  // constant
  const BUTTON_DISABLED =
    !barcodeAva ||
    !barcodeBarang ||
    !namaBarang ||
    !qtyBarang ||
    !hargaSatuan ||
    !hppSatuan ||
    !hargaJualSatuan ||
    !grup ||
    !kategory ||
    !kemasan ||
    !satuan ||
    !status;

  const navigate = useNavigate();

  // [Calculation] ===
  React.useEffect(() => {
    if (hargaSatuan !== '0' && qtyBarang !== '0') {
      const calc = Number(hargaSatuan) * Number(qtyBarang);
      setHargaKemasan(String(calc));
    }
  }, [hargaSatuan, qtyBarang]);

  React.useEffect(() => {
    if (hppSatuan !== '0' && qtyBarang !== '0') {
      const calc = Number(hppSatuan) * Number(qtyBarang);
      setHPPKemasan(String(calc));
    }
  }, [hppSatuan, qtyBarang]);

  React.useEffect(() => {
    if (hargaJualSatuan !== '0' && qtyBarang !== '0') {
      const calc = Number(hargaJualSatuan) * Number(qtyBarang);
      setHargaJualKemasan(String(calc));
    }
  }, [hargaJualSatuan, qtyBarang]);
  // [END] ===========

  // [Initial State] ===
  React.useEffect(() => {
    const genID = generateRandomNumber(100000, 999999);
    setKodeBarang(genID);
    setBarcodeBarang(String(genID));
    setBarcodeAva(true);
  }, []);
  // ===================

  // [Fetch Api] ====
  async function checkBarcodeAva() {
    setBarcodeLoading(true);
    const { state, data, error } = await useFetch({
      url: CEK_BARKODE_BARANG(barcodeBarang),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setBarcodeError('');
      setBarcodeLoading(false);
      setBarcodeAva(true);
    } else {
      setBarcodeError(error);
      setBarcodeLoading(false);
      setBarcodeAva(false);
    }
  }

  async function onSaveBarang() {
    changeType('LOADING');
    const body = {
      kd_brg: kodeBarang,
      barcode_brg: barcodeBarang,
      nama_brg: namaBarang,
      grup_brg: grup,
      kategory_brg: kategory,
      suplier: suplier?.kdsp || null,
      kemasan: kemasan,
      satuan: satuan,
      qty_isi: qtyBarang,
      harga_satuan: hargaSatuan,
      hpp_satuan: hppSatuan,
      hargajual_satuan: hargaJualSatuan,
      status: status,
    };

    const { state, data, error } = await useFetch({
      url: CREATE_BARANG,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  // ================

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" flex flex-col">
          <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Form Barang
              </h3>
            </div>

            <div className="flex flex-col gap-6 p-4.5">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Kode Barang
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={kodeBarang}
                  onChange={(e) => setKodeBarang(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Barcode Barang
                </label>
                <div className="flex flex-col md:flex md:flex-row gap-4">
                  <input
                    type={'number'}
                    placeholder="Barcode Barang"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={barcodeBarang}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 6) {
                        setBarcodeAva(false);
                        setBarcodeBarang(value);
                      }
                    }}
                  />
                  <Button
                    disabled={barcodeAva || !barcodeBarang || barcodeLoading}
                    isLoading={barcodeLoading}
                    onClick={(e: any) => {
                      e.preventDefault();
                      checkBarcodeAva();
                    }}
                  >
                    {barcodeAva ? 'Tersedia' : 'Cek Barcode'}
                  </Button>
                </div>
                {barcodeError && (
                  <p className=" text-sm text-red-500 mt-2">{barcodeError}</p>
                )}
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama Barang
                </label>
                <input
                  type={'text'}
                  placeholder="Nama Barang"
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Grup Barang
                </label>
                <div
                  placeholder="Pilih Grup Barang"
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setGrupModal(true);
                  }}
                >
                  {grup || 'Pilih Grup'}
                </div>
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Kategori Barang
                </label>
                <div
                  placeholder="Pilih Kategori Barang"
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setKategoryModal(true);
                  }}
                >
                  {kategory || 'Pilih Kategori'}
                </div>
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Suplier Barang ( Opsional )
                </label>
                <div className="relative w-full">
                  <div
                    placeholder="Pilih Suplier Barang"
                    className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSuplierModal(true);
                    }}
                  >
                    {suplier?.nmsp || 'Pilih Suplier'}
                  </div>
                  {suplier?.nmsp && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSuplier(null);
                      }}
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      Reset Suplier
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Kemasan Barang
                </label>
                <div
                  placeholder="Pilih Kemasan Barang"
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setKemasanModal(true);
                  }}
                >
                  {kemasan || 'Pilih Kemasan'}
                </div>
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Satuan Barang
                </label>
                <div
                  placeholder="Pilih Satuan Barang"
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSatuanModal(true);
                  }}
                >
                  {satuan || 'Pilih Satuan'}
                </div>
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Qty Isi Kemasan
                </label>
                <input
                  type={'number'}
                  placeholder="Qty Isi Kemasan"
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={qtyBarang}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Memastikan tidak dimulai dengan 0 dan panjang maksimal 10 digit
                    if (/^[1-9]\d{0,9}$/.test(value) || value === '') {
                      setQtyBarang(value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col">
          <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Harga Barang
              </h3>
            </div>

            <div className="flex flex-col gap-6 p-4.5">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Harga Satuan
                </label>
                <input
                  type={'number'}
                  placeholder="Masukan Harga Satuan"
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={hargaSatuan}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Memastikan tidak dimulai dengan 0 dan panjang maksimal 10 digit
                    if (/^[1-9]\d{0,9}$/.test(value) || value === '') {
                      setHargaSatuan(value);
                    }
                  }}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Harga Kemasan
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formatRupiah(hargaKemasan, true)}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  HPP Satuan
                </label>
                <input
                  type={'number'}
                  placeholder="Masukan HPP Satuan"
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={hppSatuan}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Memastikan tidak dimulai dengan 0 dan panjang maksimal 10 digit
                    if (/^[1-9]\d{0,9}$/.test(value) || value === '') {
                      setHPPSatuan(value);
                    }
                  }}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  HPP Kemasan
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formatRupiah(hppKemasan, true)}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Harga Jual Satuan
                </label>
                <input
                  type={'number'}
                  placeholder="Masukan Harga Jual Satuan"
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={hargaJualSatuan}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Memastikan tidak dimulai dengan 0 dan panjang maksimal 10 digit
                    if (/^[1-9]\d{0,9}$/.test(value) || value === '') {
                      setHargaJualSatuan(value);
                    }
                  }}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Harga Jual Kemasan
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formatRupiah(hargaJualSatuan, true)}
                />
              </div>

              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Status Barang
                </label>
                <PickListGroup
                  className={' left-0'}
                  setValue={setStatus}
                  value={status}
                />
              </div>

              <div className="w-full">
                <Button
                  disabled={BUTTON_DISABLED}
                  onClick={(e: any) => {
                    e.preventDefault();
                    changeType('CONFIRM');
                    show();
                  }}
                >
                  Simpan Barang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GrupModal
        visible={grupModal}
        toggle={() => setGrupModal(false)}
        value={(val: any) => setGrup(val.value)}
      />
      <KategoryModal
        visible={kategoryModal}
        toggle={() => setKategoryModal(false)}
        value={(val: any) => setKategory(val.value)}
      />
      <SuplierModal
        visible={suplierModal}
        toggle={() => setSuplierModal(false)}
        value={(val: any) => setSuplier(val)}
      />
      <KemasanModal
        visible={kemasanModal}
        toggle={() => setKemasanModal(false)}
        value={(val: any) => setKemasan(val.value)}
      />
      <SatuanModal
        visible={satuanModal}
        toggle={() => setSatuanModal(false)}
        value={(val: any) => setSatuan(val.value)}
      />
      <ModalSelector
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => onSaveBarang()}
        onDone={() => {
          hide();
          type == 'SUCCESS'
            ? navigate('/master-barang', { replace: true })
            : null;
        }}
      />
    </DefaultLayout>
  );
}

export default ListMasterBarangInput;
