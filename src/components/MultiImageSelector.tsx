import React, { useState, ChangeEvent, useEffect } from 'react';

interface ImageWithCaption {
  file: File | null;
  preview: string;
  caption: string;
  base64: string;
  image_url?: string;
  id?: number;
  isNew?: boolean;
}

interface Props {
  previewOnly?: boolean;
  isEditMode?: boolean;
  value?: {
    base64: string;
    caption: string;
    image_url?: string;
    id?: number;
    isNew?: boolean;
  }[];
  onChange?: (
    images: {
      base64: string;
      caption: string;
      image_url?: string;
      id?: number;
      isNew?: boolean;
    }[],
  ) => void;
}

const ImageSelectorWithCaptions: React.FC<Props> = ({
  onChange,
  value = [],
  previewOnly = false,
  isEditMode = false,
}) => {
  const [images, setImages] = useState<ImageWithCaption[]>([]);

  useEffect(() => {
    const prepared = value.map((item) => ({
      file: null,
      preview: item.image_url ?? item.base64,
      base64: item.base64,
      caption: item.caption,
      image_url: item.image_url,
      id: item.id,
      isNew: item.isNew,
    }));
    setImages(prepared);
  }, [value]);

  const handleAttachment = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageWithCaption[] = [];

    for (const file of Array.from(files)) {
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);

      newImages.push({
        file,
        preview,
        base64,
        caption: '',
        isNew: true,
      });
    }

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      triggerOnChange(combined);
      return combined;
    });

    e.target.value = ''; // reset input supaya bisa upload file yang sama lagi
  };

  const triggerOnChange = (allImages: ImageWithCaption[]) => {
    const payload = allImages;
    onChange?.(payload);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const updateCaption = (index: number, value: string) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index].caption = value;
      triggerOnChange(updated);
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const target = updated[index];
      if (target.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(target.preview);
      }
      updated.splice(index, 1);
      triggerOnChange(updated);
      return updated;
    });
  };

  const getImageSrc = (img: ImageWithCaption) => {
    if (img.preview?.startsWith('blob:')) return img.preview;
    if (img.base64?.startsWith('data:image')) return img.base64;
    if (img.image_url) return img.image_url;
    return '';
  };

  return (
    <div className="w-full space-y-4">
      {!previewOnly ? (
        <>
          <label className="block text-sm font-medium text-black">
            Lampirkan Gambar (Opsional, maks. 10MB per gambar)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAttachment}
            className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary"
          />
        </>
      ) : (
        <label className="block text-sm font-medium text-black">Lampiran</label>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="border border-blue-gray-100 rounded-md p-3 relative bg-white shadow"
          >
            <div className="aspect-square w-24 mx-auto">
              <img
                src={getImageSrc(img)}
                alt={`Selected ${index}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <input
              type="text"
              placeholder={previewOnly ? 'Keterangan' : 'Tulis caption...'}
              disabled={previewOnly || (isEditMode && !img.isNew)}
              value={img.caption}
              onChange={(e) => updateCaption(index, e.target.value)}
              className="mt-2 w-full border px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {!previewOnly && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 aspect-square flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectorWithCaptions;
