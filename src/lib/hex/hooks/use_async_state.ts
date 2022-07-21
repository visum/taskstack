import { ReadonlyAsyncActionRunner } from '../async_action_runner';
import { useAsyncValue } from './use_async_value';
import { useAsyncError } from './use_async_error';
import { useAsyncStatus } from './use_async_status';

/**
 * Subscribes to the value, error, and status of an AsyncActionRunner. Only use this
 * if you are interseted in all the values of a runner. Because when any of the values
 * change it will rerender your component.
 * @param asyncActionRunner AsyncActionRunner
 *
 * ## Example
 * ```tsx
 * function MyComponent (){
 *  const mediator = useMediator();
 *  const runnerState = useAsyncState(mediator.someRunner);
 *
 *  return <div>
 *    {runnerState.isPending && <Loader />}
 *    {(runnerState.isSuccess || runnerState.isInitial) && <div>{runnerState.value}</div>}
 *    {runnerState.isError && <div>{runnerState.error.message}</div>}
 *  </div>
 * }
 * ```
 */
export function useAsyncState<TValue, TError, TInitial = TValue>(
  asyncActionRunner: ReadonlyAsyncActionRunner<TValue, TInitial, TError>
) {
  const value = useAsyncValue<TValue, TInitial>(asyncActionRunner);
  const error = useAsyncError<TError>(asyncActionRunner);
  const status = useAsyncStatus(asyncActionRunner);

  return {
    value,
    error,
    ...status,
  };
}
