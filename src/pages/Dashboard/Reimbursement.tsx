import * as React from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { REIMBURSEMENT } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';

const TABLE_HEAD = [
  'Pengajuan',
  'Tanggal',
  'Induk Cabang',
  'ID User',
  'Nama Pengajuan',
  'COA',
  'Nominal',
  'Tanggal Disetujui',
  'Tanggal Pengajuan',
  'Status',
];

const TABLE_ROWS = [
  {
    img: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg',
    name: 'John Michael',
    email: 'john@creative-tim.com',
    job: 'Manager',
    org: 'Organization',
    online: true,
    date: '23/04/18',
  },
  {
    img: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg',
    name: 'Alexa Liras',
    email: 'alexa@creative-tim.com',
    job: 'Programator',
    org: 'Developer',
    online: false,
    date: '23/04/18',
  },
  {
    img: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg',
    name: 'Laurent Perrier',
    email: 'laurent@creative-tim.com',
    job: 'Executive',
    org: 'Projects',
    online: false,
    date: '19/09/17',
  },
  {
    img: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg',
    name: 'Michael Levi',
    email: 'michael@creative-tim.com',
    job: 'Programator',
    org: 'Developer',
    online: true,
    date: '24/12/08',
  },
  {
    img: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg',
    name: 'Richard Gran',
    email: 'richard@creative-tim.com',
    job: 'Manager',
    org: 'Executive',
    online: false,
    date: '04/10/21',
  },
];

function Reimbursement() {
  const [rList, setRList] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getReimbursementList();
  }, []);

  async function getReimbursementList() {
    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      console.log(data);
    } else {
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
              {TABLE_ROWS.map(
                ({ img, name, email, job, org, online, date }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? 'p-4'
                    : 'p-4 border-b border-blue-gray-800';

                  return (
                    <tr key={name}>
                      <td className={classes}>
                        <div className="flex items-center gap-3 ">
                          <div className="flex flex-col">
                            <Typography variant="small" className="font-normal">
                              {name}
                            </Typography>
                            <Typography
                              variant="small"
                              className="font-normal opacity-70"
                            >
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography variant="small" className="font-normal">
                            {job}
                          </Typography>
                          <Typography
                            variant="small"
                            className="font-normal opacity-70"
                          >
                            {org}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={online ? 'online' : 'offline'}
                            color={online ? 'green' : 'blue-gray'}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
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
      </Card>
    </DefaultLayout>
  );
}

export default Reimbursement;
