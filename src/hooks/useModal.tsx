import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  function toggle() {
    setVisible(!visible);
  }

  function hide() {
    setVisible(false);
  }

  function show() {
    setVisible(true);
  }

  return { toggle, visible, hide, show };
};

export default useModal;
