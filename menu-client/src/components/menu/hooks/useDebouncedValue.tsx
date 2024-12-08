import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(defaultValue: T, wait: number) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);

  const _clearTimeout = () => window.clearTimeout(timeoutRef.current!);

  useEffect(() => {
    if (!mountedRef.current) return;
    timeoutRef.current = setTimeout(() => {
      setValue(defaultValue);
    }, wait);
    return _clearTimeout;
  }, [defaultValue, wait]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return [value] as const;
}
