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
  data: string;
}) => {
  function isImageUrl(str: string) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    return urlPattern.test(str);
  }

  const dataType = isImageUrl(data) ? data : `data:${type};base64,${data}`;

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-lg border border-stroke bg-white shadow-default p-4 w-full max-h-[calc(100vh-4rem)] flex flex-col">
        {' '}
        {/* Use flex and column direction */}
        <div className="flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className="flex-1">Preview</div>
          <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        {/* Make the following div take remaining space and allow overflow */}
        <div className="flex-1 overflow-auto">
          <img
            className="w-full h-full object-contain object-center"
            src={dataType}
            alt="preview image"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default FileModal;
