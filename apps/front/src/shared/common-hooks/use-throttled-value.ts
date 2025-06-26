import { useEffect, useRef, useState } from "react";

export const useThrottledValue = <T>(value: T, delay: number) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastChangeTime = useRef(-1);

  useEffect(() => {
    const currentTime = Date.now();
    const timeBeforeChange =
      lastChangeTime.current > -1
        ? Math.max(0, delay - (currentTime - lastChangeTime.current))
        : delay;

    lastChangeTime.current = currentTime;

    if (timeBeforeChange > 0) {
      const timeoutId = setTimeout(
        () => setThrottledValue(value),
        timeBeforeChange,
      );
      return () => clearTimeout(timeoutId);
    }

    setThrottledValue(value);
  }, [value, delay]);

  return throttledValue;
};
