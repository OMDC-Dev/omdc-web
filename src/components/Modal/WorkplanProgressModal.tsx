import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Dialog } from '@material-tailwind/react';
import React from 'react';
import useFetch from '../../hooks/useFetch';
import { WORKPLAN_PROGRESS } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';

const WorkplanProgressModal = ({
  visible,
  toggle,
  data,
  onSuccess,
  selected,
}: {
  visible: boolean;
  toggle: any;
  data: any;
  onSuccess: any;
  selected: any;
}) => {
  const [progress, setProgress] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const WP_ID = data?.id;

  async function saveProgress() {
    setIsLoading(true);
    setErrorMessage('');

    const { state, data, error } = await useFetch({
      url: WORKPLAN_PROGRESS(WP_ID),
      method: 'POST',
      data: {
        progress: progress,
      },
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      toggle();
      onSuccess ? onSuccess() : null;
    } else {
      setIsLoading(false);
      setErrorMessage('Gagal menyimpan progress, silahkan coba lagi!');
    }
  }

  async function deleteProgress() {
    setIsLoading(true);
    setErrorMessage('');

    const { state, data, error } = await useFetch({
      url: WORKPLAN_PROGRESS(selected?.id),
      method: 'DELETE',
      data: {
        wp_id: WP_ID,
      },
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      toggle();
      onSuccess ? onSuccess() : null;
    } else {
      setIsLoading(false);
      setErrorMessage('Gagal menghapus progress, silahkan coba lagi!');
    }
  }

  async function updateProgress() {
    setIsLoading(true);
    setErrorMessage('');

    const { state, data, error } = await useFetch({
      url: WORKPLAN_PROGRESS(selected?.id),
      data: {
        progress: progress,
        wp_id: WP_ID,
      },
      method: 'PUT',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      toggle();
      onSuccess ? onSuccess() : null;
    } else {
      setIsLoading(false);
      setErrorMessage('Gagal mengupdate progress, silahkan coba lagi!');
    }
  }

  React.useEffect(() => {
    if (visible) {
      setErrorMessage('');
      setProgress(selected?.progress ?? '');
    }
  }, [visible]);

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-lg border border-stroke bg-white shadow-default p-4 w-full max-h-[calc(100vh-4rem)] flex flex-col">
        {' '}
        {/* Use flex and column direction */}
        <div className="flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className="flex-1">
            {selected ? 'Edit Progress' : 'Tambah Progress'}
          </div>
          <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        {/* Make the following div take remaining space and allow overflow */}
        <div className="flex-1 overflow-auto">
          <p className="text-xs mb-2.5">
            Perubahan progress akan otomatis disimpan
          </p>
          <div className="w-full">
            <textarea
              rows={6}
              disabled={isLoading}
              placeholder="Masukan Detail Progress"
              className="w-full rounded border-[1.5px] h-[72px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            ></textarea>
          </div>
          {errorMessage.length > 0 && (
            <p className="text-xs text-red-400 mt-2">{errorMessage}</p>
          )}
          <div className=" mt-4.5 flex flex-row gap-4">
            <Button
              loading={isLoading}
              fullWidth
              color="blue"
              size={'sm'}
              className="normal-case"
              onClick={() => (selected ? updateProgress() : saveProgress())}
            >
              Simpan
            </Button>

            {selected && (
              <Button
                loading={isLoading}
                fullWidth
                variant={'outlined'}
                color={'red'}
                size={'sm'}
                className="normal-case"
                onClick={() => deleteProgress()}
              >
                Hapus
              </Button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WorkplanProgressModal;
