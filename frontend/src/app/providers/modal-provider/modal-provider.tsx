import { type ReactNode, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  type ModalContextType,
  type OpenModalFunction,
} from "@/app/providers/modal-provider/consts";
import { ModalContext, DEFAULT_MODAL_ID } from "@/hooks/use-modal";

export type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [currentOpenModal, setCurrentOpenModal] =
    useState<React.JSX.Element | null>(null);
  const [currentPortalId, setCurrentPortalId] =
    useState<string>(DEFAULT_MODAL_ID);

  const closeModal = useCallback(() => {
    setCurrentOpenModal(null);
    setCurrentPortalId(DEFAULT_MODAL_ID);
  }, []);

  const openModal: OpenModalFunction = useCallback(
    (ActiveModal, modalProps, id): void => {
      setCurrentOpenModal(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ActiveModal {...(modalProps as any)} closeModal={closeModal} />,
      );
      setCurrentPortalId(id);
    },
    [closeModal],
  );

  const ModalOutlet = useCallback(
    ({ id }: { id: string }) => {
      if (typeof document !== "undefined" && id === currentPortalId) {
        return createPortal(currentOpenModal, document.body);
      }
      return null;
    },
    [currentOpenModal, currentPortalId],
  );

  const value: ModalContextType = useMemo(() => {
    return { openModal, closeModal, ModalOutlet };
  }, [openModal, closeModal, ModalOutlet]);

  return (
    <ModalContext.Provider value={value}>
      <ModalOutlet id={DEFAULT_MODAL_ID} />
      {children}
    </ModalContext.Provider>
  );
};
