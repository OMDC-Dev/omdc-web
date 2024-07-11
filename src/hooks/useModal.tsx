import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('LOADING');
  const [context, setContext] = useState('');
  const [code, setCode] = useState('');

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

  function changeCode(code: string) {
    setCode(code);
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
    changeCode,
    code,
  };
};

export default useModal;
