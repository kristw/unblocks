import React from 'react';

import itemFinder from '../src/itemFinder';

describe('itemFinder', () => {
  type TestProps = {
    id: string;
    type: string;
    value: number;
  };

  const itemsByKey = {
    item1: { name: 'Item 1', data: 'data1' },
    item2: { name: 'Item 2', data: 'data2' },
    item3: { name: 'Item 3', data: 'data3' },
  };

  describe('with string key', () => {
    it('should find item by string key from props', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
      });

      const result = finder({ id: 'item1', type: 'test', value: 1 });

      expect(result).toEqual({ name: 'Item 1', data: 'data1' });
    });

    it('should return undefined when key not found', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
      });

      const result = finder({ id: 'nonexistent', type: 'test', value: 1 });

      expect(result).toBeUndefined();
    });

    it('should return default value when key not found', () => {
      const defaultValue = { name: 'Default', data: 'default' };
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
        defaultValue,
      });

      const result = finder({ id: 'nonexistent', type: 'test', value: 1 });

      expect(result).toEqual(defaultValue);
    });

    it('should find different items based on different key values', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
      });

      expect(finder({ id: 'item1', type: 'test', value: 1 })).toEqual({ name: 'Item 1', data: 'data1' });
      expect(finder({ id: 'item2', type: 'test', value: 2 })).toEqual({ name: 'Item 2', data: 'data2' });
      expect(finder({ id: 'item3', type: 'test', value: 3 })).toEqual({ name: 'Item 3', data: 'data3' });
    });

    it('should use different prop fields as key', () => {
      const finderById = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
      });

      const finderByType = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'type',
        itemsByKey,
      });

      expect(finderById({ id: 'item1', type: 'other', value: 1 })).toEqual({ name: 'Item 1', data: 'data1' });
      expect(finderByType({ id: 'other', type: 'item2', value: 1 })).toEqual({ name: 'Item 2', data: 'data2' });
    });
  });

  describe('with function key', () => {
    it('should find item using function to derive key', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: (props) => props.id,
        itemsByKey,
      });

      const result = finder({ id: 'item1', type: 'test', value: 1 });

      expect(result).toEqual({ name: 'Item 1', data: 'data1' });
    });

    it('should derive key from multiple props', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: (props) => `${props.type}${props.value}`,
        itemsByKey: {
          test1: { name: 'Test 1', data: 't1' },
          test2: { name: 'Test 2', data: 't2' },
        },
      });

      expect(finder({ id: 'any', type: 'test', value: 1 })).toEqual({ name: 'Test 1', data: 't1' });
      expect(finder({ id: 'any', type: 'test', value: 2 })).toEqual({ name: 'Test 2', data: 't2' });
    });

    it('should return undefined when derived key not found', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: (props) => props.id,
        itemsByKey,
      });

      const result = finder({ id: 'missing', type: 'test', value: 1 });

      expect(result).toBeUndefined();
    });

    it('should return default value when derived key not found', () => {
      const defaultValue = { name: 'Default', data: 'default' };
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: (props) => props.id,
        itemsByKey,
        defaultValue,
      });

      const result = finder({ id: 'missing', type: 'test', value: 1 });

      expect(result).toEqual(defaultValue);
    });

    it('should support complex key derivation logic', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: (props) => (props.value > 5 ? 'item1' : 'item2'),
        itemsByKey,
      });

      expect(finder({ id: 'any', type: 'test', value: 10 })).toEqual({ name: 'Item 1', data: 'data1' });
      expect(finder({ id: 'any', type: 'test', value: 3 })).toEqual({ name: 'Item 2', data: 'data2' });
    });
  });

  describe('with different item types', () => {
    it('should work with primitive values', () => {
      const numbersByKey = {
        one: 1,
        two: 2,
        three: 3,
      };

      const finder = itemFinder<TestProps, number>({
        key: 'id',
        itemsByKey: numbersByKey,
      });

      expect(finder({ id: 'one', type: 'test', value: 0 })).toBe(1);
      expect(finder({ id: 'two', type: 'test', value: 0 })).toBe(2);
    });

    it('should work with function values', () => {
      const fn1 = () => 'fn1';
      const fn2 = () => 'fn2';

      const functionsByKey = {
        func1: fn1,
        func2: fn2,
      };

      const finder = itemFinder<TestProps, () => string>({
        key: 'id',
        itemsByKey: functionsByKey,
      });

      const result1 = finder({ id: 'func1', type: 'test', value: 0 });
      const result2 = finder({ id: 'func2', type: 'test', value: 0 });

      expect(result1).toBe(fn1);
      expect(result2).toBe(fn2);
      expect(result1?.()).toBe('fn1');
      expect(result2?.()).toBe('fn2');
    });

    it('should work with array values', () => {
      const arraysByKey = {
        arr1: [1, 2, 3],
        arr2: [4, 5, 6],
      };

      const finder = itemFinder<TestProps, number[]>({
        key: 'id',
        itemsByKey: arraysByKey,
      });

      expect(finder({ id: 'arr1', type: 'test', value: 0 })).toEqual([1, 2, 3]);
      expect(finder({ id: 'arr2', type: 'test', value: 0 })).toEqual([4, 5, 6]);
    });

    it('should work with React component types', () => {
      type ComponentType = React.ComponentType<{ message: string }>;

      // eslint-disable-next-line react/prop-types
      const Comp1: ComponentType = ({ message }) => <div>Comp1: {message}</div>;
      // eslint-disable-next-line react/prop-types
      const Comp2: ComponentType = ({ message }) => <div>Comp2: {message}</div>;

      const componentsByKey = {
        comp1: Comp1,
        comp2: Comp2,
      };

      const finder = itemFinder<TestProps, ComponentType>({
        key: 'id',
        itemsByKey: componentsByKey,
      });

      expect(finder({ id: 'comp1', type: 'test', value: 0 })).toBe(Comp1);
      expect(finder({ id: 'comp2', type: 'test', value: 0 })).toBe(Comp2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty itemsByKey', () => {
      const finder = itemFinder<TestProps, string>({
        key: 'id',
        itemsByKey: {},
      });

      expect(finder({ id: 'any', type: 'test', value: 1 })).toBeUndefined();
    });

    it('should handle empty itemsByKey with default value', () => {
      const defaultValue = 'default';
      const finder = itemFinder<TestProps, string>({
        key: 'id',
        itemsByKey: {},
        defaultValue,
      });

      expect(finder({ id: 'any', type: 'test', value: 1 })).toBe('default');
    });

    it('should return actual item when it matches default value', () => {
      const defaultValue = { name: 'Default', data: 'default' };
      const actualItem = { name: 'Item 1', data: 'data1' };

      const finder = itemFinder<TestProps, typeof actualItem>({
        key: 'id',
        itemsByKey: { item1: actualItem },
        defaultValue,
      });

      expect(finder({ id: 'item1', type: 'test', value: 1 })).toBe(actualItem);
      expect(finder({ id: 'missing', type: 'test', value: 1 })).toBe(defaultValue);
    });

    it('should handle numeric string keys', () => {
      const finder = itemFinder<TestProps, string>({
        key: 'value',
        itemsByKey: {
          '1': 'one',
          '2': 'two',
          '3': 'three',
        },
      });

      expect(finder({ id: 'any', type: 'test', value: 1 })).toBe('one');
      expect(finder({ id: 'any', type: 'test', value: 2 })).toBe('two');
    });

    it('should be reusable across multiple calls', () => {
      const finder = itemFinder<TestProps, (typeof itemsByKey)['item1']>({
        key: 'id',
        itemsByKey,
      });

      // Call multiple times
      expect(finder({ id: 'item1', type: 'test', value: 1 })).toEqual({ name: 'Item 1', data: 'data1' });
      expect(finder({ id: 'item2', type: 'test', value: 2 })).toEqual({ name: 'Item 2', data: 'data2' });
      expect(finder({ id: 'item1', type: 'test', value: 3 })).toEqual({ name: 'Item 1', data: 'data1' });
      expect(finder({ id: 'item3', type: 'test', value: 4 })).toEqual({ name: 'Item 3', data: 'data3' });
    });

    it('should handle null or undefined values in itemsByKey', () => {
      const finder = itemFinder<TestProps, string | null | undefined>({
        key: 'id',
        itemsByKey: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          null: null as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          undefined: undefined as any,
          valid: 'valid',
        },
      });

      expect(finder({ id: 'null', type: 'test', value: 1 })).toBeNull();
      expect(finder({ id: 'undefined', type: 'test', value: 1 })).toBeUndefined();
      expect(finder({ id: 'valid', type: 'test', value: 1 })).toBe('valid');
    });
  });
});
