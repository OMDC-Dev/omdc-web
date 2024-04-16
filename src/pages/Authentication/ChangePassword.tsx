import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/logo-tp.png';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import useFetch from '../../hooks/useFetch';
import { UPDATE_PASSWORD } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const ChangePassword: React.FC = () => {
  const [password, setPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [newPasswordInvalid, setNewPasswordInvalid] =
    React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  // dialog
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [dialogType, setDialogType] = React.useState('OK');

  const { toggle, visible, hide, show } = useModal();

  const { setToken } = useAuth();

  // navigation
  const navigate = useNavigate();

  // Clear Error on change
  React.useEffect(() => {
    if (newPasswordInvalid) {
      setNewPasswordInvalid('');
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  }, [password, newPassword, confirmPassword]);

  // On Submit
  async function onSubmit(e: any) {
    show();
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      hide();
      setNewPasswordInvalid(
        'Password baru tidak sesuai, mohon periksa kembali!',
      );
      return;
    }

    if (newPassword.length < 6) {
      hide();
      setNewPasswordInvalid('Password harus terdiri dari minimal 6 karakter.');
      return;
    }

    const body = {
      lastPassword: password,
      newPassword: confirmPassword,
    };

    const { state, data, error } = await useFetch({
      url: UPDATE_PASSWORD,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setDialogType('OK');
      hide();
      setShowDialog(!showDialog);
    } else {
      console.log(error);

      setErrorMessage(error);
      setDialogType('ERROR');
      hide();
      setShowDialog(!showDialog);
    }
  }

  // on logout
  function onLogout() {
    setToken();
    navigate('/', { replace: true });
  }

  return (
    <div className=" bg-white h-[100dvh] flex flex-col justify-center">
      <div className=" xl:grid xl:place-items-center  rounded-sm bg-white">
        <div className="flex flex-wrap items-center">
          <div className=" grid min-h-screen w-full place-items-center">
            <div>
              <div className="grid place-items-center p-4 mb-4">
                <div className=" mb-4">
                  <img
                    className="block h-20 w-20 object-contain"
                    src={Logo}
                    alt="Logo"
                  />
                </div>
                <h2 className="text-xl font-medium text-black dark:text-white">
                  Ubah Password
                </h2>
              </div>

              <div className="w-96 rounded-md bg-white p-6 shadow-lg">
                <form>
                  <div className="mb-4">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Password Lama
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Masukan Password Lama"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Masukan Password Baru"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Konfirmasi Password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {newPasswordInvalid ? (
                      <div className=" my-2 text-sm text-red-400">
                        {newPasswordInvalid}
                      </div>
                    ) : null}
                  </div>
                </form>
                <div className="mb-4">
                  <Button
                    disabled={!password || !newPassword || !confirmPassword}
                    onClick={onSubmit}
                  >
                    Ubah Password
                  </Button>
                </div>

                {errorMessage ? (
                  <div className=" text-center mt-6 text-sm text-red-400">
                    {errorMessage}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Modal visible={visible} toggle={toggle} dismissOnBackdrop />
        <Dialog
          open={showDialog}
          size={'xs'}
          handler={() => setShowDialog(!showDialog)}
          dismiss={{ enabled: false }}
        >
          <DialogHeader>{dialogType == 'OK' ? 'Sukses' : 'Gagal'}</DialogHeader>
          <DialogBody>
            {dialogType == 'OK'
              ? 'Sukes mengganti password, silahkan login ulang dengan password yang baru!'
              : 'Gagal mengubah password, mohon coba lagi!'}
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                setShowDialog(!showDialog);
                dialogType == 'OK' ? onLogout() : null;
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export default ChangePassword;
