import { useEffect, useState } from 'react';

import Loader from './common/Loader';
import Routes from './routes';
import AuthProvider from './hooks/useAuth';
import NotifModal from './components/Modal/NotifModal';
import useNotif from './store/useNotif';
import CacheBuster from 'react-cache-buster';
import { version } from '../package.json';

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
  return (
    <CacheBuster
      currentVersion={version}
      isEnabled={true} //If false, the library is disabled.
      isVerboseMode={false} //If true, the library writes verbose logs to console.
      loadingComponent={<Loader />} //If not pass, nothing appears at the time of new version check.
      metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
    >
      <MainApp />
    </CacheBuster>
  );
}

export default App;
