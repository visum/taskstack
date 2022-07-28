import React, { useContext, useState } from "react";
import { ModalServiceDomain } from "./ModalServiceDomain";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { Modal } from "./Modal";

const modalServiceContext = React.createContext<ModalServiceDomain | null>(
  null
);

const ModalServiceProvider = modalServiceContext.Provider;

export const useModalService = () => useContext(modalServiceContext);

const styles: Record<string, React.CSSProperties> = {
  root: {
    top: "0",
    left: "0",
    position: "relative",
  },
  modalContent: {
    inset: "0 0 0 0",
    position: "absolute",
  },
};

export function ModalService({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const [domain] = useState(() => {
    return new ModalServiceDomain();
  });

  const modalContent = useAsyncValue(domain.modalContent);

  return (
    <ModalServiceProvider value={domain}>
      <div style={styles.root}>
        {children}
        {modalContent && (
          <div style={styles.modalContent}>
            <Modal>{modalContent}</Modal>
          </div>
        )}
      </div>
    </ModalServiceProvider>
  );
}
