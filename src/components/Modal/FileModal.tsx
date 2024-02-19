import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@material-tailwind/react';

const FileModal = ({
  visible,
  toggle,
  type,
  data,
}: {
  visible: boolean;
  toggle: any;
  type?: string;
  data?: string;
}) => {
  const dataType = `data:${type};base64,${data}`;

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 p-4 w-full h-full">
        <div className=" flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className=" flex-1">Preview</div>
          <XMarkIcon className=" w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        <div className=" w-full h-full">
          <img
            className="w-full max-h-115 object-cover object-center"
            src={dataType}
            alt="preview image"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default FileModal;
