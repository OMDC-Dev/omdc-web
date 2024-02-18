import { ReactElement } from 'react';
import PageTitle from '../components/PageTitle';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import Calendar from '../pages/Calendar';
import Reimbursement from '../pages/Dashboard/Reimbursement';
import RiwayatPengajuan from '../pages/Dashboard/RiwayatPengajuan';
import SignIn from '../pages/Authentication/SignIn';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignInProfile from '../pages/Authentication/SignInProfile';
import BuatPengajuan from '../pages/Dashboard/BuatPengajuan';

const Routes = () => {
  const { token } = useAuth();

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
  ];

  const router = createBrowserRouter([
    ...(!token ? routesForUnAuth : []),
    ...routesForAuthenticated,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
