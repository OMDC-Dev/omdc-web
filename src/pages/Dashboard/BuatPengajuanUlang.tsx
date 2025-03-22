import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import JenisGroup from '../../components/SelectGroup/JenisGroup';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ItemModal from '../../components/Modal/ItemModal';
import {
  Card,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import {
  cekAkses,
  compressImage,
  hitungTotalNominal,
  openInNewTab,
} from '../../common/utils';
import BankModal from '../../components/Modal/BankModal';
import useFetch from '../../hooks/useFetch';
import { GET_BANK_NAME, REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import COAModal from '../../components/Modal/COAModal';
import CabangModal from '../../components/Modal/CabangModal';
import { useAuth } from '../../hooks/useAuth';
import AdminModal from '../../components/Modal/AdminModal';
import Modal from '../../components/Modal/Modal';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalSelector from '../../components/Modal/ModalSelctor';
import SuplierModal from '../../components/Modal/SuplierModal';
import PaymentGroup from '../../components/SelectGroup/PaymentGroup';
import TipePembayaranGroup from '../../components/SelectGroup/TipePembayaranGroup';

// Constant file
import FILE_JENIS_ROP from '../../common/files/type.json';
import FileModal from '../../components/Modal/FileModal';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const BuatPengajuanUlang: React.FC = () => {
  const { show, hide, toggle, visible, type, changeType, changeCode, code } =
    useModal();
  const { user } = useAuth();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const FILE = state?.attachment;
  const FILE_INFO = state?.file_info;
  console.log('EXISTING DATA', state);

  // state
  const [jenis, setJenis] = React.useState<string | undefined>('');
  const [coa, setCoa] = React.useState<string>();
  const [cabang, setCabang] = React.useState<string | any>();
  const [nominal, setNominal] = React.useState<string | number>();
  const [nomorWA, setNomorWA] = React.useState<string>(user?.nomorwa);
  const [desc, setDesc] = React.useState<string>();
  const [name, setName] = React.useState<string>();
  const [result, setResult] = React.useState<any>();
  const [fileInfo, setFileInfo] = React.useState<any>();
  const [selectDate, setSelectDate] = React.useState<Date>();
  const [item, setItem] = React.useState<any>([]);
  const [admin, setAdmin] = React.useState<any>();
  const [suplier, setSuplier] = React.useState<any>();
  const [payment, setPayment] = React.useState<any>();
  const [tipePembayaran, setTipePembayaran] = React.useState<any>('');

  // Bank Modal State
  const [showBank, setShowBank] = React.useState<boolean>(false);
  const [selectedBank, setSelectedBank] = React.useState<any>();
  const [bankRek, setBankRek] = React.useState<string>('');
  const [bankHolder, setBankHolder] = React.useState<string>('');
  const [bankDetail, setBankDetail] = React.useState<any>();
  const [showFile, setShowFile] = React.useState(false);

  // Data Modal Satte
  const [showCoa, setShowCoa] = React.useState<boolean>(false);
  const [showCabang, setShowCabang] = React.useState<boolean>(false);
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);
  const [showItem, setShowItem] = React.useState<boolean>(false);
  const [showSuplier, setShowSuplier] = React.useState<boolean>(false);
  const [useSuplierList, setUseSuplierlist] = React.useState<boolean>(true);
  const [useExtFile, setExtFile] = React.useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);
  const [isFirstSuplier, setIsFirstSuplier] = React.useState(true);

  // Const
  const isNeedName = jenis == 'PR' || jenis == 'CAR' || jenis == 'PC';
  const IS_PRE_BANK =
    suplier?.nm_bank && suplier?.no_rekbank && suplier?.nm_pemilik_rek;

  const hasPaymentRequest = cekAkses('#5');

  // dsabled n=button
  const disabledByType = () => {
    if (isNeedName) {
      return !name;
    }
  };

  const isNeedBank = () => {
    if (jenis !== 'PC' && payment && payment == 'TRANSFER') {
      if (IS_PRE_BANK) {
        return false;
      }
      return !bankRek || !bankHolder;
    }

    if (jenis !== 'PC' && payment && payment == 'VA') {
      return !bankRek;
    }
  };

  const isNeedNewAttachment = () => {
    if (useExtFile) {
      return false;
    }

    return !result;
  };

  const buttonDisabled =
    !jenis ||
    !coa ||
    !cabang ||
    !nominal ||
    !nomorWA ||
    !desc ||
    isNeedNewAttachment() ||
    !selectDate ||
    !admin ||
    !payment ||
    isNeedBank() ||
    !item?.length ||
    !tipePembayaran ||
    disabledByType();

  // handle attachment
  function handleAttachment(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 10485760;

    // handle file type
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (file.size > maxSize) {
      if (file.type.includes('image')) {
        compressImage(file, maxSize, handleAttachment);
        return; // Menghentikan eksekusi lebih lanjut
      } else {
        // Memeriksa apakah ukuran file melebihi batas maksimum (1 MB)
        alert(
          'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 10 MB.',
        );
        event.target.value = null; // Mengosongkan input file
        return;
      }
    }

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64string: any = reader.result;

      const splitted = base64string?.split(';base64,');

      setResult(splitted[1]);
    };

    setFileInfo(fileInfo);
  }

  // handle nominal
  React.useEffect(() => {
    const nominal = hitungTotalNominal(item);

    setNominal(formatRupiah(nominal, true));
  }, [item]);

  // handle existing value
  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
    // handle
    const jenisROP = FILE_JENIS_ROP.find(
      (item) => item.label == state?.jenis_reimbursement,
    )?.value;

    // handle cabang
    const cabangSplit = state?.kode_cabang.split('-');

    // assign
    setJenis(jenisROP);
    setTipePembayaran(state?.tipePembayaran);
    setCoa(state.coa);
    setCabang({
      label: cabangSplit[1].trimStart(),
      value: cabangSplit[0].trimEnd(),
    });
    setAdmin(state?.accepted_by[0]);
    setDesc(state?.description);
    setItem(state?.item);

    // VA
    if (
      state.payment_type == 'TRANSFER' &&
      state.bank_detail.accountname == 'Virtual Account'
    ) {
      setPayment('VA');
      setSelectedBank({
        namaBank: state.bank_detail.bankname,
        kodeBank: state.bank_detail.bankcode,
      });
      setBankRek(state.bank_detail.accountnumber);
      setBankHolder(state.bank_detail.accountname);
    } else {
      setPayment(state.payment_type);
    }

    if (state.jenis_reimbursement == 'Payment Request' && state.kdsp) {
      setSuplier(state.suplierDetail);
      setUseSuplierlist(true);
      setName(`${state.suplierDetail.kdsp} - ${state.suplierDetail.nmsp}`);
    } else {
      setUseSuplierlist(false);
      setName(state.name);
    }

    if (state.bank_detail && state.payment_type == 'TRANSFER') {
      setSelectedBank({
        namaBank: state.bank_detail.bankname,
        kodeBank: state.bank_detail.bankcode,
      });
      setBankRek(state.bank_detail.accountnumber);
      setBankHolder(state.bank_detail.accountname);
    }
  }, []);

  // delete item by ID
  function hapusDataById(id: number) {
    let data = item;
    data = data.filter((item: any) => item.id !== id);

    for (let index = 0; index < data?.length; index++) {
      const element = data[index];
      element.id = index;
    }

    setItem(data);
  }

  async function checkIsPDF() {
    pengajuanReimbursement();
  }

  // Pengajuan
  async function pengajuanReimbursement() {
    changeType('LOADING');
    // formated date
    const formattedDate = moment(selectDate).format('YYYY-MM-DD');

    const paymentType = payment == 'CASH' ? 'CASH' : 'TRANSFER';
    let bankData;

    if (useSuplierList && bankDetail?.bankcode == '000') {
      bankData = bankDetail;
    } else if (payment == 'TRANSFER') {
      bankData = {
        bankcode: selectedBank.kodeBank,
        bankname: selectedBank.namaBank,
        accountnumber: bankRek,
        accountname: bankHolder,
      };
    } else if (payment == 'VA') {
      bankData = {
        bankcode: selectedBank.kodeBank,
        bankname: selectedBank.namaBank,
        accountnumber: bankRek,
        accountname: 'Virtual Account',
      };
    } else {
      bankData = {};
    }

    const body = {
      type: jenis,
      date: formattedDate,
      cabang: cabang?.value,
      description: desc,
      attachment: result,
      bank_detail: bankData,
      nominal: nominal,
      name: name,
      item: item,
      coa: coa,
      file: useExtFile ? FILE_INFO : fileInfo,
      approved_by: admin?.iduser,
      parentId: '',
      payment_type: paymentType,
      tipePembayaran: tipePembayaran,
      uploadedFile: useExtFile ? FILE : null,
      kdsp: suplier?.kdsp || '',
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeCode(data.no_doc);
      changeType('SUCCESSCODE');
    } else {
      changeType('FAILED');
    }
  }

  React.useEffect(() => {
    if (!useSuplierList && suplier && name) {
      setName('');
      setSuplier({});
      setBankDetail({});
      setBankRek('');
      setBankHolder('');
      setSelectedBank({});
    } else {
      if (state?.name) {
        setName(state?.name);
      }

      if (state?.kdsp) {
        setSuplier(state?.suplierDetail);
      }
    }
  }, [useSuplierList]);

  // set name and bank to suplier on payment request
  React.useEffect(() => {
    if (suplier && useSuplierList) {
      setBankDetail({});
      setName(`${suplier?.kdsp} - ${suplier?.nmsp}`);
    }

    if (IS_PRE_BANK) {
      setPayment('TRANSFER');
      setBankDetail({
        bankcode: '000',
        bankname: suplier?.nm_bank,
        accountnumber: suplier?.no_rekbank,
        accountname: suplier?.nm_pemilik_rek,
      });
    } else {
      setBankDetail({});
    }
  }, [suplier]);

  React.useEffect(() => {
    if (!isFirstLoad) {
      setSelectedBank('');
      setPayment('');
      setBankRek('');
      setBankHolder('');
    }
  }, [jenis]);

  React.useEffect(() => {
    console.log(payment, state.payment_type);

    if (payment == state.payment_type) {
      console.log('Pembayaran TRANSFER');

      if (state.payment_type == 'TRANSFER') {
        setSelectedBank({
          namaBank: state.bank_detail.bankname,
          kodeBank: state.bank_detail.bankcode,
        });
        setBankRek(state.bank_detail.accountnumber);
        setBankHolder(state.bank_detail.accountname);
      }
    } else {
      if (payment == 'VA' && state.payment_type == 'TRANSFER') {
        console.log('Pembayaran Ext VA');

        setSelectedBank({
          namaBank: state.bank_detail.bankname,
          kodeBank: state.bank_detail.bankcode,
        });
        setBankRek(state.bank_detail.accountnumber);
        setBankHolder(state.bank_detail.accountname);
      } else {
        setSelectedBank('');
        setBankRek('');
        setBankHolder('');
      }
    }
  }, [payment]);

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Form Pengajuan
              </h3>
            </div>
            <div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <JenisGroup
                      setValue={(val: any) => {
                        setJenis(val);
                        if (!isFirstLoad) {
                          setIsFirstLoad(true);
                        }
                      }}
                      value={jenis}
                    />
                  </div>

                  <div className="w-full">
                    <TipePembayaranGroup
                      value={tipePembayaran}
                      setValue={(val: any) => setTipePembayaran(val)}
                    />
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        COA / Grup Biaya
                      </label>
                      <div
                        onClick={() => setShowCoa(!showCoa)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {coa || 'Pilih COA'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <DatePicker onChange={(date) => setSelectDate(date)} />
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Cabang
                      </label>
                      <div
                        onClick={() => setShowCabang(!showCabang)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {cabang?.label || 'Pilih Cabang'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Approval ke
                      </label>
                      <div
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {admin?.nm_user || 'Pilih Approval'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="Masukan Nomor WA"
                      className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={nomorWA}
                      onChange={(e) => setNomorWA(e.target.value)}
                    />
                  </div>

                  {isNeedName ? (
                    <div className="w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nama Client / Vendor
                      </label>
                      {jenis == 'PR' && hasPaymentRequest ? (
                        <>
                          <Checkbox
                            id="list-on"
                            color={'blue'}
                            label="Pilih dari List"
                            defaultChecked
                            ripple={true}
                            checked={useSuplierList}
                            onChange={(e) =>
                              setUseSuplierlist(e.target.checked)
                            }
                          />
                          {useSuplierList ? (
                            <div
                              onClick={() => setShowSuplier(!showSuplier)}
                              className="w-full mt-3 cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                            >
                              {suplier?.nmsp || name || 'Pilih Suplier'}
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Masukan Nama Client / Vendor"
                              className="w-full mt-3 rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="Masukan Nama Client / Vendor"
                          className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="w-full my-4.5">
                  {IS_PRE_BANK && useSuplierList ? (
                    <>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Jenis Pembayaran
                      </label>
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        Transfer
                      </div>
                    </>
                  ) : (
                    <PaymentGroup
                      jenis={jenis}
                      setValue={(val: any) => {
                        setPayment(val);
                        setBankRek('');
                        setBankHolder('');
                      }}
                      value={payment}
                    />
                  )}
                </div>

                <div className="mb-4.5">
                  <div>
                    <label className=" block text-black dark:text-white">
                      Lampirkan File ( hanya PDF, maks. 10MB )
                    </label>
                    <div className=" my-2">
                      <Checkbox
                        id="file-on"
                        color={'blue'}
                        label="Gunakan lampiran sebelumnya"
                        defaultChecked
                        ripple={true}
                        checked={useExtFile}
                        onChange={(e) => setExtFile(e.target.checked)}
                      />
                    </div>
                    {useExtFile ? (
                      <div className=" flex flex-col gap-4">
                        <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                          {state?.file_info?.name}
                        </div>
                        <Button
                          onClick={(e: any) => {
                            e.preventDefault();
                            state?.file_info?.type !== 'application/pdf'
                              ? setShowFile(!showFile)
                              : openInNewTab(state?.attachment);
                          }}
                        >
                          Lihat Lampiran
                        </Button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                        accept={'.pdf' /*".pdf,image/*"*/}
                        onChange={handleAttachment}
                      />
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Deskripsi
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Masukan Deskripsi"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Sign In Form --> */}
          {jenis !== 'PC' && payment && payment == 'TRANSFER' ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Data Bank
                </h3>
              </div>
              <div>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Bank
                      </label>
                      {IS_PRE_BANK ? (
                        <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                          {suplier?.nm_bank}
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            IS_PRE_BANK ? null : setShowBank(!showBank)
                          }
                          className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                        >
                          {selectedBank?.namaBank || 'Pilih Bank'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nomor Rekening
                    </label>
                    {IS_PRE_BANK ? (
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {suplier?.no_rekbank}
                      </div>
                    ) : (
                      <div className=" flex flex-col xl:flex-row gap-4">
                        <input
                          type="text"
                          disabled={!selectedBank}
                          placeholder="Masukan Nomor Rekening"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={bankRek}
                          onChange={(e) => setBankRek(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nama Pemilik Rekening
                    </label>
                    {IS_PRE_BANK ? (
                      <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {suplier?.nm_pemilik_rek}
                      </div>
                    ) : (
                      <input
                        disabled={!selectedBank}
                        type="text"
                        placeholder="Nama Pemilik Rekening"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={bankHolder}
                        onChange={(e: any) => setBankHolder(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {jenis !== 'PC' && payment && payment == 'VA' ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Data Bank
                </h3>
              </div>
              <div>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Bank
                      </label>
                      <div
                        onClick={() => setShowBank(!showBank)}
                        className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      >
                        {selectedBank?.namaBank || 'Pilih Bank'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nomor VA
                    </label>
                    <div className=" flex flex-col xl:flex-row gap-4">
                      <input
                        disabled={!selectedBank}
                        type="text"
                        placeholder="Masukan Nomor VA"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={bankRek}
                        onChange={(e) => setBankRek(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tipe
                    </label>
                    <input
                      disabled={true}
                      type="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={'Virtual Account'}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* <!-- Sign Up Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Item</h3>
            </div>
            <div>
              <div className="p-6.5">
                {item?.length ? (
                  <div className="mb-4">
                    <Card>
                      <List className="max-h-92 overflow-y-auto py-4.5">
                        {item.map((item: any, index: number) => {
                          return (
                            <ListItem
                              key={item + index}
                              ripple={false}
                              className="py-1 pr-1 pl-4"
                            >
                              {item?.invoice || '-'} - {item?.name}
                              <ListItemSuffix className="flex gap-x-4">
                                {formatRupiah(item.nominal, true)}
                                <IconButton
                                  variant="text"
                                  color="blue-gray"
                                  onClick={() => hapusDataById(item?.id)}
                                >
                                  <TrashIcon />
                                </IconButton>
                              </ListItemSuffix>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Card>
                  </div>
                ) : null}

                <div className="mb-4">
                  <Button
                    mode="outlined"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setShowItem(!showItem);
                    }}
                  >
                    Tambah Item
                  </Button>
                </div>

                <div className="mb-8">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nominal
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={'Rp. 0'}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={nominal}
                  />
                </div>
                <Button
                  onClick={(e: any) => {
                    e.preventDefault();
                    changeType('CONFIRM');
                    show();
                  }}
                  disabled={buttonDisabled}
                >
                  Buat Pengajuan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL CONTAINER */}
      <Modal visible={visible} toggle={toggle} />
      <ItemModal
        visible={showItem}
        toggle={() => setShowItem(!showItem)}
        value={(cb: any) => setItem([...item, { ...cb, id: item?.length + 1 }])}
        includeData={item}
      />
      <BankModal
        visible={showBank}
        toggle={() => setShowBank(!showBank)}
        value={(val: any) => {
          setSelectedBank(val);
          setBankRek('');
          setBankHolder('');
        }}
      />
      <COAModal
        visible={showCoa}
        toggle={() => setShowCoa(!showCoa)}
        value={(val: any) => setCoa(val)}
      />
      <SuplierModal
        visible={showSuplier}
        toggle={() => setShowSuplier(!showSuplier)}
        value={(val: any) => {
          setSuplier(val);
          if (isFirstSuplier) {
            setIsFirstSuplier(false);
          }
        }}
      />
      <CabangModal
        visible={showCabang}
        toggle={() => setShowCabang(!showCabang)}
        value={(val: any) => setCabang(val)}
      />
      <AdminModal
        visible={showAdmin}
        requesterId={user.iduser}
        toggle={() => setShowAdmin(!showAdmin)}
        value={(val: any) => setAdmin(val)}
      />
      <ModalSelector
        code={code}
        type={type}
        visible={visible}
        toggle={toggle}
        onConfirm={() => checkIsPDF()}
        onDone={() => {
          hide();
          type == 'SUCCESSCODE' ? navigate('/', { replace: true }) : null;
        }}
      />
      <FileModal
        type={state?.file_info?.type}
        data={state?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
    </DefaultLayout>
  );
};

export default BuatPengajuanUlang;
