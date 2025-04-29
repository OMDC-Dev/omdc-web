import { ReactElement } from 'react';
import PageTitle from '../components/PageTitle';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import Reimbursement from '../pages/Dashboard/Reimbursement';
import SignIn from '../pages/Authentication/SignIn';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import SignInProfile from '../pages/Authentication/SignInProfile';
import BuatPengajuan from '../pages/Dashboard/BuatPengajuan';
import DetailPengajuan from '../pages/Dashboard/DetailPengajuan';
import AdminDetailPengajuan from '../pages/Dashboard/AdminDetalPengajuan';
import RiwayatDiajukan from '../pages/Dashboard/RiwayatDiajukan';
import BuatReport from '../pages/Dashboard/BuatReport';
import ChangePassword from '../pages/Authentication/ChangePassword';
import PermintaanBarang from '../pages/PermintaanBarang/PermintaanBarang';
import ListBarang from '../pages/PermintaanBarang/ListBarang';
import DetailPermintaanBarang from '../pages/PermintaanBarang/DetailPermintaanBarang';
import Pengumuman from '../pages/Pengumuman/Pengumuman';
import SuperAdmin from '../pages/SuperAdmin/SuperAdmin';
import Departemen from '../pages/SuperAdmin/Departemen';
import { cekAkses } from '../common/utils';
import UpdateProfile from '../pages/Authentication/UpdateProfile';
import AboutUs from '../pages/Other/AboutUs';
import SuperReimbursement from '../pages/SuperAdmin/Reimbursement';
import DetailReimbursement from '../pages/SuperAdmin/DetailReimbursement';
import SuperCOA from '../pages/SuperAdmin/COA';
import SuperCOAUpdate from '../pages/SuperAdmin/COAUpdate';
import PermintaanBarangAdmin from '../pages/PermintaanBarang/PermintaanBarangAdmin';
import ReportReimbursement from '../pages/Dashboard/ReportReimbursement';
import SuperIcon from '../pages/SuperAdmin/Icon';
import DownloadReport from '../pages/Dashboard/DownloadReport';
import AdminPB from '../pages/SuperAdmin/AdminPB';
import PermintaanBarangApproval from '../pages/PermintaanBarang/PermintaanBarangAdminApproval';
import DetailPermintaanBarangAdmin from '../pages/PermintaanBarang/DetailPermintaanBarangAdmin';
import ReportPermintaanBarang from '../pages/PermintaanBarang/ReportPermintaanBarang';
import ListMasterBarang from '../pages/MasterBarang/ListBarang';
import ListMasterBarangInput from '../pages/MasterBarang/ListBarangInput';
import BuatPengajuanUlang from '../pages/Dashboard/BuatPengajuanUlang';
import ManualUploadFile from '../pages/SuperAdmin/ManualUploadFIle';
import RemarkCA from '../pages/Dashboard/RemarkCA';
import WorkplanSaya from '../pages/Workplan/WorkplanSaya';
import BuatWorkplan from '../pages/Workplan/BuatWorkplan';
import WorkplanDetail from '../pages/Workplan/WorkplanDetail';
import WorkplanApproval from '../pages/Workplan/WorkplanApproval';
import WorkplanApprovalDetail from '../pages/Workplan/WorkplanApprovalDetail';
import WorkplanCC from '../pages/Workplan/WorkplanCC';
import SuperBanner from '../pages/SuperAdmin/Banner';
import TrxPermintaanBarang from '../pages/PermintaanBarang/TrxPermintaanBarang';

const Routes = () => {
  const { token, user } = useAuth();

  // cek akses
  const hasRequestBarangAkses = token ? cekAkses('#2') : null;
  const hasTrxBarangAkses = token ? cekAkses('#13') : null;
  const hasMasterBarangAkses = token ? cekAkses('#9') : null;
  const hasPengumumanAkses = token ? cekAkses('#3') : null;
  const isAdminPB = token ? cekAkses('#7') : null;

  // TITLE
  const TITLE = 'OMDC - ';

  // types
  type routesTypes = {
    path: string;
    element: ReactElement;
    children?: childRoute[];
  };

  type childRoute = {
    path: string;
    element: ReactElement;
  };

  // routes for authenticated user
  const routesForAuthenticated: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: (
            <>
              <PageTitle title={TITLE + 'Reimbursement'} />
              <Reimbursement />
            </>
          ),
        },
        {
          path: '/report-reimbursement',
          element: (
            <>
              <PageTitle title={TITLE + 'Reimbursement'} />
              <SuperReimbursement />
            </>
          ),
        },
        {
          path: '/report-reimbursement/create',
          element: (
            <>
              <PageTitle title={TITLE + 'Report Reimbursement'} />
              <ReportReimbursement />
            </>
          ),
        },
        {
          path: '/reimbursement/ajukan',
          element: (
            <>
              <PageTitle title={TITLE + 'Buat Pengajuan'} />
              <BuatPengajuan />
            </>
          ),
        },
        {
          path: '/reimbursement/ajukan-ulang',
          element: (
            <>
              <PageTitle title={TITLE + 'Buat Pengajuan'} />
              <BuatPengajuanUlang />
            </>
          ),
        },
        {
          path: '/reimbursement/:id/report',
          element: (
            <>
              <PageTitle title={TITLE + 'Buat Report Realisasi'} />
              <BuatReport />
            </>
          ),
        },
        {
          path: '/reimbursement/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Detail Pengajuan'} />
              <DetailPengajuan />
            </>
          ),
        },
        {
          path: '/reimbursement/:id/download',
          element: (
            <>
              <PageTitle title={TITLE + 'Download Report'} />
              <DownloadReport />
            </>
          ),
        },
        {
          path: '/rop-attachment',
          element: (
            <>
              <PageTitle title={TITLE + 'Reimbursement'} />
              <ManualUploadFile />
            </>
          ),
        },

        // -- Work in Progress PATH
        {
          path: '/workplan/me/:status',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <WorkplanSaya />
            </>
          ),
        },
        {
          path: '/workplan/cc',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <WorkplanCC />
            </>
          ),
        },
        {
          path: '/workplan/pengajuan',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <BuatWorkplan />
            </>
          ),
        },
        {
          path: '/workplan/pengajuan/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <WorkplanDetail />
            </>
          ),
        },
        {
          path: '/workplan/approval/:status',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <WorkplanApproval />
            </>
          ),
        },
        {
          path: '/workplan/pengajuan/admin/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Work in Progress'} />
              <WorkplanApprovalDetail />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForAuthenticatedAdmin: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/reimbursement/admin/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Detail Pengajuan'} />
              <AdminDetailPengajuan />
            </>
          ),
        },
        {
          path: '/reimbursement/diajukan/:statusType',
          element: (
            <>
              <PageTitle title={TITLE + 'Pengajuan'} />
              <RiwayatDiajukan />
            </>
          ),
        },
        {
          path: '/reimbursement/remark-ca',
          element: (
            <>
              <PageTitle title={TITLE + 'Pengajuan'} />
              <RemarkCA />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // auth for un authenticated user
  const routesForUnAuth: routesTypes[] = [
    {
      path: '/login',
      element: (
        <>
          <PageTitle title={TITLE + 'Login'} />
          <SignIn />
        </>
      ),
    },
    {
      path: '/login-profile',
      element: (
        <>
          <PageTitle title={TITLE + 'Login'} />
          <SignInProfile />
        </>
      ),
    },
    {
      path: '/about',
      element: (
        <>
          <PageTitle title={TITLE + 'About Us'} />
          <AboutUs />
        </>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ];

  // routes for authenticated user
  const routesForPublic: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/change-password',
          element: (
            <>
              <PageTitle title={TITLE + 'Ubah Password'} />
              <ChangePassword />
            </>
          ),
        },
        {
          path: '/update-user',
          element: (
            <>
              <PageTitle title={TITLE + 'Ubah Profile'} />
              <UpdateProfile />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForAdminPB: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/admin-request-barang',
          element: (
            <>
              <PageTitle title={TITLE + 'Approval Permintaan Barang'} />
              <PermintaanBarangApproval />
            </>
          ),
        },
        {
          path: '/admin-request-barang/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Approval Permintaan Barang'} />
              <DetailPermintaanBarangAdmin />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForPermintaanBarang: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/request-barang',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <PermintaanBarang />
            </>
          ),
        },
        {
          path: '/barang',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <ListBarang />
            </>
          ),
        },
        {
          path: '/request-barang/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <DetailPermintaanBarang />
            </>
          ),
        },
        {
          path: '/request-barang/:id/report',
          element: (
            <>
              <PageTitle title={TITLE + 'Report Permintaan Barang'} />
              <ReportPermintaanBarang />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForTrxPermintaanBarang: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/barang-request/:type',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <TrxPermintaanBarang />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForMasterBarang: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/master-barang',
          element: (
            <>
              <PageTitle title={TITLE + 'Master Barang'} />
              <ListMasterBarang />
            </>
          ),
        },
        {
          path: '/master-barang/add',
          element: (
            <>
              <PageTitle title={TITLE + 'Add Master Barang'} />
              <ListMasterBarangInput />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for authenticated user
  const routesForPengumuman: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/pengumuman',
          element: (
            <>
              <PageTitle title={TITLE + 'Pengumuman'} />
              <Pengumuman />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  // routes for super admin
  const routesForSuperAdmin: routesTypes[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: (
            <>
              <PageTitle title={TITLE + 'SuperAdmin'} />
              <SuperAdmin />
            </>
          ),
        },
        {
          path: '/adminpb',
          element: (
            <>
              <PageTitle title={TITLE + 'Admin PB'} />
              <AdminPB />
            </>
          ),
        },
        {
          path: '/reimbursement',
          element: (
            <>
              <PageTitle title={TITLE + 'Reimbursement'} />
              <SuperReimbursement />
            </>
          ),
        },
        {
          path: '/rop-attachment',
          element: (
            <>
              <PageTitle title={TITLE + 'Reimbursement'} />
              <ManualUploadFile />
            </>
          ),
        },
        {
          path: '/report-reimbursement/create',
          element: (
            <>
              <PageTitle title={TITLE + 'Report Reimbursement'} />
              <ReportReimbursement />
            </>
          ),
        },
        {
          path: '/reimbursement/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Detail Pengajuan'} />
              <DetailReimbursement />
            </>
          ),
        },
        {
          path: '/departemen',
          element: (
            <>
              <PageTitle title={TITLE + 'Departemen'} />
              <Departemen />
            </>
          ),
        },
        {
          path: '/coa',
          element: (
            <>
              <PageTitle title={TITLE + 'SuperAdmin'} />
              <SuperCOA />
            </>
          ),
        },
        {
          path: '/coa/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'COA'} />
              <SuperCOAUpdate />
            </>
          ),
        },
        {
          path: '/request-barang',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <PermintaanBarangAdmin />
            </>
          ),
        },
        {
          path: '/request-barang/:id',
          element: (
            <>
              <PageTitle title={TITLE + 'Permintaan Barang'} />
              <DetailPermintaanBarang />
            </>
          ),
        },
        {
          path: '/icon',
          element: (
            <>
              <PageTitle title={TITLE + 'Icon'} />
              <SuperIcon />
            </>
          ),
        },
        {
          path: '/banner',
          element: (
            <>
              <PageTitle title={TITLE + 'Banner'} />
              <SuperBanner />
            </>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  const router = createBrowserRouter([
    ...(!token ? routesForUnAuth : []),
    ...routesForAuthenticated,
    ...(token && user?.isAdmin == true ? routesForAuthenticatedAdmin : []),
    ...routesForPublic,
    ...(hasRequestBarangAkses ? routesForPermintaanBarang : []),
    ...(hasTrxBarangAkses ? routesForTrxPermintaanBarang : []),
    ...(hasMasterBarangAkses ? routesForMasterBarang : []),
    ...(hasPengumumanAkses ? routesForPengumuman : []),
    ...(isAdminPB ? routesForAdminPB : []),
  ]);

  const routerSa = createBrowserRouter([
    ...(!token ? routesForUnAuth : []),
    ...routesForSuperAdmin,
  ]);

  return (
    <RouterProvider
      router={user && user?.type == 'SUPERADMIN' ? routerSa : router}
    />
  );
};

export default Routes;
