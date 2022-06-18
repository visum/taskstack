import { useLayoutEffect, useState } from "react";
import { ObservableValue } from "./ObservableValue";

export function useAsyncValue<T>(observableValue: ObservableValue<T>) {
  const [value, setValue] = useState<T>(observableValue.getValue());

  useLayoutEffect(() => {
    observableValue.onChange((newValue) => {
      setValue(newValue);
    });

    return () => {
      observableValue.dispose();
    };
  }, [observableValue]);

  return value;
}
