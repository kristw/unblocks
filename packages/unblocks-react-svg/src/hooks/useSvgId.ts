import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

function svgIdUrl(id: string) {
  return `url(#${id})`;
}

/** Generate unique id for the given prefix */
export default function useSvgId(prefix: string) {
  const id = useMemo(() => `${prefix}-${uuidv4()}`, [prefix]);
  return [id, svgIdUrl(id)];
}
