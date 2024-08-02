import * as React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import { useAuth } from '../../hooks/useAuth';
import CabangModal from '../../components/Modal/CabangModal';
import BankModal from '../../components/Modal/BankModal';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import ModalSelector from '../../components/Modal/ModalSelctor';
import {
  formatAmount,
  formatCurrencyToNumber,
  hitungSelisihHari,
} from '../../common/utils';
import useFetch from '../../hooks/useFetch';
import { SUPERUSER_REPORT_EXPORT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { exportToExcell } from '../../common/exportToExcell';
import formatRupiah from '../../common/formatRupiah';
import TipeFilterGroup from '../../components/SelectGroup/TipeFilterGroup';
import FinanceStatusFilterGroup from '../../components/SelectGroup/FinanceStatusFilterGroup';
import PeriodeTipeFilterGroup from '../../components/SelectGroup/PeriodeTipeFilterGroup';

function ReportReimbursement() {
  const [data, setData] = React.useState();

  const [cabang, setCabang] = React.useState<string | any>();
  const [showCabang, setShowCabang] = React.useState<boolean>(false);

  const [showBank, setShowBank] = React.useState<boolean>(false);
  const [selectedBank, setSelectedBank] = React.useState<any>();
  const [bankDetail, setBankDetail] = React.useState<any>();

  const [tanggalStart, setTanggalStart] = React.useState<Date | any>();
  const [tanggalEnd, setTanggalEnd] = React.useState<Date | any>();

  const [typeFilter, setTypeFilter] = React.useState<string>('');
  const [financeFilter, setFinanceFilter] = React.useState<string>('');
  const [typePeriodeFilter, setTypePeriodeFilter] = React.useState<string>('');

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();

  // === Navigate
  const navigate = useNavigate();

  async function onCreateReport() {
    const diff = hitungSelisihHari(tanggalStart, tanggalEnd);

    if (diff < 0) {
      alert('Periode tidak boleh memiliki selisih kurang dari 0 hari.');
      toggle();
      return;
    }

    // if (diff > 3) {
    //   alert('Periode maksimal adalah 3 hari.');
    //   toggle();
    //   return;
    // }

    const startDate = moment(tanggalStart, true)
      .startOf('day')
      .format('YYYY-MM-DD');
    const endDate = moment(tanggalEnd, true).endOf('day').format('YYYY-MM-DD');

    changeType('LOADING');

    const { state, data, error } = await useFetch({
      url: SUPERUSER_REPORT_EXPORT(
        startDate,
        endDate,
        cabang ? cabang.value : '',
        selectedBank ? selectedBank?.namaBank : '',
        typeFilter,
        financeFilter,
        typePeriodeFilter,
      ),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setData(data.rows);
      onExportToExcell(data.rows);
    } else {
      toggle();
      alert('Ada kesalahan yang tidak diketahui, mohon coba lagi!');
    }
  }

  function isImageUrl(str: string) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    return urlPattern.test(str);
  }

  function isValidURL(str: string) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  function onExportToExcell(data = []) {
    const startDate = moment(tanggalStart, true)
      .startOf('day')
      .format('YYYY-MM-DD');
    const endDate = moment(tanggalEnd, true).endOf('day').format('YYYY-MM-DD');

    const normalizeData = data.map((itemCol) => {
      const {
        id,
        item,
        bank_detail,
        accepted_by,
        finance_by,
        nominal,
        attachment,
        maker_approve,
        reviewer_approve,
        pengajuan_ca,
        ...rest
      }: any = itemCol;

      const parsedItem = item
        .map(
          (item: any) =>
            `${item.invoice} || ${item.name} || ${formatRupiah(
              item.nominal,
              true,
            )}`,
        )
        .join(', \n');

      const parsedBankDetail = bank_detail.bankname
        ? `${bank_detail.bankname}, Data: ${bank_detail.accountname} - ${bank_detail.accountnumber}`
        : '-';

      const parsedAcceptedBy = accepted_by
        .map((item: any) => `${item.nm_user} (${item.status})`)
        .join(', ');

      const parsedFinanceBy = finance_by.nm_user;

      const formatedNominal = formatCurrencyToNumber(nominal);

      const formatCANominal = formatCurrencyToNumber(pengajuan_ca);

      const parsedAttachment = isValidURL(attachment) ? attachment : '';

      let saldo = 0;

      if (rest.jenis_reimbursement == 'Cash Advance Report') {
        const intNominal = parseInt(
          pengajuan_ca.replace('Rp. ', '').replace(/\./g, ''),
        );
        const intRealisasi = parseInt(
          nominal.replace('Rp. ', '').replace(/\./g, ''),
        );

        saldo = intNominal - intRealisasi;
      }

      return {
        ...rest,
        item: parsedItem,
        bank_detail: parsedBankDetail,
        accepted_by: parsedAcceptedBy,
        finance_by: parsedFinanceBy,
        nominal: formatedNominal,
        lampiran: parsedAttachment,
        makerApprove: maker_approve,
        reviewerApprove: reviewer_approve,
        pengajuan_ca: formatCANominal,
        saldo: saldo,
      };
    });

    const customHeaders = [
      'Nomor Dokumen',
      'Jenis Request of Payment',
      'Tanggal Request of Payment',
      'Cabang',
      'ID User',
      'Nama User',
      'Nama Suplier',
      'COA',
      'Deskripsi',
      'Status Pengajuan',
      'Status Persetujuan Finance',
      'Metode Pembayaran',
      'Tanggal Disetujui',
      'Realisasi',
      'Kategori Permintaan',
      'Bank Finance',
      'Tanggal Dibuat',
      'Daftar Item',
      'Detail Bank User',
      'Daftar Penyetuju',
      'Nama Finance',
      'Nominal Pengajuan',
      'Lampiran',
      'Tanggal Disetujui Maker',
      'Tanggal Disetujui Reviewer',
      'Nominal Pengajuan Cash Advance',
      'Sisa Saldo',
    ];

    const title = `Report${startDate}-${endDate}`;

    const sortedData = normalizeData.sort((a, b) => a.id - b.id);

    exportToExcell(sortedData, customHeaders, title);
    toggle();
  }

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Buat Report Reimbursement
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className="w-full">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Cabang
              </label>
              <div className="flex flex-row gap-x-4">
                <div
                  onClick={() => setShowCabang(!showCabang)}
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                >
                  {cabang?.label || 'Pilih Cabang'}
                </div>
                <div className=" w-56">
                  <Button
                    onClick={() => setCabang('')}
                    mode={'outlined'}
                    className=" h-full"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Bank Finance
              </label>
              <div className=" flex flex-row gap-x-4">
                <div
                  onClick={() =>
                    bankDetail?.accountname?.length
                      ? null
                      : setShowBank(!showBank)
                  }
                  className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                >
                  {selectedBank?.namaBank || 'Pilih Bank'}
                </div>
                <div className=" w-56">
                  <Button
                    onClick={() => {
                      setBankDetail('');
                      setSelectedBank('');
                    }}
                    mode="outlined"
                    className=" h-full"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Tipe Pembayaran
            </label>
            <div className=" flex flex-row gap-x-4">
              <TipeFilterGroup
                className="mx-0 w-full"
                typeOnly
                setValue={(val: string) => setTypeFilter(val)}
                value={typeFilter}
              />
              <div className=" w-56">
                <Button
                  onClick={() => {
                    setTypeFilter('');
                  }}
                  mode="outlined"
                  className=" h-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Status Finance
            </label>
            <div className=" flex flex-row gap-x-4">
              <FinanceStatusFilterGroup
                className="mx-0 w-full"
                typeOnly
                setValue={(val: string) => setFinanceFilter(val)}
                value={financeFilter}
              />
              <div className=" w-56">
                <Button
                  onClick={() => {
                    setFinanceFilter('');
                  }}
                  mode="outlined"
                  className=" h-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <DatePicker
              id="start"
              title="Periode Mulai"
              onChange={(date) => setTanggalStart(date)}
            />
          </div>

          <div className="w-full">
            <DatePicker
              id="end"
              title="Periode Akhir"
              onChange={(date) => setTanggalEnd(date)}
            />
          </div>

          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Tipe Periode
            </label>
            <div className=" flex flex-row gap-x-4">
              <PeriodeTipeFilterGroup
                className="mx-0 w-full"
                typeOnly
                setValue={(val: string) => setTypePeriodeFilter(val)}
                value={typePeriodeFilter}
              />
              <div className=" w-56">
                <Button
                  onClick={() => {
                    setTypePeriodeFilter('');
                  }}
                  mode="outlined"
                  className=" h-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className=" w-full">
            <Button
              disabled={!tanggalStart || !tanggalEnd}
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                toggle();
              }}
            >
              Buat Report
            </Button>
          </div>
        </div>
      </div>
      <CabangModal
        visible={showCabang}
        toggle={() => setShowCabang(!showCabang)}
        value={(val: any) => setCabang(val)}
      />
      <BankModal
        visible={showBank}
        toggle={() => setShowBank(!showBank)}
        value={(val: any) => {
          setSelectedBank(val);
          setBankDetail({});
        }}
      />
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => onCreateReport()}
      />
    </DefaultLayout>
  );
}

export default ReportReimbursement;
