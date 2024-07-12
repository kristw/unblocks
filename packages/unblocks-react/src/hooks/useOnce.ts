import { useEffect } from 'react';
import type { EffectCallback } from 'react';

/**
 * Does the same as useEffect, but only runs once.
 * @param effect - the effect to run once
 * @returns same as useEffect
 */
export default function useOnce(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally empty
  useEffect(effect, []);
}
