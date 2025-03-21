import * as React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Typography,
} from '@material-tailwind/react';
import { ContainerCard } from '../../components/ContainerCard';
import WorkplanTypeGroup from '../../components/SelectGroup/WorkplanTypeGroup';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import TipePembayaranGroup from '../../components/SelectGroup/TipePembayaranGroup';
import CabangModal from '../../components/Modal/CabangModal';
import WorkplanCCModal from '../../components/Modal/WorkplanCCModal';
import { compressImage, standardizeDate } from '../../common/utils';
import ActionCard from '../../components/ActionCard';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import useFetch from '../../hooks/useFetch';
import { WORKPLAN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const BuatWorkplan: React.FC = () => {
  const [workplanType, setWorkplanType] = React.useState('');
  const [tanggalMulai, setTanggalMulai] = React.useState<Date>();
  const [tanggalSelesai, setTanggalSelesai] = React.useState<Date>();
  const [kategori, setKategori] = React.useState('');
  const [desc, setDesc] = React.useState('');

  const [showCabang, setShowCabang] = React.useState<boolean>(false);
  const [showWorkplan, setShowWorkplan] = React.useState<boolean>(false);
  const [cabang, setCabang] = React.useState<string | any>();
  const [cc, setCC] = React.useState<any>([]);
  const [attachmentBefore, setAttachmentBefore] = React.useState();

  const {
    show,
    hide,
    toggle,
    visible,
    type,
    changeType,
    context,
    changeContext,
  } = useModal();

  const navigate = useNavigate();

  const submitButtonDisabled =
    !workplanType ||
    !tanggalMulai ||
    !tanggalSelesai ||
    !kategori ||
    !desc ||
    !cabang;

  // Hit Api
  const submitNewWorkplan = async () => {
    changeType('LOADING');

    const body = {
      jenis_workplan: workplanType,
      tanggal_mulai: standardizeDate(tanggalMulai),
      tanggal_selesai: standardizeDate(tanggalSelesai),
      kd_induk: cabang.value,
      perihal: desc,
      kategori: kategori,
      user_cc: cc,
      attachment_before: attachmentBefore,
    };

    const { state, data, error } = await useFetch({
      url: WORKPLAN,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  };

  // handle attachment
  function handleAttachment(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 10485760;

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

      setAttachmentBefore(splitted[1]);
    };
  }

  return (
    <DefaultLayout>
      <ActionCard>
        <Button
          size="sm"
          className="normal-case"
          disabled={submitButtonDisabled}
          color={'blue'}
          onClick={() => {
            changeContext('SUBMIT_WORKPLAN');
            changeType('CONFIRM');
            show();
          }}
        >
          Buat Workplan
        </Button>
        <Button
          size="sm"
          variant={'outlined'}
          className="normal-case"
          color={'blue'}
          onClick={() => navigate(-1)}
        >
          Batalkan
        </Button>
      </ActionCard>
      <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2">
        <ContainerCard title="Buat Workplan Baru">
          <div className=" p-6.5 flex flex-col gap-y-6.5">
            <WorkplanTypeGroup
              value={workplanType}
              setValue={setWorkplanType}
            />

            <div className="w-full">
              <DatePicker
                title="Tanggal Mulai"
                onChange={(date) => setTanggalMulai(date)}
              />
            </div>

            <div className="w-full">
              <DatePicker
                title="Tanggal Selesai"
                onChange={(date) => setTanggalSelesai(date)}
              />
            </div>

            <div className="w-full">
              <div>
                <label className="mb-3 block text-sm font-medium text-black">
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
              <label className="mb-2.5 block text-sm font-medium text-black">
                Perihal
              </label>
              <textarea
                rows={6}
                placeholder="Masukan Perihal"
                className="w-full rounded border-[1.5px] h-[100px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>

            <div className="w-full">
              <TipePembayaranGroup
                value={kategori}
                setValue={(val: any) => setKategori(val)}
              />
            </div>
          </div>
        </ContainerCard>

        <ContainerCard title="CC dan Attachment">
          <div className=" p-6.5 flex flex-col gap-y-6.5">
            <div className="w-full">
              <label className="mb-2.5 block text-sm font-medium text-black">
                CC ( Opsional )
              </label>
              <div
                className={`flex flex-row gap-4 border ${
                  cc.length ? '' : 'items-center'
                } border-stroke rounded-md border-p p-2`}
              >
                {/* Container Chips */}
                <div className="flex flex-1 flex-wrap gap-2 max-h-[100px] overflow-auto">
                  {cc.length ? (
                    cc?.map((item: any, index: number) => {
                      return (
                        <Chip
                          animate={{ mount: { y: 0 }, unmount: { y: 50 } }}
                          className="normal-case"
                          color="blue"
                          variant="ghost"
                          value={item?.nm_user}
                          onClose={() => {
                            let filtered = cc.filter((fItem: any) => {
                              return fItem.iduser != item.iduser;
                            });

                            setCC(filtered);
                          }}
                        />
                      );
                    })
                  ) : (
                    <div className=" ml-2.5">Pilih CC</div>
                  )}
                </div>

                {/* Tombol Tambah */}
                <Button
                  className="normal-case h-8 whitespace-nowrap"
                  size="sm"
                  color="blue"
                  onClick={() => setShowWorkplan(true)}
                >
                  Tambah CC
                </Button>
              </div>
            </div>

            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black">
                Lampirkan Gambar ( Opsional maks. 10MB)
              </label>
              <input
                type="file"
                className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                accept={'image/*'}
                onChange={handleAttachment}
              />
            </div>
          </div>
        </ContainerCard>

        <CabangModal
          visible={showCabang}
          toggle={() => setShowCabang(!showCabang)}
          value={(val: any) => setCabang(val)}
        />

        <WorkplanCCModal
          visible={showWorkplan}
          toggle={() => setShowWorkplan(!showWorkplan)}
          selectedList={cc}
          value={(val: any) =>
            setCC((prev: any) => [
              ...prev,
              {
                iduser: val.iduser,
                nm_user: val.nm_user,
                fcmToken: val.fcmToken,
              },
            ])
          }
        />

        <ModalSelector
          type={type}
          visible={visible}
          toggle={toggle}
          onConfirm={() => {
            if (context == 'SUBMIT_WORKPLAN') {
              submitNewWorkplan();
            }
          }}
          onDone={() => {
            hide();
            type == 'SUCCESS'
              ? navigate('/workplan/me', { replace: true })
              : null;
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default BuatWorkplan;
