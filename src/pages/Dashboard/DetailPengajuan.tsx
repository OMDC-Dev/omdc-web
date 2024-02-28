import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import {
  Card,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';
import formatRupiah from '../../common/formatRupiah';
import Modal from '../../components/Modal/Modal';
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { colors } from '@material-tailwind/react/types/generic';
import FileModal from '../../components/Modal/FileModal';
import { calculateSaldo, downloadPDF } from '../../common/utils';
import useFetch from '../../hooks/useFetch';
import { REIMBURSEMENT_DETAIL } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import ModalSelector from '../../components/Modal/ModalSelctor';

const DetailPengajuan: React.FC = () => {
  const { toggle, visible, hide, show, changeType, type } = useModal();

  // use nav
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const state = location.state;

  const IS_PUSHED = state?.pushed;

  React.useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, []);

  // data state
  const [data, setData] = React.useState(state || []);

  // Data Modal State
  const [showFile, setShowFile] = React.useState(false);

  const RID = data?.id;

  // handle status
  const STATUS_WORDING = (
    status: string,
    isFinance?: boolean,
  ): { tx: string; color: colors } => {
    switch (status) {
      case 'WAITING':
        return {
          tx: isFinance ? 'Menunggu Ditransfer' : 'Menunggu Disetujui',
          color: 'amber',
        };
        break;
      case 'APPROVED':
        return { tx: 'Disetujui', color: 'green' };
        break;
      case 'DONE':
        return { tx: 'Selesai', color: 'green' };
        break;
      case 'REJECTED':
        return { tx: 'DItolak', color: 'red' };
        break;
      default:
        return { tx: 'Menunggu Disetujui', color: 'amber' };
        break;
    }
  };

  function onReportButtonPressed(e: any) {
    e.preventDefault();
    if (data?.childId) {
      navigate(`/reimbursement/${data?.childId}`, {
        replace: false,
        state: {
          pushed: true,
        },
      });
    } else {
      navigate(`/reimbursement/${data?.id}/report`, {
        replace: false,
        state: data,
      });
    }
  }

  function onSeeButtonPressed(e: any) {
    e.preventDefault();
    if (data?.parentId) {
      navigate(`/reimbursement/${data?.parentId}`, {
        replace: false,
        state: {
          pushed: true,
        },
      });
    }
  }

  React.useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [location.key]);

  async function getDetails(id: any) {
    changeType('LOADING');
    show();
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_DETAIL(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setData(data);
    } else {
      hide();
    }
  }

  // DELETE PENGAJUAN
  async function deletePengajuan() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_DETAIL(RID),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className=" sm:hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Persetujuan
              </h3>
              <Chip
                variant={'outlined'}
                color={STATUS_WORDING(data?.status).color}
                value={STATUS_WORDING(data?.status).tx}
              />
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-1">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Status Approval
                    </label>
                    {data?.accepted_by?.map((item: any, index: number) => {
                      return (
                        <div className=" py-4 flex justify-between">
                          <span className=" text-white font-bold">
                            {item.nm_user}
                          </span>
                          <Chip
                            variant={'ghost'}
                            color={STATUS_WORDING(item?.status).color}
                            value={STATUS_WORDING(item?.status).tx}
                          />
                        </div>
                      );
                    })}
                    {data?.status_finance !== 'IDLE' ? (
                      <div className=" py-4 flex justify-between">
                        <span className=" text-white font-bold">Finance</span>
                        <Chip
                          variant={'ghost'}
                          color={
                            STATUS_WORDING(data?.status_finance, true).color
                          }
                          value={STATUS_WORDING(data?.status_finance, true).tx}
                        />
                      </div>
                    ) : null}
                  </div>
                  {IS_PUSHED ? null : (
                    <>
                      <div className="w-full mt-4.5">
                        <label className="mb-3 block text-black dark:text-white">
                          Catatan
                        </label>
                        <textarea
                          rows={3}
                          disabled
                          placeholder="Masukan Deskripsi"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          defaultValue={data?.note}
                        ></textarea>
                      </div>
                      <div className="w-full mt-4.5">
                        <label className="mb-3 block text-black dark:text-white">
                          Catatan Finance
                        </label>
                        <textarea
                          rows={3}
                          disabled
                          placeholder="Masukan Deskripsi"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          defaultValue={data?.finance_note || '-'}
                        ></textarea>
                      </div>
                    </>
                  )}

                  {data?.status == 'WAITING' ? (
                    <div className=" mt-4">
                      <Button
                        onClick={(e: any) => {
                          e.preventDefault();
                          changeType('CONFIRM');
                          show();
                        }}
                      >
                        Batalkan Pengajuan
                      </Button>
                    </div>
                  ) : null}

                  {data?.jenis_reimbursement == 'Cash Advance' &&
                  data?.status_finance == 'DONE' &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onReportButtonPressed}>
                        {data?.childId ? 'Lihat' : 'Buat'} Report Realisasi
                      </Button>
                    </div>
                  ) : null}
                  {data?.jenis_reimbursement == 'Cash Advance Report' &&
                  data?.parentId &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onSeeButtonPressed}>
                        Lihat Pengajuan Cash Advance
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Form Pengajuan
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      No. Dok
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.no_doc}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Jenis Reimbursement
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.jenis_reimbursement}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      COA
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.coa}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Tanggal
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.tanggal_reimbursement}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Cabang
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.kode_cabang}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nomor WhatsApp
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.requester?.nomorwa}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-black dark:text-white">
                      Nama Client / Vendor
                    </label>
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.name || '-'}
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label className="mb-3 block text-black dark:text-white">
                    Lampiran
                  </label>
                  <div className=" flex flex-col gap-4">
                    <div className="w-full rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                      {data?.file_info?.name}
                    </div>
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        data?.file_info?.type !== 'application/pdf'
                          ? setShowFile(!showFile)
                          : downloadPDF(
                              data?.attachment,
                              data?.file_info?.name,
                            );
                      }}
                    >
                      {data?.file_info?.type !== 'application/pdf'
                        ? 'Lihat Lampiran'
                        : 'Unduh Lampiran'}
                    </Button>
                  </div>
                </div>

                <div className="w-full mt-4.5">
                  <label className="mb-3 block text-black dark:text-white">
                    Deskripsi
                  </label>
                  <textarea
                    rows={6}
                    disabled
                    placeholder="Masukan Deskripsi"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={data?.description}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="hidden sm:block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Status Persetujuan
              </h3>
              <Chip
                variant={'outlined'}
                color={STATUS_WORDING(data?.status).color}
                value={STATUS_WORDING(data?.status).tx}
              />
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-1">
                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Status Approval
                    </label>
                    {data?.accepted_by?.map((item: any, index: number) => {
                      return (
                        <div className=" py-4 flex justify-between">
                          <span className=" text-white font-bold">
                            {item.nm_user}
                          </span>
                          <Chip
                            variant={'ghost'}
                            color={STATUS_WORDING(item?.status).color}
                            value={STATUS_WORDING(item?.status).tx}
                          />
                        </div>
                      );
                    })}
                    {data?.status_finance !== 'IDLE' ? (
                      <div className=" py-4 flex justify-between">
                        <span className=" text-white font-bold">Finance</span>
                        <Chip
                          variant={'ghost'}
                          color={
                            STATUS_WORDING(data?.status_finance, true).color
                          }
                          value={STATUS_WORDING(data?.status_finance, true).tx}
                        />
                      </div>
                    ) : null}
                  </div>
                  {IS_PUSHED ? null : (
                    <>
                      <div className="w-full mt-4.5">
                        <label className="mb-3 block text-black dark:text-white">
                          Catatan
                        </label>
                        <textarea
                          rows={3}
                          disabled
                          placeholder="Masukan Deskripsi"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          defaultValue={data?.note}
                        ></textarea>
                      </div>
                      <div className="w-full mt-4.5">
                        <label className="mb-3 block text-black dark:text-white">
                          Catatan Finance
                        </label>
                        <textarea
                          rows={3}
                          disabled
                          placeholder="Masukan Deskripsi"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          defaultValue={data?.finance_note || '-'}
                        ></textarea>
                      </div>
                    </>
                  )}
                  {data?.jenis_reimbursement == 'Cash Advance' &&
                  data?.status_finance == 'DONE' &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onReportButtonPressed}>
                        {data?.childId ? 'Lihat' : 'Buat'} Report Realisasi
                      </Button>
                    </div>
                  ) : null}
                  {data?.jenis_reimbursement == 'Cash Advance Report' &&
                  data?.parentId &&
                  !IS_PUSHED ? (
                    <div className="w-full mt-4.5">
                      <Button onClick={onSeeButtonPressed}>
                        Lihat Pengajuan Cash Advance
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </form>
          </div>

          {/* <!-- Sign Up Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Item</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4">
                  <Card className=" rounded-md">
                    <List>
                      {data?.item?.map((item: any, index: number) => {
                        return (
                          <ListItem
                            key={item + index}
                            ripple={false}
                            className="py-1 pr-1 pl-4"
                          >
                            {item?.name}
                            <ListItemSuffix className="flex gap-x-4">
                              {formatRupiah(item.nominal, true)}
                            </ListItemSuffix>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                </div>
                <div className="mb-1">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Total Nominal
                  </label>
                  <input
                    disabled
                    type="text"
                    defaultValue={data?.nominal}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                {data?.realisasi ? (
                  <>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nominal Realisasi
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={data?.realisasi}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Saldo
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={calculateSaldo(
                          data?.nominal,
                          data?.realisasi,
                        )}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </>
                ) : null}
                {data?.pengajuan_ca ? (
                  <>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Nominal Pengajuan Cash Advance
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={data?.pengajuan_ca}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="mt-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Saldo
                      </label>
                      <input
                        disabled
                        type="text"
                        defaultValue={calculateSaldo(
                          data?.pengajuan_ca,
                          data?.nominal,
                        )}
                        placeholder="Enter your full name"
                        className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>

          {/* <!-- Sign In Form --> */}
          {data?.bank_detail?.bankname ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Data Bank
                </h3>
              </div>
              <form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Bank
                      </label>
                      <div className="w-full cursor-pointer rounded-md border border-stroke py-2 px-6 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white">
                        {data?.bank_detail?.bankname || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nomor Rekening
                    </label>
                    <input
                      disabled
                      type="text"
                      placeholder="Masukan Nomor Rekening"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={data?.bank_detail?.accountnumber}
                    />
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nama Pemilik Rekening
                    </label>
                    <input
                      type="text"
                      disabled
                      defaultValue={data?.bank_detail?.accountname}
                      placeholder="Nama Pemilik Rekening"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-6 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
      {/* MODAL CONTAINER */}
      {/* <Modal visible={visible} toggle={toggle} /> */}
      <FileModal
        type={data?.file_info?.type}
        data={data?.attachment}
        visible={showFile}
        toggle={() => setShowFile(!showFile)}
      />
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => deletePengajuan()}
        onDone={() => navigate('/', { replace: true })}
      />
      {/* DIALOG */}
      {/* <Dialog
        open={showDialog}
        size={'xs'}
        handler={() => setShowDialog(!showDialog)}
        dismiss={{ enabled: false }}
      >
        <DialogHeader>{DIALOG_PROPS.title}</DialogHeader>
        <DialogBody>{DIALOG_PROPS.message}</DialogBody>
        <DialogFooter>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              setShowDialog(!showDialog);
              dialogtype == 'OK' ? navigate('/', { replace: true }) : null;
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog> */}
    </DefaultLayout>
  );
};

export default DetailPengajuan;
