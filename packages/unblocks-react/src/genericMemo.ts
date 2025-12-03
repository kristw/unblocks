import { memo } from 'react';

// https://stackoverflow.com/a/70890101

/**
 * A generic memo function that preserves the type of the component being memoized.
 * @param component The React component to memoize.
 * @returns The memoized component with the same type as the input.
 */
const genericMemo: <T>(component: T) => T = memo;

export default genericMemo;
