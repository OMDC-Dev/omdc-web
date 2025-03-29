import { Button } from '@material-tailwind/react';
import * as React from 'react';
import { BANNER } from '../../api/routes';
import { compressImage } from '../../common/utils';
import { ContainerCard } from '../../components/ContainerCard';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import DefaultLayout from '../../layout/DefaultLayout';

function SuperBanner() {
  const [banner, setBanner] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = React.useState<any>();
  const [focused, setFocused] = React.useState<any>();

  // === Modal
  const {
    show,
    hide,
    toggle,
    changeType,
    visible,
    type,
    context,
    changeContext,
  } = useModal();

  React.useEffect(() => {
    getBanner();
  }, []);

  async function getBanner() {
    changeType('LOADING');
    show();

    const { state, data, error } = await useFetch({
      url: BANNER,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      hide();
      setBanner(data);
    } else {
      hide();
    }
  }

  async function uploadBanner() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: BANNER,
      method: 'POST',
      data: {
        image: selectedBanner,
      },
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setSelectedBanner(null);
    } else {
      changeType('FAILED');
    }
  }

  async function deleteBanner() {
    changeType('LOADING');
    const { state, data, error } = await useFetch({
      url: BANNER + `/${focused.id}`,
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setFocused(null);
      getBanner();
    } else {
      changeType('FAILED');
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

      setSelectedBanner(splitted[1]);

      // if (type == 'web') {
      //   setIcon({ ...icon, icon: splitted[1] });
      // } else {
      //   setIcon({ ...icon, iconMobile: splitted[1] });
      // }
    };
  }

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2">
        <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Banner</h3>
          </div>
          <div className=" p-6.5 flex flex-col gap-y-8">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Tambahkan banner baru
              </label>
              {/* <img
              className="h-32 w-32 object-contain m-4"
              src={`data:image/png;base64,${icon?.icon}`}
              alt="icon-web"
            /> */}
              <input
                type="file"
                className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                accept=".pdf,image/*"
                onChange={(e) => handleAttachment(e, 'web')}
              />

              <div className=" text-sm text-blue-gray-400 my-4">
                Unggah banner ( rekomendasi 16:9 )
              </div>
            </div>
            <div className=" w-full">
              <Button
                fullWidth
                color="blue"
                onClick={(e: any) => {
                  e.preventDefault();
                  changeType('CONFIRM');
                  changeContext('UPLOAD');
                  toggle();
                }}
              >
                Unggah
              </Button>
            </div>
          </div>
        </div>

        <ContainerCard title="Banner Aktif">
          {banner.map((item: any, index: number) => {
            return (
              <div className="flex flex-col items-center mx-8 my-4">
                <div className="h-36 w-full bg-blue-gray-300 m-4 rounded-lg">
                  <img
                    className="h-36 w-full object-cover"
                    src={item.banner}
                    alt="icon-web"
                  />
                </div>

                <Button
                  fullWidth
                  color={'red'}
                  onClick={() => {
                    changeType('CONFIRM');
                    setFocused(item);
                    changeContext('DELETE');
                    show();
                  }}
                >
                  Hapus
                </Button>
              </div>
            );
          })}
        </ContainerCard>
      </div>

      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => {
          if (context == 'UPLOAD') {
            uploadBanner();
          } else {
            deleteBanner();
          }
        }}
      />
    </DefaultLayout>
  );
}

export default SuperBanner;
