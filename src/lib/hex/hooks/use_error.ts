import { useAsyncError } from './use_async_error';
import ObservableValue from '../observable_value';

/**
 * @deprecated Use "useAsyncError" instead.
 * @param observableValue
 */
export function useError<TError>(observableValue: ObservableValue<any, any, TError>) {
  return useAsyncError<TError>(observableValue);
}
