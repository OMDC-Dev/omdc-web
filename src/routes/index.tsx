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

const Routes = () => {
  const { token, user } = useAuth();

  // cek akses
  const hasRequestBarangAkses = token ? cekAkses('#2') : null;
  const hasPengumumanAkses = token ? cekAkses('#3') : null;

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
          path: '/reimbursement/ajukan',
          element: (
            <>
              <PageTitle title={TITLE + 'Buat Pengajuan'} />
              <BuatPengajuan />
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
          path: '/reimbursement/diajukan',
          element: (
            <>
              <PageTitle title={TITLE + 'Pengajuan'} />
              <RiwayatDiajukan />
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
          path: '/reimbursement',
          element: (
            <>
              <PageTitle title={TITLE + 'SuperAdmin'} />
              <SuperReimbursement />
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
              <PageTitle title={TITLE + 'SuperAdmin'} />
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
    ...(hasPengumumanAkses ? routesForPengumuman : []),
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
