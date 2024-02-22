import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('LOADING');

  function toggle() {
    setVisible(!visible);
  }

  function hide() {
    setVisible(false);
  }

  function show() {
    setVisible(true);
  }

  function changeType(type: string) {
    setType(type);
  }

  return { toggle, visible, hide, show, type, changeType };
};

export default useModal;
