import React, { useCallback } from 'react';

export function useForkRef<T>(...args: (React.Ref<T> | undefined)[]) {
  return useCallback((obj: any | null) => {
    args.forEach(ref => {
      if (typeof ref === 'function') {
        ref(obj);
      } else if (
        typeof ref === 'object' &&
        ref != null &&
        ref.hasOwnProperty('current')
      ) {
        (ref as any).current = obj;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, args);
}
