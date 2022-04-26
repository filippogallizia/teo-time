import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { BaseModalProps } from './ModalService';

type State =
  | {
      isOpen: true;
      props: BaseModalProps;
    }
  | {
      isOpen: false;
      props?: undefined;
    };

const ModalContainer = forwardRef(({ Modal }: any, ref: ForwardedRef<any>) => {
  const [{ isOpen, props }, dispatch] = useState<State>({
    isOpen: false,
  });

  const [isHidden, setHidden] = useState<boolean>(false);

  const openModal = (props: BaseModalProps) => {
    setHidden(false);
    dispatch({
      isOpen: true,
      props,
    });
  };

  const closeModal = () => {
    dispatch({
      isOpen: false,
    });
  };

  const hide = () => {
    setHidden(true);
  };

  const show = () => {
    setHidden(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
    visibility: {
      show,
      hide,
    },
  }));

  return <div>{isOpen && <Modal {...props} isHidden={isHidden} />}</div>;
});

export default ModalContainer;
