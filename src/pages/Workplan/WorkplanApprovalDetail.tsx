import { Button, Card, Chip, List, ListItem } from '@material-tailwind/react';
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
  cekAkses,
  getFormattedDateTable,
  standardizeDate,
} from '../../common/utils';
import ActionCard from '../../components/ActionCard';
import { ContainerCard } from '../../components/ContainerCard';
import { DetailPlaceholder } from '../../components/DetailPlaceholder';
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
import WorkplanProgressModal from '../../components/Modal/WorkplanProgressModal';

const WorkplanApprovalDetail: React.FC = () => {
  const [showWorkplan, setShowWorkplan] = React.useState<boolean>(false);
  const [cc, setCC] = React.useState<any>([]);
  const [progressList, setProgressList] = React.useState([]);
  const [selectedProgress, setSelectedProgress] = React.useState<any>();
  const [commentCount, setCommentCount] = React.useState(0);

  const [showFile, setShowFile] = React.useState(false);
  const [showWPHistory, setShowWPHistory] = React.useState(false);

  const [workplanDetail, setWorkplanDetail] = React.useState<any>();
  const [selectedGambar, setSelectedGambar] = React.useState<string>('');
  const [showComment, setShowComment] = React.useState<boolean>(false);
  const [showProgress, setShowProgress] = React.useState<boolean>(false);

  const { id } = useParams();

  const _status = getWorkplanStatusText(workplanDetail?.status);
  const IS_ADMIN_WP = cekAkses('#12');

  const WP_STATUS = workplanDetail?.status;
  const IS_FINISHED =
    WP_STATUS == WORKPLAN_STATUS.FINISH ||
    WP_STATUS == WORKPLAN_STATUS.REJECTED;

  const IS_APPROVAL = workplanDetail?.jenis_workplan == 'APPROVAL';

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

  const updateStatusWorkplan = async (status: any) => {
    changeType('LOADING');
    const body = {
      status: status,
      fromAdmin: true,
    };

    const { state, data, error } = await useFetch({
      url: WORKPLAN_UPDATE_STATUS(workplanDetail?.id),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  };

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
        {!IS_FINISHED && IS_ADMIN_WP && IS_APPROVAL && (
          <>
            <Button
              size="sm"
              className="normal-case"
              color={'green'}
              onClick={() => {
                changeContext('DONE');
                changeType('CONFIRM');
                show();
              }}
            >
              Setujui
            </Button>
            <Button
              size="sm"
              className="normal-case"
              color={'amber'}
              onClick={() => {
                changeContext('REVISI');
                changeType('CONFIRM');
                show();
              }}
            >
              Revisi
            </Button>
            <Button
              size="sm"
              className="normal-case"
              color={'red'}
              onClick={() => {
                changeContext('REJECT');
                changeType('CONFIRM');
                show();
              }}
            >
              Tolak
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
              value={workplanDetail?.perihal}
              label="Perihal"
              isTextArea
            />

            {/* <DetailPlaceholder
              value={
                workplanDetail?.jenis_workplan == 'APPROVAL'
                  ? 'Approval'
                  : 'Non Approval'
              }
              label="Jenis Workplan"
            /> */}
            <DetailPlaceholder
              value={
                workplanDetail?.group_type
                  ? workplanDetail?.group_type == 'MEDIC'
                    ? 'Medis'
                    : 'Non Medis'
                  : '-'
              }
              label="Grup"
            />

            <DetailPlaceholder
              value={workplanDetail?.user_detail?.nm_user}
              label="PIC"
            />

            <div className="w-full">
              <label className="mb-2.5 block text-sm font-medium text-black">
                CC
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
                        />
                      );
                    })
                  ) : (
                    <div className=" ml-2.5">Tidak ada CC</div>
                  )}
                </div>
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
              value={workplanDetail?.tanggal_mulai}
              label="Tanggal Mulai"
            />

            <div className="w-full">
              <DetailPlaceholder
                value={workplanDetail?.tanggal_selesai}
                label="Tanggal Selesai"
              />

              <div
                onClick={() => setShowWPHistory(true)}
                className="mt-4 text-sm text-blue-600 font-semibold hover:cursor-pointer"
              >
                Cek riwayat perubahan
              </div>
            </div>

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
          <ContainerCard title="Attachment">
            <div className=" p-6.5 flex flex-col gap-y-6.5">
              {/* <div className="w-full">
                <label className="mb-2.5 block text-sm font-medium text-black">
                  CC ( Opsional )
                </label>
                <div
                  className={`flex flex-row gap-4 border ${
                    cc?.length ? '' : 'items-center'
                  } border-stroke rounded-md border-p p-2`}
                >
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
                          />
                        );
                      })
                    ) : (
                      <div className=" ml-2.5">Pilih CC</div>
                    )}
                  </div>
                </div>
              </div> */}

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
                  <Card className="h-16 flex items-center justify-center text-sm">
                    <p>Tidak ada gambar diunggah</p>
                  </Card>
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
                  <Card className="h-16 flex items-center justify-center text-sm">
                    <p>Tidak ada gambar diunggah</p>
                  </Card>
                </div>
              ) : (
                // <DetailPlaceholder label="After" value={'File Gambar Akhir'}>
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

          <ContainerCard title="Progress">
            <div className=" p-6.5 flex flex-col gap-y-6.5">
              <div className="w-full">
                {progressList.length > 0 ? (
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
                  Lihat Komentar ({commentCount})
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
          }}
        />

        <ModalSelector
          type={type}
          visible={visible}
          toggle={toggle}
          onConfirm={() => {
            if (context == 'DONE') {
              updateStatusWorkplan(WORKPLAN_STATUS.FINISH);
            } else if (context == 'REVISI') {
              updateStatusWorkplan(WORKPLAN_STATUS.REVISON);
            } else {
              updateStatusWorkplan(WORKPLAN_STATUS.REJECTED);
            }
          }}
          onDone={() => {
            hide();
            if (type == 'SUCCESS') {
              getWorkplanDetail();
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
        />

        <WorkplanProgressModal
          data={workplanDetail}
          visible={showProgress}
          selected={selectedProgress}
          toggle={() => setShowProgress(!showProgress)}
          onSuccess={() => getWorkplanProgress(id)}
        />
      </div>
    </DefaultLayout>
  );
};

export default WorkplanApprovalDetail;
