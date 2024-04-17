import * as React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { DEPT, GET_ICON, UPDATE_ICON } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { compressImage } from '../../common/utils';

function SuperIcon() {
  const [icon, setIcon] = React.useState<any>({ icon: '', iconMobile: '' });
  const [loading, setLoading] = React.useState<boolean>(false);

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [context, setContext] = React.useState<string>();

  React.useEffect(() => {
    getIcon();
  }, []);

  async function getIcon() {
    setLoading(true);
    const { state, data, error } = await useFetch({
      url: GET_ICON,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setIcon(data);
    } else {
      setLoading(false);
      setIcon(null);
    }
  }

  async function uploadIcon() {
    setLoading(true);
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: UPDATE_ICON,
      method: 'POST',
      data: icon,
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      toggle();
      alert(
        'Icon berhasil dirubah silahkan reload untuk menerapkan perubahan!',
      );
    } else {
      toggle();
      setLoading(false);
      alert(error);
    }
  }

  // handle attachment
  function handleAttachment(event: any, type: string) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 1048576;

    if (file.size > maxSize) {
      console.log('NEED COMPRESS');
      if (file.type.includes('image')) {
        compressImage(file, maxSize, handleAttachment);
        return; // Menghentikan eksekusi lebih lanjut
      } else {
        // Memeriksa apakah ukuran file melebihi batas maksimum (1 MB)
        alert(
          'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 1 MB.',
        );
        event.target.value = null; // Mengosongkan input file
        return;
      }
    } else {
      console.log('AMAN');
    }

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64string: any = reader.result;

      const splitted = base64string?.split(';base64,');

      if (type == 'web') {
        setIcon({ ...icon, icon: splitted[1] });
      } else {
        setIcon({ ...icon, iconMobile: splitted[1] });
      }
    };
  }

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Ganti Icon</h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-8">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Icon Web
            </label>
            <img
              className="h-32 w-32 object-contain m-4"
              src={`data:image/png;base64,${icon.icon}`}
              alt="icon-web"
            />
            <input
              type="file"
              className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              accept=".pdf,image/*"
              onChange={(e) => handleAttachment(e, 'web')}
            />
            <div className=" text-sm text-blue-gray-400 my-4">
              Unggah icon untuk mengganti ( rekomendasi 24px x 24px)
            </div>
          </div>
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Icon Mobile
            </label>
            <img
              className="h-32 w-32 object-contain m-4"
              src={`data:image/png;base64,${icon.iconMobile}`}
              alt="icon-web"
            />
            <input
              type="file"
              className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              accept=".pdf,image/*"
              onChange={(e) => handleAttachment(e, 'mobile')}
            />
            <div className=" text-sm text-blue-gray-400 my-4">
              Unggah icon untuk mengganti ( rekomendasi 24px x 24px)
            </div>
          </div>
          <div className=" w-full">
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                toggle();
              }}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>

      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => uploadIcon()}
      />
    </DefaultLayout>
  );
}

export default SuperIcon;
