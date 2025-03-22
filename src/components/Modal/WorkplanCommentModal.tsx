import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Dialog } from '@material-tailwind/react';
import React from 'react';
import FileModal from './FileModal';

const CommentCard = () => {
  return (
    <div className="flex flex-row gap-2 items-start bg-white p-2 rounded-lg">
      <div className="min-w-5 min-h-5 rounded-full bg-red-500 flex justify-center items-center text-xs text-white">
        P
      </div>
      <div>
        <p className="text-xs font-semibold text-black">Bos Q</p>
        <p className="text-sm text-black font-normal text-wrap">
          lorem ipsum dolor sit amet uhuyy bla bla yuhuggg weww rewrrr, ini
          misal komentarnya panjang uhuyy hehehe waw wadiaw ini panjang banget
          si hahahaha test lagi rawrr
        </p>
        <div className="hover:cursor-pointer flex mt-2.5 w-fit items-center gap-2 bg-white px-2 py-1 rounded-md border border-blue-gray-50">
          <PhotoIcon className="h-5 w-5 text-blue-gray-200" />
          <span className="text-sm text-gray-700 truncate max-w-[180px]">
            Lampiran
          </span>
        </div>
      </div>
    </div>
  );
};

const ImagePlaceholder = ({
  imageUrl,
  onClick,
}: {
  imageUrl?: string;
  onClick: any;
}) => {
  return (
    <div className="w-[50%] flex flex-col gap-y-2 items-center">
      {imageUrl ? (
        <img
          onClick={onClick}
          src={imageUrl}
          className="hover:cursor-pointer w-full h-72 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-2 flex flex-col gap-y-2 items-center justify-center rounded-lg">
          <PhotoIcon className="h-10 w-10 text-blue-gray-200" />
          <div className="text-xs text-blue-gray-200">
            Tidak ada gambar diunggah
          </div>
        </div>
      )}
      <div className="text-xs text-blue-gray-500">Gambar Awal</div>
    </div>
  );
};

const WorkplanCommentModal = ({
  visible,
  toggle,
  data,
}: {
  visible: boolean;
  toggle: any;
  data: any;
}) => {
  const [showImage, setShowImage] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<any>('');
  const [showPreview, setShowPreview] = React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog className="bg-transparent" open={visible} handler={toggle}>
      <div className="rounded-lg border border-stroke bg-white shadow-default p-4 w-full max-h-[calc(100vh-4rem)] flex flex-col">
        {' '}
        {/* Use flex and column direction */}
        <div className="flex flex-row items-center border-b border-blue-gray-800 py-2 mb-4.5">
          <div className="flex-1">Komentar</div>
          <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={toggle} />
        </div>
        {/* Make the following div take remaining space and allow overflow */}
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {/* Media Section */}
          <div className="flex flex-row justify-end">
            <Button
              onClick={() => setShowImage(!showImage)}
              className="normal-case"
              variant={'text'}
              color="blue"
            >
              {showImage ? 'Sembunyikan Lampiran' : 'Tampilkan Lampiran'}
            </Button>
          </div>
          {showImage && (
            <div className="flex flex-row gap-4">
              <ImagePlaceholder
                onClick={() => {
                  setPreviewUrl(data?.attachment_before);
                  setShowPreview(true);
                }}
                imageUrl={data?.attachment_before}
              />

              <ImagePlaceholder
                onClick={() => {
                  setPreviewUrl(data?.attachment_after);
                  setShowPreview(true);
                }}
                imageUrl={data?.attachment_after}
              />
            </div>
          )}

          {/* comment section */}
          {!showImage && (
            <div className="w-full bg-gray-2 rounded-lg p-2.5 flex flex-col gap-y-2.5">
              {/* <div className="flex flex-row text-sm text-graydark justify-center h-[50px] items-center">
                Belum ada komentar
              </div> */}
              <CommentCard />
            </div>
          )}
        </div>
        {/* Input Komentar dan Upload File */}
        <div className="bg-gray-2 mt-6.5 p-2.5 rounded-lg">
          <div className="w-full">
            <textarea
              rows={6}
              disabled={isLoading}
              placeholder="Tambahkan komentar"
              className="w-full text-sm bg-white rounded border-[1.5px] h-[60px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            ></textarea>

            <div className="flex flex-row justify-end gap-4 items-center mt-2">
              {/* Upload Button */}
              {!selectedFile ? (
                <label className="cursor-pointer flex items-center gap-1 text-blue-500 hover:text-blue-700">
                  <PhotoIcon className="h-6 w-6" />
                  <span className="text-xs">Pilih Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-blue-gray-50">
                  <span className="text-sm text-gray-700 truncate max-w-[180px]">
                    {selectedFile.name}
                  </span>
                  <XMarkIcon
                    className="h-5 w-5 cursor-pointer text-red-500"
                    onClick={removeFile}
                  />
                </div>
              )}

              <Button size="sm" className="normal-case" color="blue">
                Kirim
              </Button>
            </div>
          </div>
        </div>
      </div>
      <FileModal
        type={'image/png'}
        data={previewUrl}
        visible={showPreview}
        toggle={() => setShowPreview(!showPreview)}
      />
    </Dialog>
  );
};

export default WorkplanCommentModal;
