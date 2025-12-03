/**
 * React hook that manages a state which can be either controlled or uncontrolled.
 */
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type ControllableState<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

/**
 * React hook that manages a state which can be either controlled or uncontrolled.
 * @param value Controlled value
 * @param defaultValue Default value for uncontrolled state
 * @param onChange Callback when the value changes
 * @returns A tuple containing the current state and a setter function.
 */
function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableState<T>): [T, Dispatch<SetStateAction<T>>] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const state = isControlled ? (value as T) : internalValue;

  const setState: Dispatch<SetStateAction<T>> = (newValue) => {
    const resolvedValue = typeof newValue === 'function' ? (newValue as (prevState: T) => T)(state) : newValue;

    if (!isControlled) {
      setInternalValue(resolvedValue);
    }

    if (onChange) {
      onChange(resolvedValue);
    }
  };

  useEffect(() => {
    if (isControlled && value !== state) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalValue(value as T);
    }
  }, [isControlled, value, state]);

  return [state, setState];
}

export default useControllableState;
