import React from 'react';

const Modal = ({
  visible,
  toggle,
  dismissOnBackdrop,
}: {
  visible: boolean;
  toggle: any;
  dismissOnBackdrop?: boolean;
}) => {
  if (!visible) return null;

  return (
    <div
      onClick={dismissOnBackdrop ? toggle : null}
      className="fixed z-50 bg-black bg-opacity-40 top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white p-4 lg:p-5 rounded-md shadow-md"
      >
        <div
          className="inline-block w-10 h-10 
            border-t-2
            border-t-indigo-500  
            rounded-full 
            animate-spin"
        ></div>
      </div>
    </div>
  );
};

export default Modal;
