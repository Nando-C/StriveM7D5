import { useEffect, useRef } from "react";

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useHasChanged = (val) => {
  const prevVal = usePrevious(val);

  if (prevVal === undefined) {
    return;
  } else {
    return prevVal !== val;
  }
};

export const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${returnedMinutes}:${returnedSeconds}`;
};
