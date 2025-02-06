import * as React from 'react';
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button as MButton,
  CardFooter,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import DefaultLayout from '../../layout/DefaultLayout';
import useFetch from '../../hooks/useFetch';
import { DEPT, REIMBURSEMENT_REUPLOAD_FILE_BY_DOC } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useModal from '../../hooks/useModal';
import ModalSelector from '../../components/Modal/ModalSelctor';
import { compressImage } from '../../common/utils';

function ManualUploadFile() {
  // === Pengumuman
  const [nomor, setNomor] = React.useState<string>('');
  const [result, setResult] = React.useState<any>();
  const [fileInfo, setFileInfo] = React.useState<any>();

  // === Modal
  const { show, hide, toggle, changeType, visible, type } = useModal();
  const [context, setContext] = React.useState<string>();

  // === Navigate
  const navigate = useNavigate();

  // handle attachment
  function handleAttachment(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 10485760;

    // handle file type
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (file.size > maxSize) {
      console.log('NEED COMPRESS');
      if (file.type.includes('image')) {
        compressImage(file, maxSize, handleAttachment);
        return; // Menghentikan eksekusi lebih lanjut
      } else {
        // Memeriksa apakah ukuran file melebihi batas maksimum (1 MB)
        alert(
          'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 10 MB.',
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

      setResult(splitted[1]);
    };

    setFileInfo(fileInfo);
  }

  async function onUploadFile() {
    changeType('LOADING');

    const body = {
      file: fileInfo,
      attachment: result,
    };

    const { state, data, error } = await useFetch({
      url: REIMBURSEMENT_REUPLOAD_FILE_BY_DOC(nomor),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
      setResult('');
      setFileInfo({});
      setNomor('');
    } else {
      changeType('FAILED');
    }
  }

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Upload Manual Attachment ROP
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              No. Dokumen R.O.P
            </label>
            <input
              type="text"
              placeholder="Masukan Nomor Dokumen ( RR-XXX-XXX-XXX )"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setNomor(e.target.value)}
              value={nomor}
            />
          </div>
          <div className="w-full">
            <label className="mb-3 block text-black dark:text-white">
              Lampirkan File ( hanya PDF, maks. 10MB)
            </label>
            <input
              type="file"
              className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              accept={/*".pdf,image/*"*/ '.pdf'}
              onChange={handleAttachment}
            />
          </div>
          <div className=" w-full">
            <Button
              disabled={!nomor || !fileInfo}
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                setContext('UPLOAD');
                toggle();
              }}
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => onUploadFile()}
      />
    </DefaultLayout>
  );
}

export default ManualUploadFile;
