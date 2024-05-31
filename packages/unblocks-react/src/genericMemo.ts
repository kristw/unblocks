import { memo } from 'react';

// https://stackoverflow.com/a/70890101
const genericMemo: <T>(component: T) => T = memo;

export default genericMemo;
