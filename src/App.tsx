import { useEffect, useState } from 'react';

import Loader from './common/Loader';
import Routes from './routes';
import AuthProvider from './hooks/useAuth';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [pathname]);

  useEffect(() => {
    const className = 'dark';
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
    </AuthProvider>
  );
}

export default App;
