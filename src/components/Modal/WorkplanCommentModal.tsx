import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Dialog, IconButton } from '@material-tailwind/react';
import React from 'react';
import FileModal from './FileModal';
import useFetch from '../../hooks/useFetch';
import { WORKPLAN_COMMENT } from '../../api/routes';
import { compressImage, getFormattedDateTable } from '../../common/utils';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';

const CommentCard = ({
  data,
  onClick,
  onReply,
  isContext,
  onRemovePin,
}: {
  data: any;
  onClick: any;
  onReply: any;
  isContext?: boolean;
  onRemovePin?: any;
}) => {
  const { user } = useAuth();

  const IS_SELF = user.iduser == data?.iduser;

  const REPLIES = data?.replies;

  return (
    <div className={`flex flex-col gap-2.5 ${isContext ? 'max-w-[50%]' : ''}`}>
      {isContext && <p className="text-sm font-semibold">Balas ke : </p>}
      <div
        className={`flex flex-row gap-2 ${
          isContext ? 'items-center' : 'items-start'
        } bg-white p-2 rounded-lg ${isContext ? 'mb-4' : ''}`}
      >
        {!isContext && (
          <div
            className={`min-w-5 min-h-5 rounded-full ${
              IS_SELF ? 'bg-blue-500' : 'bg-amber-700'
            } flex justify-center items-center text-xs text-white`}
          >
            {data?.create_by?.split('')[0]}
          </div>
        )}
        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            <p
              className={`text-xs font-semibold ${
                IS_SELF ? 'text-blue-500' : 'text-black'
              }`}
            >
              {data?.create_by}
            </p>
            {!isContext && (
              <p className="text-xs">
                {getFormattedDateTable(data?.createdAt, 'lll')}
              </p>
            )}
          </div>

          <p
            className={`text-sm text-black font-normal text-wrap ${
              isContext ? 'line-clamp-1' : ''
            }`}
          >
            {data?.message}
          </p>

          {data?.attachment && (
            <div
              onClick={onClick}
              className="hover:cursor-pointer flex mt-2.5 w-fit items-center gap-2 bg-white px-2 py-1 rounded-md border border-blue-gray-50"
            >
              <PhotoIcon className="h-5 w-5 text-blue-gray-200" />
              <span className="text-sm text-gray-700 truncate max-w-[180px]">
                Lampiran
              </span>
            </div>
          )}
          {!isContext && (
            <p
              onClick={() => onReply(null)}
              className="mt-2.5 text-sm hover:cursor-pointer text-blue-gray-600 w-fit"
            >
              Balas
            </p>
          )}
        </div>
        {isContext && (
          <div onClick={onRemovePin} className="hover:cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      {!isContext &&
        REPLIES.map((item: any, index: number) => {
          return (
            <div
              className={`flex flex-row gap-2 items-start bg-white p-2 rounded-lg ml-8`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  IS_SELF ? 'bg-blue-500' : 'bg-amber-700'
                } flex justify-center items-center text-xs text-white`}
              >
                {item?.create_by?.split('')[0]}
              </div>
              <div className="w-full">
                <div className="flex flex-row justify-between items-center">
                  <p
                    className={`text-xs font-semibold ${
                      IS_SELF ? 'text-blue-500' : 'text-black'
                    }`}
                  >
                    {item?.create_by}
                  </p>
                  {!isContext && (
                    <p className="text-xs">
                      {getFormattedDateTable(item?.createdAt, 'lll')}
                    </p>
                  )}
                </div>

                <p className="text-sm text-black font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                  {(() => {
                    const regex = /^Membalas (@[^:]+) : (.*)$/;
                    const match = item?.message.match(regex);

                    if (!match) return item?.message;

                    const [, mention, content] = match;
                    return (
                      <>
                        Membalas{' '}
                        <span className="text-blue-500 font-semibold">
                          {mention}
                        </span>{' '}
                        : {content}
                      </>
                    );
                  })()}
                </p>

                {item?.attachment && (
                  <div
                    onClick={onClick}
                    className="hover:cursor-pointer flex mt-2.5 w-fit items-center gap-2 bg-white px-2 py-1 rounded-md border border-blue-gray-50"
                  >
                    <PhotoIcon className="h-5 w-5 text-blue-gray-200" />
                    <span className="text-sm text-gray-700 truncate max-w-[180px]">
                      Lampiran
                    </span>
                  </div>
                )}
                <p
                  onClick={() => onReply(item)}
                  className="mt-2 text-xs hover:cursor-pointer text-blue-gray-600 w-fit"
                >
                  Balas
                </p>
              </div>
            </div>
          );
        })}
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
  isDone,
}: {
  visible: boolean;
  toggle: any;
  data: any;
  isDone?: boolean;
}) => {
  const [message, setMessage] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<any>('');
  const [fileName, setFileName] = React.useState<string>('');
  const [commentList, setCommentList] = React.useState<any>(
    data?.workplant_comment,
  );

  const [showImage, setShowImage] = React.useState<boolean>(true);
  const [showPreview, setShowPreview] = React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedComment, setSelectedComment] = React.useState<any>();

  const commentContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [commentList]);

  const WORKPLAN_ID = data?.id;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const maxSize = 10485760;

      if (file.size > maxSize) {
        if (file.type.includes('image')) {
          compressImage(file, maxSize, handleFileChange);
          return; // Menghentikan eksekusi lebih lanjut
        } else {
          // Memeriksa apakah ukuran file melebihi batas maksimum (1 MB)
          alert(
            'Ukuran file terlalu besar! Harap pilih file yang lebih kecil dari 10 MB.',
          );
          return;
        }
      }

      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64string: any = reader.result;

        const splitted = base64string?.split(';base64,');

        setSelectedFile(splitted[1]);
        setFileName(file.name);
      };
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  async function sendComment() {
    setIsLoading(true);

    const { state, data, error } = await useFetch({
      url: WORKPLAN_COMMENT(WORKPLAN_ID),
      method: 'POST',
      data: {
        message: selectedComment?.replyToName
          ? `Membalas @${selectedComment?.replyToName} : ${message}`
          : message,
        comment_id: selectedComment ? selectedComment.id : null,
        attachment: selectedFile,
      },
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setMessage('');
      setSelectedFile(null);
      setSelectedComment(null);
      getComment();
    } else {
      setIsLoading(false);
      setMessage('');
      setSelectedFile(null);
    }
  }

  async function getComment() {
    setIsLoading(true);

    const { state, data, error } = await useFetch({
      url: WORKPLAN_COMMENT(WORKPLAN_ID),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setCommentList(data.rows);
    } else {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (visible) {
      getComment();
    }
  }, [visible]);

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
          {/* <div className="flex flex-row justify-end">
            <Button
              onClick={() => setShowImage(!showImage)}
              className="normal-case"
              variant={'text'}
              color="blue"
            >
              {showImage ? 'Sembunyikan Lampiran' : 'Tampilkan Lampiran'}
            </Button>
          </div> */}
          {/* {true && (
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
          )} */}

          {/* comment section */}
          {true && (
            <div
              ref={commentContainerRef}
              className="w-full bg-gray-2 rounded-lg p-2.5 flex flex-col gap-y-2.5"
            >
              {commentList && commentList.length ? (
                commentList?.map((item: any) => {
                  return (
                    <CommentCard
                      data={item}
                      onClick={() => {
                        setPreviewUrl(item.attachment);
                        setShowPreview(true);
                      }}
                      onReply={(replyData: any) => {
                        if (replyData) {
                          setSelectedComment({
                            ...replyData,
                            id: item.id,
                            replyToName: replyData.create_by,
                          });
                        } else {
                          setSelectedComment(item);
                        }
                      }}
                    />
                  );
                })
              ) : (
                <div className="flex flex-row text-sm text-graydark justify-center h-[50px] items-center">
                  Belum ada komentar
                </div>
              )}
            </div>
          )}
        </div>
        {/* Input Komentar dan Upload File */}
        {!isDone && (
          <div className="bg-gray-2 mt-6.5 p-2.5 rounded-lg">
            {selectedComment && (
              <CommentCard
                isContext
                data={selectedComment}
                onClick={() => {}}
                onReply={() => {}}
                onRemovePin={() => setSelectedComment(null)}
              />
            )}
            <div className="w-full">
              <textarea
                rows={6}
                disabled={isLoading}
                placeholder="Tambahkan komentar"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                      {fileName}
                    </span>
                    <XMarkIcon
                      className="h-5 w-5 cursor-pointer text-red-500"
                      onClick={removeFile}
                    />
                  </div>
                )}

                <Button
                  loading={isLoading}
                  size="sm"
                  className="normal-case"
                  color="blue"
                  onClick={() => sendComment()}
                >
                  Kirim
                </Button>
              </div>
            </div>
          </div>
        )}
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
