import { useRef } from 'react';
import ModalService, { BaseModalProps, ModalProps } from './ModalService';

export const useModal = <Props extends BaseModalProps<unknown, unknown>>() => {
  const ref = useRef<any>(null);

  const onModal = (props: ModalProps<Props>, dialogCb?: any) => {
    return ModalService.modal(ref, props, dialogCb);
  };

  return [ref, onModal] as const;
};
