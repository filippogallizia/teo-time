import { MutableRefObject } from 'react';

type ifUndefined<T> = T extends undefined ? () => void : (data: T) => void;

export type BaseModalProps<Confirm = void, Cancel = undefined> = {
  isHidden?: boolean;
  onConfirm?: ifUndefined<Confirm>;
  onCancel?: ifUndefined<Cancel>;
};

export type Ref<Props extends BaseModalProps<unknown, unknown>> = {
  openModal: (props: Props) => void;
  closeModal: () => void;
  visibility: {
    hide: () => void;
    show: () => void;
  };
};

type ParametersOfElementsInObject<
  T extends object,
  Keys extends keyof T = keyof T
> = Parameters<
  // @ts-expect-error
  NonNullable<T[Keys]>
>;

export type ModalReturnConfirm<Props extends BaseModalProps<unknown, unknown>> =
  {
    status: 'CONFIRM';
    arg: ParametersOfElementsInObject<Props, 'onConfirm'>[0];
  };

export type ModalReturnCancel<Props extends BaseModalProps<unknown, unknown>> =
  {
    status: 'CANCEL';
    arg: ParametersOfElementsInObject<Props, 'onCancel'>[0];
  };

export type ModalReturn<Props> =
  | ModalReturnConfirm<Props>
  | ModalReturnCancel<Props>;

export type ModalProps<Props extends BaseModalProps<unknown, unknown>> = Omit<
  Props,
  'isOpen' | 'onConfirm' | 'onCancel' | 'children'
>;

const onOpenModal = async <Props extends BaseModalProps<unknown, unknown>>(
  ref: Ref<Props>,
  props: ModalProps<Props>
) => {
  return await new Promise<ModalReturn<Props>>((resolve) => {
    // @ts-expect-error
    ref.openModal({
      ...props,
      onConfirm: (arg: ParametersOfElementsInObject<Props, 'onConfirm'>[0]) =>
        resolve({
          status: 'CONFIRM',
          arg,
        }),
      onCancel: (arg: ParametersOfElementsInObject<Props, 'onCancel'>[0]) =>
        resolve({
          status: 'CANCEL',
          arg,
        }),
    });
  });
};

//TODO => understand this type

export type ManuallyModalCb<Props extends BaseModalProps<unknown, unknown>> = (
  result: ModalReturn<Props>
) =>
  | (void | false | ModalReturn<Props>)
  | Promise<void | false | ModalReturn<Props>>;

class ModalService {
  public async modal<Props extends BaseModalProps<unknown, unknown>>(
    ref: MutableRefObject<Ref<Props> | null>,
    props: ModalProps<Props>,
    dialogCb?: ManuallyModalCb<Props>
  ): Promise<ModalReturn<Props>> {
    if (ref && ref.current) {
      let result = await onOpenModal<Props>(ref.current, props);

      // this callback is for an ipotetical other modal ( like a prompt to ask user if he is sure )
      if (dialogCb) {
        const continuous = await Promise.resolve(dialogCb(result));

        if (continuous === false) {
          return await this.modal(ref, props, dialogCb);
        }
        if (continuous) {
          result = continuous;
        }
      }

      ref.current?.closeModal();

      return result;
    }

    return await Promise.reject(new Error('No Ref'));
  }
}

export default new ModalService();
