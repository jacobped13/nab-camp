import { uniqueId } from "lodash-es";
import {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  type BaseOpenModalFunction,
  type ModalContextType,
} from "@/app/providers/modal-provider/consts";

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {
    // empty function
  },
  closeModal: () => {
    // empty function
  },
  ModalOutlet: () => null,
});

type ModalOutletInterceptorProps = {
  withOutlet: boolean;
  setWithOutlet: (value: boolean) => void;
  id: string;
};

const ModalOutletInterceptor = ({
  withOutlet,
  setWithOutlet,
  id,
}: ModalOutletInterceptorProps) => {
  const { ModalOutlet } = useContext(ModalContext);

  useEffect(() => {
    if (!withOutlet) setWithOutlet(true);
  }, [withOutlet, setWithOutlet]);

  return <ModalOutlet id={id} />;
};

export const DEFAULT_MODAL_ID = "default-modal-id";

export const useModalContext = () => {
  const [withOutlet, setWithOutlet] = useState<boolean>(false);

  const id = useMemo(
    () => (withOutlet ? uniqueId() : DEFAULT_MODAL_ID),
    [withOutlet],
  );

  const { openModal, closeModal } = useContext(ModalContext);

  const openModalInterceptor: BaseOpenModalFunction = useCallback(
    (ModalInstance, modalProps): void => {
      openModal(ModalInstance, modalProps, id);
    },
    [id, openModal],
  );

  const ModalOutletInterceptorInitializor = useCallback(
    () => (
      <ModalOutletInterceptor
        withOutlet={withOutlet}
        setWithOutlet={setWithOutlet}
        id={id}
      />
    ),
    [id, withOutlet],
  );

  const value = useMemo(() => {
    return {
      openModal: openModalInterceptor,
      closeModal,
      ModalOutlet: ModalOutletInterceptorInitializor,
    };
  }, [ModalOutletInterceptorInitializor, closeModal, openModalInterceptor]);

  return value;
};
