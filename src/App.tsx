import { useEffect, useState } from 'react';

import Loader from './common/Loader';
import Routes from './routes';
import AuthProvider from './hooks/useAuth';
import NotifModal from './components/Modal/NotifModal';
import useNotif from './store/useNotif';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { visible, toggle, data } = useNotif();
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [pathname]);

  useEffect(() => {
    const className = 'light';
    const bodyClass = window.document.body.classList;

    bodyClass.add(className);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes />
      <NotifModal data={data} visible={visible} toggle={toggle} />
    </AuthProvider>
  );
}

export default App;
