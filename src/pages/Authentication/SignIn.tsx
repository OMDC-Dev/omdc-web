import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/logo-tp.png';
import HeroAuth from '../../images/hero/AuthHero';
import useFetch from '../../hooks/useFetch';
import { GET_ICON, LOGIN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import ADMIN_DATA from '../../common/files/admin.json';

const SignIn: React.FC = () => {
  const [userId, setUserId] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | any>('');
  const { toggle, visible, hide, show } = useModal();
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  function onUserIdChange(event: any) {
    setUserId(event.target.value);
  }

  function onPasswordChange(event: any) {
    setPassword(event.target.value);
  }

  async function onSubmit(e: any) {
    e.preventDefault();

    // super admin acc
    if (userId == 'SA' && password == '1a2b3c4d') {
      setToken(ADMIN_DATA.userToken);
      setUser(ADMIN_DATA);
      navigate('/', { replace: true });
      return;
    }

    show();

    setErrorMessage(null);

    const body = {
      iduser: userId,
      password: password,
    };

    const { state, data, error } = await useFetch({
      url: LOGIN,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      hide();

      if (data.isProfileComplete) {
        setToken(data.userToken);
        setUser(data);
        navigate('/', { replace: true });
      } else {
        navigate('/login-profile', { replace: false, state: data });
      }
    } else {
      hide();
      setErrorMessage(error);
    }
  }

  const [icon, setIcon] = React.useState<any>({ icon: '', iconMobile: '' });

  React.useEffect(() => {
    getIcon();
  }, []);

  async function getIcon() {
    const { state, data, error } = await useFetch({
      url: GET_ICON,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIcon(data);
    } else {
      setIcon(null);
    }
  }

  return (
    <div className=" bg-white h-[100dvh] flex flex-col justify-center">
      <div className=" xl:grid xl:place-items-center  rounded-sm bg-white dark:bg-white">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img
                  className="block h-20 w-20 object-contain"
                  src={`data:image/png;base64,${icon.icon}`}
                  alt="Logo"
                />
              </Link>

              <p className="2xl:px-20">Aplikasi untuk kemudahan bertransaksi</p>

              <span className="mt-15 inline-block">
                <HeroAuth />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 hidden xl:block ">
            <div className="w-full p-4 hidden sm:block md:p-24 sm:p-32 xl:p-20.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Masuk ke OMDC App
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Masukan user ID"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={userId}
                      onChange={onUserIdChange}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Masukan Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={password}
                      onChange={onPasswordChange}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    onClick={onSubmit}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                  >
                    Masuk
                  </button>
                </div>
                {errorMessage && (
                  <div className=" grid place-items-center text-sm text-red-400">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className=" grid min-h-screen w-full place-items-center xl:hidden">
            <div>
              <div className="grid place-items-center p-4 mb-4">
                <div className=" mb-4">
                  <img
                    className="block h-20 w-20 object-contain"
                    src={`data:image/png;base64,${icon.icon}`}
                    alt="Logo"
                  />
                </div>
                <h2 className="text-xl font-medium text-black dark:text-white">
                  Masuk ke OMDC App
                </h2>
              </div>

              <div className="w-96 rounded-md bg-white p-6 shadow-lg">
                <form>
                  <div className="mb-4">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      User ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Masukan user ID"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={userId}
                        onChange={onUserIdChange}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Masukan Password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={password}
                        onChange={onPasswordChange}
                      />
                    </div>
                  </div>
                </form>
                <div className="mb-4">
                  <Button onClick={onSubmit}>Masuk</Button>
                </div>
                {errorMessage && (
                  <div className=" grid place-items-center text-sm text-red-400">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal visible={visible} toggle={toggle} dismissOnBackdrop />
      </div>
    </div>
  );
};

export default SignIn;
