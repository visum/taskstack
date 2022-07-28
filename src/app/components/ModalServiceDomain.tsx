import type React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";

export class ModalServiceDomain {
  modalContent = new ObservableValue<React.ReactElement | null>(null);

  open(content:React.ReactElement){
    this.modalContent.setValue(content);
  }

  close() {
    this.modalContent.setValue(null);
  }
}