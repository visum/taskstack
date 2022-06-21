import { useEffect, useState, useReducer } from "react";
import { ObservableValue } from "./ObservableValue";

const updateRducer = (num: number): number => (num + 1) % 1_000_000;

const useUpdate = () => {
  const [, update] = useReducer(updateRducer, 0);
  return update as () => void;
};

export function useAsyncValue<T>(observableValue: ObservableValue<T>) {
  const [value, setValue] = useState<T>(observableValue.getValue());
  const update = useUpdate();

  useEffect(() => {
    const observer = observableValue.onChange((newValue) => setValue(newValue));

    return () => observer.dispose();
  }, [observableValue, update]);

  return value;
}
