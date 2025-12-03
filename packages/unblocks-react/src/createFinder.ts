export default function createFinder<Props extends Record<string, unknown>, ItemType>({
  key,
  itemsByKey,
  defaultValue,
}: {
  /** name of the field in props to use as a key or function to derive key from props */
  key: string | ((props: Props) => string);
  /** Record of items indexed by key */
  itemsByKey: Record<string, ItemType>;
  /** Default value if key not found */
  defaultValue?: ItemType;
}): (props: Props) => ItemType | undefined {
  return (props: Props) => {
    const k = typeof key === 'string' ? props[key] : key(props);
    return itemsByKey[k as string] ?? defaultValue;
  };
}
