import { ReactElement } from 'react';
import PageTitle from '../components/PageTitle';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import Calendar from '../pages/Calendar';
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
        {
          path: '/calendar',
          element: (
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
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

  const router = createBrowserRouter([
    ...(!token ? routesForUnAuth : []),
    ...routesForAuthenticated,
    ...(token && user?.isAdmin == true ? routesForAuthenticatedAdmin : []),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
