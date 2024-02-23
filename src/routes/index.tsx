import { ReactElement } from 'react';
import PageTitle from '../components/PageTitle';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import Reimbursement from '../pages/Dashboard/Reimbursement';
import RiwayatPengajuan from '../pages/Dashboard/RiwayatPengajuan';
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

const Routes = () => {
  const { token, user } = useAuth();

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
          path: '/reimbursement/riwayat',
          element: (
            <>
              <PageTitle title={TITLE + 'Riwayat Pengajuan'} />
              <RiwayatPengajuan />
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
          path: '/departemen',
          element: (
            <>
              <PageTitle title={TITLE + 'Departemen'} />
              <Departemen />
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
    ...routesForPermintaanBarang,
    ...routesForPengumuman,
  ]);

  const routerSa = createBrowserRouter([
    ...(!token ? routesForUnAuth : []),
    ...routesForSuperAdmin,
  ]);

  return (
    <RouterProvider router={user.type == 'SUPERADMIN' ? routerSa : router} />
  );
};

export default Routes;
