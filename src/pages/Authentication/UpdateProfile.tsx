import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/logo-tp.png';
import useFetch from '../../hooks/useFetch';
import { GET_ICON, LOGIN, USER_COMPLETE } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import DeptGroup from '../../components/SelectGroup/DeptGroup';

const UpdateProfile: React.FC = () => {
  const [errorMessage, setErrorMessage] = React.useState<string | any>('');
  const { toggle, visible, hide, show } = useModal();
  const { setToken, setUser, user } = useAuth();

  const USER_S = user;

  // state
  const [nomorWa, setNomorWa] = React.useState<string>(USER_S?.nomorwa);
  const [dept, setDept] = React.useState<string>('');

  const navigate = useNavigate();

  function onNomorWaChange(event: any) {
    setNomorWa(event.target.value);
  }

  async function onSubmit(e: any) {
    e.preventDefault();

    // modal and error
    show();
    setErrorMessage(null);

    const body = {
      nomorwa: nomorWa,
      departemen: dept,
    };

    const { state, data, error } = await useFetch({
      url: USER_COMPLETE + `/${USER_S.iduser}`,
      method: 'POST',
      data: body,
      headers: {
        Authorization: `Bearer ${USER_S.userToken}`,
      },
    });

    if (state == API_STATES.OK) {
      setToken(USER_S.userToken);
      setUser({ ...USER_S, nomorwa: nomorWa, departemen: dept });
      hide();
      navigate('/', { replace: true });
    } else {
      hide();
      setErrorMessage(error.error);
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
    <>
      <div className=" xl:grid xl:place-items-center h-full sm:h-[100dvh] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div>
          <div className=" grid min-h-screen w-full place-items-center">
            <div>
              <div className="grid place-items-center p-4 mb-4">
                <div className=" mb-4">
                  <img
                    className="block h-40 w-40 object-contain"
                    src={`data:image/png;base64,${icon.icon}`}
                    alt="Logo"
                  />
                </div>
                <h2 className="text-xl font-medium text-black dark:text-white">
                  Ubah Profile
                </h2>
              </div>

              <div className="w-96 rounded-md bg-white p-6 shadow-lg">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-4">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Masukan Nomor WA"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={nomorWa}
                        onChange={onNomorWaChange}
                        pattern="[0-9]{10,15}"
                        title="Nomor telepon harus terdiri dari 10 hingga 15 digit angka."
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <DeptGroup
                      onChange={(e: any) => setDept(e.target.value)}
                      value={dept}
                    />
                  </div>
                </form>
                <div className="mb-4">
                  <Button
                    disabled={visible || !nomorWa || !dept}
                    onClick={onSubmit}
                  >
                    Selesai
                  </Button>
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
    </>
  );
};

export default UpdateProfile;
