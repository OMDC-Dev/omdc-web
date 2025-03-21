import * as React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
  Button as MButton,
  Chip,
} from '@material-tailwind/react';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { WORKPLAN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { getFormattedDateTable } from '../../common/utils';
import { getWorkplanStatusText } from '../../constants/WorkplanStatus';
import { colors } from '@material-tailwind/react/types/generic';

const TABLE_HEAD = [
  'ID',
  'Tanggal Dibuat',
  'Cabang',
  'Kategori',
  'PIC',
  'Tanggal Mulai',
  'Est. Tanggal Selesai',
  'Status',
  '',
];

const WorkplanSaya: React.FC = () => {
  const [list, setList] = React.useState<any>([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [context, setContext] = React.useState<string>();

  const navigate = useNavigate();

  React.useEffect(() => {
    getMyWorkplan();
  }, []);

  async function getMyWorkplan() {
    const { state, data, error } = await useFetch({
      url: WORKPLAN,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.rows);
      setPageInfo(data.pageInfo);
    } else {
      console.log(error);
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="black">
                Workplan Saya
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua workplan
              </Typography>
            </div>
            <MButton
              variant="filled"
              size="sm"
              color="blue"
              onClick={() =>
                navigate('/workplan/pengajuan', { replace: false })
              }
            >
              Buat Workplan
            </MButton>
          </div>
        </CardHeader>
        {!list?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-black-2 font-semibold text-sm">
              Belum ada workplan
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
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list?.map((item: any, index: number) => {
                    const isLast = index === list?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={item?.iduser}>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.workplan_id}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {getFormattedDateTable(item?.createdAt)}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.cabang_detail.nm_induk}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.kategori}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.user_detail?.nm_user}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.tanggal_mulai}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.tanggal_selesai}
                            </Typography>
                          </div>
                        </td>
                        <td
                          className={`${classes} sticky right-[4rem] bg-white z-10`}
                        >
                          <div className="w-max">
                            <Chip
                              className="normal-case"
                              variant={'ghost'}
                              color={
                                getWorkplanStatusText(item.status)
                                  .color as colors
                              }
                              value={getWorkplanStatusText(item.status).text}
                            />
                          </div>
                        </td>
                        <td
                          className={`${classes} sticky right-0 bg-white z-10`}
                        >
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/workplan/pengajuan/${item.id}`);
                              }}
                            >
                              <DocumentTextIcon className="h-4 w-4" />
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
              <Typography variant="small" color="black" className="font-normal">
                Halaman {page} dari {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <MButton
                  disabled={page < 2 || loading}
                  variant="outlined"
                  size="sm"
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </MButton>
                <MButton
                  disabled={page == pageInfo?.pageCount || loading}
                  variant="outlined"
                  size="sm"
                  color="blue"
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
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => {}}
        onDone={() => {}}
      />
    </DefaultLayout>
  );
};

export default WorkplanSaya;
