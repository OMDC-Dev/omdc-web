import * as React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { cekAkses } from '../../common/utils';

const TABLE_HEAD = [
  'Pengajuan',
  'No. Doc.',
  'Tanggal',
  'Cabang',
  'Diajukan Oleh',
  'Nama Client / Vendor',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Status',
  '',
];

function Reimbursement() {
  const [rList, setRList] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [pageInfo, setPageInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // reimbursement akses
  const hasReimbursementAkses = cekAkses('#1');

  React.useEffect(() => {
    getReimbursementList();
  }, [page]);

  async function getReimbursementList() {
    setLoading(true);
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT + `?limit=${limit}&page=${page}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setRList(data?.rows);
      setPageInfo(data?.pageInfo);
    } else {
      setLoading(false);
      setRList([]);
      console.log(error);
    }
  }

  function statusChip(status: string) {
    switch (status) {
      case 'WAITING':
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
      case 'APPROVED':
        return <Chip variant={'outlined'} color="green" value={'Disetujui'} />;
        break;
      case 'REJECTED':
        return <Chip variant={'outlined'} color="red" value={'Ditolak'} />;
        break;
      case 'DONE':
        return <Chip variant={'outlined'} color="green" value={'Selesai'} />;
        break;
      default:
        return <Chip variant={'outlined'} color="amber" value={'Menunggu'} />;
        break;
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full bg-boxdark">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex-col flex sm:flex-row sm:items-center  justify-between gap-8 bg-boxdark">
            <div>
              <Typography variant="h5" color="white">
                Riwayat Pengajuan
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat pengajuan.
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {hasReimbursementAkses ? (
                <Button
                  variant="filled"
                  size="sm"
                  color="blue"
                  onClick={() =>
                    navigate('/reimbursement/ajukan', { replace: false })
                  }
                >
                  Buat Pengajuan Baru
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
        {!rList?.length ? (
          <CardBody>
            <div className=" h-96 flex justify-center items-center text-white font-semibold text-sm">
              Belum ada pengajuan
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
                  {rList.map((item: any, index) => {
                    const isLast = index === rList?.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-800';

                    return (
                      <tr key={item?.id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.jenis_reimbursement}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {item?.no_doc}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {item?.tanggal_reimbursement}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              className="font-normal "
                            >
                              {item?.kode_cabang}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.requester?.nm_user}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.coa}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.nominal}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {item?.accepted_date || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal">
                            {moment(item?.createdAt).format('lll') || '-'}
                          </Typography>
                        </td>
                        <td className={classes}>
                          {/* <Typography variant="small" className="font-normal">
                            {item?.status}
                          </Typography> */}
                          {statusChip(item?.status)}
                        </td>
                        <td className={classes}>
                          <Tooltip content="Detail">
                            <IconButton
                              variant="text"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/reimbursement/${item?.id}`, {
                                  replace: false,
                                  state: item,
                                });
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
              <Typography variant="small" color="white" className="font-normal">
                Page {page} of {pageInfo?.pageCount}
              </Typography>
              <div className="flex gap-2">
                <Button
                  disabled={page < 2 || loading}
                  variant="outlined"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={page == pageInfo?.pageCount || loading}
                  variant="outlined"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </DefaultLayout>
  );
}

export default Reimbursement;
