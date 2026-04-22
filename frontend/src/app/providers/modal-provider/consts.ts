import { type ComponentType } from "react";

export type BaseOpenModalFunction = <Props extends object>(
  modalInstance: ComponentType<Props>,
  modalProps: Omit<Props, "closeModal">,
) => void;

export type OpenModalFunction = <Props extends object>(
  modalInstance: ComponentType<Props>,
  modalProps: Omit<Props, "closeModal">,
  modalId: string,
) => void;

export type ModalComponentProps = {
  closeModal: () => void;
};

export type ModalContextType = {
  openModal: OpenModalFunction;
  closeModal: () => void;
  ModalOutlet: ({ id }: { id: string }) => React.JSX.Element | null;
};
