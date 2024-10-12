/** Get all values of a map type */
export type ValueOf<T> = T[keyof T];

/** Get all possible keys from union types */
export type KeysOfUnion<T> = T extends T ? keyof T : never;

/** Remove field with value "never" from a Map */
export type RemoveNever<Map> = Pick<Map, { [K in keyof Map]: Map[K] extends never ? never : K }[keyof Map]>;

/** Make fields partial and also recursively make nested fields partial */
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Autocomplete in typescript of literal type and string
 * https://stackoverflow.com/questions/74467392/autocomplete-in-typescript-of-literal-type-and-string/74467583#74467583
 */
export type KnownString<T extends string> = T | (string & Record<never, never>);

/**
 * Make a type or array of type
 */
export type MaybeArray<T, IsArray extends boolean = boolean> = IsArray extends true ? T[] : T;
