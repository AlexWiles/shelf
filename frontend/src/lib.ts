import { useEffect, useRef } from "react";

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

declare global {
  interface Array<T> {
    uniqueBy(getKey: (obj: T) => string): T[];
  }
}

export const uniqueBy = <T>(arr: T[], getKey: (obj: T) => string) => {
  const flags: { [flag: string]: true } = {};

  return arr.filter((obj) => {
    const exists = flags[getKey(obj)];
    flags[getKey(obj)] = true;
    return !exists;
  });
};

export const arrRemove = <T>(arr: T[], idx: number): T[] => [
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
];

export const arrInsert = <T>(arr: T[], idx: number, item: T): T[] => [
  ...arr.slice(0, idx),
  item,
  ...arr.slice(idx),
];

export const arrMove = <T>(arr: T[], from: number, to: number): T[] => {
  const item = arr[from];
  return arrInsert(arrRemove(arr, from), to, item);
};

export const useDebounced = (
  func: () => void,
  delay: number,
  dependencyArray: any[]
) => {
  useEffect(() => {
    const timeout = setTimeout(func, delay);
    return () => clearTimeout(timeout);
  }, [func, delay, ...dependencyArray]);
};

export const useClickOutside = (
  callback: () => void,
  watcher: any[]
): React.MutableRefObject<any> => {
  const ref = useRef<any>(null);

  const handleClick = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  const effect = () => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  };

  useEffect(effect, watcher);
  return ref;
};