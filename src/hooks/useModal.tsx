import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('LOADING');
  const [context, setContext] = useState('');

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

  function changeContext(context: string) {
    setContext(context);
  }

  return {
    toggle,
    visible,
    hide,
    show,
    type,
    changeType,
    context,
    changeContext,
  };
};

export default useModal;
