import { useEffect, useState } from 'react';

import Loader from './common/Loader';
import Routes from './routes';
import AuthProvider from './hooks/useAuth';
import NotifModal from './components/Modal/NotifModal';
import useNotif from './store/useNotif';
import withClearCache from './ClearCache';

function MainApp() {
  const [loading, setLoading] = useState<boolean>(true);
  const { visible, toggle, data } = useNotif();

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

function App() {
  const ClearCacheComponent = withClearCache(MainApp);

  return <ClearCacheComponent />;
}

export default App;
