import { useCallback, useState } from 'react';

/**
 * A custom hook that provides a function to copy text to the clipboard.
 * @param value the text to be copied to clipboard
 * @param delay duration in milliseconds for which the copied state remains true
 * @returns an object containing the copied state and the copy function
 */
export default function useCopy(value: string, delay: number = 3000) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), delay);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [value, delay]);
  return { copied, handleCopy };
}
