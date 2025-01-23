import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Define the value state outside of the useEffect
  const [value, setValue] = useState<T>(initialValue);

  // Only access localStorage in useEffect (client-side only)
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    } else {
      setValue(initialValue); // Use initialValue if no value is found
    }
  }, [key, initialValue]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue];
}

export { useLocalStorage };
