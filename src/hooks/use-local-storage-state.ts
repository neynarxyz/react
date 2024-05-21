import { useState } from "react";

type SerializeFunction<T> = (value: T) => string;
type DeserializeFunction<T> = (value: string) => T;

interface UseLocalStorageStateOptions<T> {
  serialize?: SerializeFunction<T>;
  deserialize?: DeserializeFunction<T>;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T = "" as T,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageStateOptions<T> = {}
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  };

  return [storedValue, setValue, removeItem];
}

export enum LocalStorageKeys {
  NEYNAR_AUTHENTICATED_USER = "neynar_authenticated_user",
}
