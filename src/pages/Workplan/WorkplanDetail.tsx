import {
  Button,
  Card,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSuffix,
} from '@material-tailwind/react';
import 'flatpickr/dist/flatpickr.min.css';
import * as React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  WORKPLAN,
  WORKPLAN_COMMENT,
  WORKPLAN_PROGRESS,
  WORKPLAN_UPDATE,
  WORKPLAN_UPDATE_STATUS,
} from '../../api/routes';
import {
  compressImage,
  getFormattedDateTable,
  standardizeDate,
} from '../../common/utils';
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
import {
  WORKPLAN_STATUS,
  getWorkplanStatusText,
} from '../../constants/WorkplanStatus';
import { color } from '@material-tailwind/react/types/components/alert';
import WorkplanHistoryModal from '../../components/Modal/WorkplanHistoryModal';
import WorkplanCommentModal from '../../components/Modal/WorkplanCommentModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import WorkplanProgressModal from '../../components/Modal/WorkplanProgressModal';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';

const WorkplanDetail: React.FC = () => {
  const [tanggalSelesai, setTanggalSelesai] = React.useState<Date>();

  const [showWorkplan, setShowWorkplan] = React.useState<boolean>(false);
  const [cc, setCC] = React.useState<any>([]);
  const [attachmentAfter, setAttachmentAfter] = React.useState();
  const [attachmentBefore, setAttachmentBefore] = React.useState();
  const [isHasChanges, setIsHasChanges] = React.useState(false);
  const [progressList, setProgressList] = React.useState([]);
  const [selectedProgress, setSelectedProgress] = React.useState<any>();
  const [isChangeFile, setIsChangeFile] = React.useState(false);
  const [commentCount, setCommentCount] = React.useState(0);

  const [showFile, setShowFile] = React.useState(false);
  const [showWPHistory, setShowWPHistory] = React.useState(false);

  const [workplanDetail, setWorkplanDetail] = React.useState<any>();
  const [selectedGambar, setSelectedGambar] = React.useState<string>('');
  const [showComment, setShowComment] = React.useState<boolean>(false);
  const [showProgress, setShowProgress] = React.useState<boolean>(false);

  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();

  console.log(cc);

  const _status = getWorkplanStatusText(workplanDetail?.status);
  const IS_NON_APPROVAL =
    state?.jenis_workplan !== 'APPROVAL' ??
    workplanDetail?.jenis_workplan !== 'APPROVAL';
  const WP_STATUS = workplanDetail?.status;
  const IS_FINISHED =
    WP_STATUS == WORKPLAN_STATUS.FINISH ||
    WP_STATUS == WORKPLAN_STATUS.REJECTED;

  const IS_EDIT_MODE = state?.isEditMode;

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
    getWorkplanProgress(id);
    getCommentCount();
  }, []);

  async function getCommentCount() {
    changeType('LOADING');
    show();

    const { state, data, error } = await useFetch({
      url: WORKPLAN_COMMENT(id) + '/count',
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setCommentCount(data.count);
    } else {
      hide();
    }
  }

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
      getWorkplanProgress(id);
      hide();
    } else {
      console.log(error);
      changeType('FAILED');
    }
  }

  async function getWorkplanProgress(id: any) {
    changeType('LOADING');
    show();
    const { state, data, error } = await useFetch({
      url: WORKPLAN_PROGRESS(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setProgressList(data);
      hide();
    } else {
      console.log(error);
      changeType('FAILED');
    }
  }

  const saveWorkplan = async () => {
    changeType('LOADING');

    let mappedCC = [];

    if (cc && cc?.length > 0) {
      mappedCC = cc.map((item: any) => item.iduser);
    }

    const body = {
      tanggal_selesai: standardizeDate(tanggalSelesai),
      user_cc: mappedCC,
      attachment_after: attachmentAfter,
      attachment_before: attachmentBefore,
      isUpdateAfter: isChangeFile,
    };

    const { state, data, error } = await useFetch({
      url: WORKPLAN_UPDATE(id),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setIsHasChanges(false);
      setIsChangeFile(false);
    } else {
      changeType('FAILED');
    }
  };

  const updateStatusWorkplan = async (status: any) => {
    changeType('LOADING');
    const body = {
      status: status,
    };

    const { state, data, error } = await useFetch({
      url: WORKPLAN_UPDATE_STATUS(workplanDetail?.id),
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

  const deleteWorkplan = async () => {
    changeType('LOADING');

    const { state, data, error } = await useFetch({
      url: WORKPLAN + `/${id}`,
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  };

  // handle attachment
  function handleAttachment(event: any, type: string) {
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
      if (type == 'AFTER') {
        setAttachmentAfter(splitted[1]);
      } else {
        setAttachmentBefore(splitted[1]);
      }
    };
  }

  return (
    <DefaultLayout>
      <ActionCard
        title={
          <div className="flex flex-row items-center gap-2.5">
            <Chip
              className="normal-case"
              variant={'ghost'}
              color={_status.color as color}
              value={_status.text}
            />
            {workplanDetail?.approved_date && (
              <div className="text-sm font-medium">
                pada {getFormattedDateTable(workplanDetail?.approved_date)}
              </div>
            )}
          </div>
        }
      >
        {IS_NON_APPROVAL && !IS_FINISHED && IS_EDIT_MODE && (
          <>
            <Button
              size="sm"
              className="normal-case"
              color={'amber'}
              onClick={() => {
                changeContext(
                  WP_STATUS == WORKPLAN_STATUS.ON_PROGRESS ||
                    WP_STATUS == WORKPLAN_STATUS.REVISON
                    ? 'PENDING'
                    : 'ON_PROGRESS',
                );
                changeType('CONFIRM');
                show();
              }}
            >
              {WP_STATUS == WORKPLAN_STATUS.ON_PROGRESS ||
              WP_STATUS == WORKPLAN_STATUS.REVISON
                ? 'Set ke Pending'
                : 'Set ke On Progress'}
            </Button>
            <Button
              size="sm"
              className="normal-case"
              disabled={
                !progressList?.length || WP_STATUS == WORKPLAN_STATUS.PENDING
              }
              color={'green'}
              onClick={() => {
                changeContext('DONE');
                changeType('CONFIRM');
                show();
              }}
            >
              Set ke Selesai
            </Button>
          </>
        )}

        {!IS_FINISHED && IS_EDIT_MODE && (
          <>
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
              className="normal-case"
              color={'red'}
              onClick={() => {
                changeContext('DELETE');
                changeType('CONFIRM');
                show();
              }}
            >
              Hapus
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant={'outlined'}
          className="normal-case"
          color={'blue'}
          onClick={() => navigate(-1)}
        >
          Kembali
        </Button>
      </ActionCard>
      <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2">
        <ContainerCard title="Detail Work in Progress">
          <div className=" p-6.5 flex flex-col gap-y-6.5">
            <DetailPlaceholder
              value={
                workplanDetail?.jenis_workplan == 'APPROVAL'
                  ? 'Approval'
                  : 'Non Approval'
              }
              label="Jenis Work in Progress"
            />

            <DetailPlaceholder
              value={workplanDetail?.tanggal_mulai}
              label="Tanggal Mulai"
            />

            <div className="w-full">
              {IS_FINISHED || !IS_EDIT_MODE ? (
                <DetailPlaceholder
                  value={workplanDetail?.tanggal_selesai}
                  label="Tanggal Selesai"
                />
              ) : (
                <DatePicker
                  title={
                    IS_FINISHED
                      ? 'Tanggal Selesai'
                      : 'Tanggal Selesai ( bisa diupdate )'
                  }
                  onChange={(date) => {
                    setTanggalSelesai(date);
                    setIsHasChanges(true);
                  }}
                  disabled={IS_FINISHED}
                  defaultValue={workplanDetail?.tanggal_selesai}
                />
              )}

              <div
                onClick={() => setShowWPHistory(true)}
                className="mt-4 text-sm text-blue-600 font-semibold hover:cursor-pointer"
              >
                Cek riwayat perubahan
              </div>
            </div>

            <DetailPlaceholder
              value={
                workplanDetail?.cabang_detail
                  ? workplanDetail?.cabang_detail?.nm_induk
                  : workplanDetail?.custom_location
              }
              label="Cabang / Lokasi"
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

            <DetailPlaceholder
              value={getFormattedDateTable(workplanDetail?.last_update, 'LLL')}
              label="Terakhir Diupdate"
            />

            <DetailPlaceholder
              value={workplanDetail?.last_update_by}
              label="Terakhir Diupdate Oleh"
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
                    cc?.length ? '' : 'items-center'
                  } border-stroke rounded-md border-p p-2`}
                >
                  {/* Container Chips */}
                  <div className="flex flex-1 flex-wrap gap-2 max-h-[100px] overflow-auto">
                    {cc?.length ? (
                      cc?.map((item: any, index: number) => {
                        return (
                          <Chip
                            animate={{ mount: { y: 0 }, unmount: { y: 50 } }}
                            className="normal-case"
                            color="blue"
                            variant="ghost"
                            value={item?.nm_user}
                            onClose={
                              IS_FINISHED ||
                              !IS_EDIT_MODE ||
                              item.iduser == user.iduser
                                ? undefined
                                : () => {
                                    let filtered = cc.filter((fItem: any) => {
                                      return fItem.iduser != item.iduser;
                                    });

                                    setIsHasChanges(true);
                                    setCC(filtered);
                                  }
                            }
                          />
                        );
                      })
                    ) : (
                      <div className=" ml-2.5">Pilih CC</div>
                    )}
                  </div>

                  {/* Tombol Tambah */}
                  {!IS_FINISHED && IS_EDIT_MODE && (
                    <Button
                      className="normal-case h-8 whitespace-nowrap"
                      size="sm"
                      color="blue"
                      onClick={() => setShowWorkplan(true)}
                    >
                      Tambah CC
                    </Button>
                  )}
                </div>
              </div>

              {/* <DetailPlaceholder label="Gambar Awal" value={'File Gambar Awal'}>
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
              </DetailPlaceholder> */}

              {!workplanDetail?.attachment_before ? (
                <div className="w-full">
                  {!IS_FINISHED && IS_EDIT_MODE ? (
                    <>
                      <label className="mb-3 block text-sm font-medium text-black">
                        Lampirkan Gambar Awal ( Opsional maks. 10MB)
                      </label>
                      <input
                        type="file"
                        className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                        accept={'image/*'}
                        onChange={(e) => handleAttachment(e, 'BEFORE')}
                      />
                    </>
                  ) : (
                    <Card className="h-16 flex items-center justify-center text-sm">
                      <p>Tidak ada gambar diunggah</p>
                    </Card>
                  )}
                </div>
              ) : (
                // <DetailPlaceholder label="Before" value={'File Gambar Awal'}>
                //   <div className="flex flex-row items-center gap-2.5">
                //     <Button
                //       size="sm"
                //       onClick={() => {
                //         setSelectedGambar(workplanDetail?.attachment_before);
                //         setShowFile(true);
                //       }}
                //       fullWidth
                //       color="blue"
                //       className="mt-2.5 normal-case"
                //     >
                //       Lihat
                //     </Button>
                //   </div>
                // </DetailPlaceholder>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Before
                  </label>
                  <img
                    src={workplanDetail?.attachment_before}
                    className="w-full aspect-video object-cover bg-gray-200 rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      setSelectedGambar(workplanDetail?.attachment_before);
                      setShowFile(true);
                    }}
                  />
                </div>
              )}

              {!workplanDetail?.attachment_after ? (
                <div className="w-full">
                  {!IS_FINISHED && IS_EDIT_MODE ? (
                    <>
                      <label className="mb-3 block text-sm font-medium text-black">
                        Lampirkan Gambar Akhir ( Opsional maks. 10MB)
                      </label>
                      <input
                        type="file"
                        className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                        accept={'image/*'}
                        onChange={(e) => handleAttachment(e, 'AFTER')}
                      />
                    </>
                  ) : (
                    <Card className="h-16 flex items-center justify-center text-sm">
                      <p>Tidak ada gambar diunggah</p>
                    </Card>
                  )}
                </div>
              ) : isChangeFile ? (
                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black">
                    Lampirkan Gambar Akhir ( Opsional maks. 10MB)
                  </label>
                  <input
                    type="file"
                    className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    accept={'image/*'}
                    onChange={(e) => handleAttachment(e, 'AFTER')}
                  />
                  <Button
                    variant={'outlined'}
                    fullWidth
                    color="blue"
                    size="sm"
                    className="normal-case mt-4"
                    onClick={() => setIsChangeFile(false)}
                  >
                    Batalkan
                  </Button>
                </div>
              ) : (
                // <DetailPlaceholder
                //   label="Gambar Akhir"
                //   value={'File Gambar Akhir'}
                // >
                //   <div className="flex flex-row items-center gap-2.5">
                //     <Button
                //       size="sm"
                //       onClick={() => {
                //         setSelectedGambar(workplanDetail?.attachment_after);
                //         setShowFile(true);
                //       }}
                //       fullWidth
                //       color="blue"
                //       className="mt-2.5 normal-case"
                //     >
                //       Lihat
                //     </Button>

                //     <Button
                //       variant={'outlined'}
                //       size="sm"
                //       onClick={() => setIsChangeFile(true)}
                //       fullWidth
                //       color="blue"
                //       className="mt-2.5 normal-case"
                //     >
                //       Ganti
                //     </Button>
                //   </div>
                // </DetailPlaceholder>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    After
                  </label>
                  <img
                    src={workplanDetail?.attachment_after}
                    className="w-full aspect-video object-cover bg-gray-200 rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      setSelectedGambar(workplanDetail?.attachment_after);
                      setShowFile(true);
                    }}
                  />
                </div>
              )}
            </div>
          </ContainerCard>

          <ContainerCard
            title="Progress"
            suffix={
              IS_FINISHED || !IS_EDIT_MODE ? null : (
                <Button
                  className="normal-case h-8"
                  size={'sm'}
                  color={'blue'}
                  variant={'outlined'}
                  onClick={() => setShowProgress(true)}
                >
                  + Progress
                </Button>
              )
            }
          >
            <div className=" p-6.5 flex flex-col gap-y-6.5">
              <div className="w-full">
                {progressList?.length > 0 ? (
                  <Card>
                    <List className="max-h-50 overflow-y-auto">
                      {progressList.map((item: any) => {
                        return (
                          <ListItem
                            ripple={false}
                            className="py-1 pr-1 pl-4 text-xs"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-black">
                                {getFormattedDateTable(item.createdAt, 'LLL')}
                              </span>
                              <p className="text-xs text-blue-gray-400 mb-2">
                                oleh {item.created_by}
                              </p>
                              {item.progress}
                            </div>

                            {!IS_FINISHED && (
                              <ListItemSuffix>
                                <IconButton
                                  onClick={() => {
                                    setSelectedProgress(item);
                                    setShowProgress(true);
                                  }}
                                  variant="text"
                                  color={'blue'}
                                >
                                  <PencilIcon className="text-blue-500 w-4 h-4" />
                                </IconButton>
                              </ListItemSuffix>
                            )}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                ) : (
                  <Card className="h-20 flex justify-center items-center">
                    <div className="text-sm text-graydark">
                      Belum ada progress
                    </div>
                  </Card>
                )}
              </div>
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
                  Lihat Komentar ( {commentCount} )
                </Button>
              </div>
            </div>
          </ContainerCard>
        </div>

        <WorkplanCCModal
          visible={showWorkplan}
          toggle={() => setShowWorkplan(!showWorkplan)}
          selectedList={cc}
          requesterId={workplanDetail?.iduser}
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
            } else if (context == 'PENDING') {
              updateStatusWorkplan(WORKPLAN_STATUS.PENDING);
            } else if (context == 'ON_PROGRESS') {
              updateStatusWorkplan(WORKPLAN_STATUS.ON_PROGRESS);
            } else if (context == 'DONE') {
              updateStatusWorkplan(WORKPLAN_STATUS.FINISH);
            } else {
              deleteWorkplan();
            }
          }}
          onDone={() => {
            hide();
            if (type == 'SUCCESS') {
              if (context !== 'DELETE') {
                getWorkplanDetail();
              } else {
                navigate(-1);
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
          isDone={IS_FINISHED}
          toggle={() => setShowComment(!showComment)}
          onSuccess={() => getCommentCount()}
        />

        <WorkplanProgressModal
          data={workplanDetail}
          visible={showProgress}
          selected={selectedProgress}
          toggle={() => setShowProgress(!showProgress)}
          onSuccess={() => {
            setSelectedProgress(null);
            getWorkplanProgress(id);
            getWorkplanDetail();
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default WorkplanDetail;
