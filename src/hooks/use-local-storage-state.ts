import { useState, useEffect, useRef } from "react";

type DeserializeFunction<T> = (value: string) => T;
type SerializeFunction<T> = (value: T) => string;

interface UseLocalStorageStateOptions<T> {
  serialize?: SerializeFunction<T>;
  deserialize?: DeserializeFunction<T>;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue?: T | (() => T),
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageStateOptions<T> = {}
): [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
  () => void,
] {
  const [state, setState] = useState<T | undefined>(() => {
    if (typeof window !== "undefined") {
      try {
        const valueInLocalStorage = window.localStorage.getItem(key);
        if (valueInLocalStorage !== null) {
          return deserialize(valueInLocalStorage);
        } else if (defaultValue instanceof Function) {
          return defaultValue();
        } else {
          return defaultValue;
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return defaultValue instanceof Function ? defaultValue() : defaultValue;
      }
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  const prevKeyRef = useRef<string>(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key && typeof window !== "undefined") {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    if (state !== undefined) {
      // Only set item in local storage if state is not undefined
      try {
        window.localStorage.setItem(key, serialize(state));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [key, state, serialize]);

  const removeItem = () => {
    window.localStorage.removeItem(key);
  };

  return [state, setState, removeItem];
}
