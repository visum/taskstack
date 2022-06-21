import { useEffect, useReducer } from "react";
import { ObservableValue } from "./ObservableValue";

const updateRducer = (num: number): number => (num + 1) % 1_000_000;

const useUpdate = () => {
  const [, update] = useReducer(updateRducer, 0);
  return update as () => void;
};

export function useAsyncValue<T>(observableValue: ObservableValue<T>) {
  const update = useUpdate();

  useEffect(() => {
    const observer = observableValue.onChange(update);

    return () => observer.dispose();
  }, [observableValue, update]);

  return observableValue.getValue();
}
