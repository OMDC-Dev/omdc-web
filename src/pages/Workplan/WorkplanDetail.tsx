import { Button, Chip } from '@material-tailwind/react';
import 'flatpickr/dist/flatpickr.min.css';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WORKPLAN, WORKPLAN_UPDATE } from '../../api/routes';
import { compressImage, standardizeDate } from '../../common/utils';
import ActionCard from '../../components/ActionCard';
import { ContainerCard } from '../../components/ContainerCard';
import { DetailPlaceholder } from '../../components/DetailPlaceholder';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import FileModal from '../../components/Modal/FileModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import WorkplanCCModal from '../../components/Modal/WorkplanCCModal';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import DefaultLayout from '../../layout/DefaultLayout';
import { getWorkplanStatusText } from '../../constants/WorkplanStatus';
import { color } from '@material-tailwind/react/types/components/alert';
import WorkplanHistoryModal from '../../components/Modal/WorkplanHistoryModal';
import WorkplanCommentModal from '../../components/Modal/WorkplanCommentModal';

const WorkplanDetail: React.FC = () => {
  const [tanggalSelesai, setTanggalSelesai] = React.useState<Date>();

  const [showWorkplan, setShowWorkplan] = React.useState<boolean>(false);
  const [cc, setCC] = React.useState<any>([]);
  const [attachmentAfter, setAttachmentAfter] = React.useState();
  const [isHasChanges, setIsHasChanges] = React.useState(false);

  const [showFile, setShowFile] = React.useState(false);
  const [showWPHistory, setShowWPHistory] = React.useState(false);

  const [workplanDetail, setWorkplanDetail] = React.useState<any>();
  const [selectedGambar, setSelectedGambar] = React.useState<string>('');
  const [showComment, setShowComment] = React.useState<boolean>(false);

  const { id } = useParams();

  const _status = getWorkplanStatusText(workplanDetail?.status);

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

  const submitButtonDisabled = !isHasChanges && tanggalSelesai != null;

  React.useEffect(() => {
    getWorkplanDetail();
  }, []);

  async function getWorkplanDetail() {
    console.log('GETTING DETAIL....');

    changeType('LOADING');
    show();
    const { state, data, error } = await useFetch({
      url: WORKPLAN + `?id=${id}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setWorkplanDetail(data);
      setCC(data.cc_users);
      setTanggalSelesai(data.tanggal_selesai);
      hide();
    } else {
      console.log(error);
      changeType('FAILED');
    }
  }

  const saveWorkplan = async () => {
    changeType('LOADING');

    let mappedCC = [];

    if (cc && cc.length > 0) {
      mappedCC = cc.map((item: any) => item.iduser);
    }

    const body = {
      tanggal_selesai: standardizeDate(tanggalSelesai),
      user_cc: mappedCC,
      attachment_after: attachmentAfter,
    };

    const { state, data, error } = await useFetch({
      url: WORKPLAN_UPDATE(id),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setIsHasChanges(false);
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

      setIsHasChanges(true);
      setAttachmentAfter(splitted[1]);
    };
  }

  return (
    <DefaultLayout>
      <ActionCard
        title={
          <div className="flex flex-row items-center gap-2.5">
            <Chip
              variant={'ghost'}
              color={_status.color as color}
              value={_status.text}
            />
            {workplanDetail?.approved_date && (
              <div className="text-sm font-medium">disetujui pada</div>
            )}
          </div>
        }
      >
        <Button
          size="sm"
          className="normal-case"
          disabled={submitButtonDisabled}
          color={'blue'}
          onClick={() => {
            changeContext('SAVE');
            changeType('CONFIRM');
            show();
          }}
        >
          Simpan
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
            <DetailPlaceholder
              value={workplanDetail?.jenis_workplan}
              label="Jenis Workplan"
            />

            <DetailPlaceholder
              value={workplanDetail?.tanggal_mulai}
              label="Tanggal Mulai"
            />

            <div className="w-full">
              <DatePicker
                title="Tanggal Selesai ( bisa diupdate )"
                onChange={(date) => {
                  setTanggalSelesai(date);
                  setIsHasChanges(true);
                }}
                defaultValue={workplanDetail?.tanggal_selesai}
              />

              <div
                onClick={() => setShowWPHistory(true)}
                className="mt-4 text-sm text-blue-600 font-semibold hover:cursor-pointer"
              >
                Cek riwayat perubahan
              </div>
            </div>

            <DetailPlaceholder
              value={workplanDetail?.cabang_detail?.nm_induk}
              label="Cabang"
            />

            <DetailPlaceholder
              value={workplanDetail?.perihal}
              label="Perihal"
              isTextArea
            />

            <DetailPlaceholder
              value={workplanDetail?.kategori}
              label="Kategori"
            />
          </div>
        </ContainerCard>

        <div className="flex flex-col gap-y-4.5">
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

                              setIsHasChanges(true);
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

              <DetailPlaceholder label="Gambar Awal" value={'File Gambar Awal'}>
                <Button
                  onClick={() => {
                    setSelectedGambar(workplanDetail?.attachment_before);
                    setShowFile(true);
                  }}
                  fullWidth
                  color="blue"
                  className="mt-2.5 normal-case"
                >
                  Lihat Gambar
                </Button>
              </DetailPlaceholder>

              {!workplanDetail?.attachmentAfter ? (
                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Lampirkan Gambar Akhir ( Opsional maks. 10MB)
                  </label>
                  <input
                    type="file"
                    className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    accept={'image/*'}
                    onChange={handleAttachment}
                  />
                </div>
              ) : (
                <DetailPlaceholder
                  label="Gambar Akhir"
                  value={'File Gambar Akhir'}
                >
                  <Button fullWidth color="blue" className="mt-2.5 normal-case">
                    Lihat Gambar
                  </Button>
                </DetailPlaceholder>
              )}
            </div>
          </ContainerCard>

          <ContainerCard title="Komentar">
            <div className=" p-6.5 flex flex-col gap-y-6.5">
              {workplanDetail?.revise_message && (
                <DetailPlaceholder
                  value={workplanDetail?.revise_message}
                  label="Komentar Revisi"
                  isTextArea
                />
              )}

              <div className="w-full">
                <label className="mb-3 block text-black dark:text-white">
                  Komentar
                </label>
                <Button
                  fullWidth
                  variant={'outlined'}
                  color="blue"
                  className="normal-case"
                  onClick={() => setShowComment(true)}
                >
                  Lihat Komentar
                </Button>
              </div>
            </div>
          </ContainerCard>
        </div>

        <WorkplanCCModal
          visible={showWorkplan}
          toggle={() => setShowWorkplan(!showWorkplan)}
          selectedList={cc}
          value={(val: any) => {
            setCC((prev: any) => [
              ...prev,
              {
                iduser: val.iduser,
                nm_user: val.nm_user,
                fcmToken: val.fcmToken,
              },
            ]);
            setIsHasChanges(true);
          }}
        />

        <ModalSelector
          type={type}
          visible={visible}
          toggle={toggle}
          onConfirm={() => {
            if (context == 'SAVE') {
              saveWorkplan();
            }
          }}
          onDone={() => {
            hide();
            if (type == 'SUCCESS') {
              if (context == 'SAVE') {
                getWorkplanDetail();
              }
            }
          }}
        />

        <FileModal
          type={'image/png'}
          data={selectedGambar}
          visible={showFile}
          toggle={() => setShowFile(!showFile)}
        />

        <WorkplanHistoryModal
          data={workplanDetail?.workplant_date_history}
          visible={showWPHistory}
          toggle={() => setShowWPHistory(!showWPHistory)}
        />

        <WorkplanCommentModal
          data={workplanDetail}
          visible={showComment}
          toggle={() => setShowComment(!showComment)}
        />
      </div>
    </DefaultLayout>
  );
};

export default WorkplanDetail;
