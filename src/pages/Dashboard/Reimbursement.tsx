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
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';

const TABLE_HEAD = [
  'Pengajuan',
  'Tanggal',
  'Induk Cabang',
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

  const navigate = useNavigate();

  const { token, user } = useAuth();

  console.log('TOKEN : ' + token);
  console.log('USER : ' + user);

  React.useEffect(() => {
    getReimbursementList();
  }, []);

  async function getReimbursementList() {
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT + `?limit=${limit}&page=${page}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setRList(data);
    } else {
      setRList([]);
      console.log(error);
    }
  }

  return (
    <DefaultLayout>
      <Card className="h-full w-full bg-boxdark">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 bg-boxdark">
            <div>
              <Typography variant="h5" color="white">
                Riwayat Pengajuan
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Menampilkan semua riwayat pengajuan.
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="filled"
                size="sm"
                color="blue"
                onClick={() =>
                  navigate('/reimbursement/ajukan', { replace: false })
                }
              >
                Buat Pengajuan
              </Button>
            </div>
          </div>
        </CardHeader>
        {!rList.length ? (
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
                    const isLast = index === rList.length - 1;
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
                          <Typography variant="small" className="font-normal">
                            {item?.status}
                          </Typography>
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
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                Page 1 of 10
              </Typography>
              <div className="flex gap-2">
                <Button variant="outlined" size="sm">
                  Previous
                </Button>
                <Button variant="outlined" size="sm">
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
