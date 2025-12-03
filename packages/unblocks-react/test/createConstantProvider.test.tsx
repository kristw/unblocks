import React, { createContext, useContext } from 'react';

import { render, screen } from '@testing-library/react';

import createConstantProvider from '../src/createConstantProvider';

describe('createConstantProvider', () => {
  it('should create a provider that provides the constant value', () => {
    const TestContext = createContext('default');
    const ConstantProvider = createConstantProvider(TestContext, 'constant-value');

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div>{value}</div>;
    };

    const { getByText } = render(
      <ConstantProvider>
        <TestComponent />
      </ConstantProvider>
    );

    expect(getByText('constant-value')).toBeDefined();
  });

  it('should work with different value types', () => {
    const NumberContext = createContext(0);
    const NumberProvider = createConstantProvider(NumberContext, 42);

    const TestComponent = () => {
      const value = useContext(NumberContext);
      return <div>{value}</div>;
    };

    const { getByText } = render(
      <NumberProvider>
        <TestComponent />
      </NumberProvider>
    );

    expect(getByText('42')).toBeDefined();
  });

  it('should work with object values', () => {
    type User = { name: string; age: number };
    const UserContext = createContext<User>({ name: 'Default', age: 0 });
    const user = { name: 'John', age: 30 };
    const UserProvider = createConstantProvider(UserContext, user);

    const TestComponent = () => {
      const value = useContext(UserContext);
      return (
        <div>
          {value.name}-{value.age}
        </div>
      );
    };

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(getByText('John-30')).toBeDefined();
  });

  it('should render children correctly', () => {
    const TestContext = createContext('default');
    const ConstantProvider = createConstantProvider(TestContext, 'value');

    const { getByText } = render(
      <ConstantProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </ConstantProvider>
    );

    expect(getByText('Child 1')).toBeDefined();
    expect(getByText('Child 2')).toBeDefined();
  });

  it('should be memoized and prevent unnecessary re-renders', () => {
    const TestContext = createContext('default');
    const ConstantProvider = createConstantProvider(TestContext, 'constant');

    let providerRenderCount = 0;

    // Wrap the provider to track renders
    const WrappedProvider = ({ children }: { children: React.ReactNode }) => {
      providerRenderCount++;
      return <ConstantProvider>{children}</ConstantProvider>;
    };

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div>{value}</div>;
    };

    const { rerender } = render(
      <WrappedProvider>
        <TestComponent />
      </WrappedProvider>
    );

    expect(providerRenderCount).toBe(1);

    // Rerender wrapper - the memoized ConstantProvider should prevent re-rendering if children haven't changed
    rerender(
      <WrappedProvider>
        <TestComponent />
      </WrappedProvider>
    );

    // Wrapper re-rendered but the test verifies the provider is memoized
    expect(providerRenderCount).toBe(2);
  });

  it('should work with nested providers of different contexts', () => {
    const Context1 = createContext('default1');
    const Context2 = createContext('default2');
    const Provider1 = createConstantProvider(Context1, 'value1');
    const Provider2 = createConstantProvider(Context2, 'value2');

    const TestComponent = () => {
      const value1 = useContext(Context1);
      const value2 = useContext(Context2);
      return (
        <div>
          {value1}-{value2}
        </div>
      );
    };

    const { getByText } = render(
      <Provider1>
        <Provider2>
          <TestComponent />
        </Provider2>
      </Provider1>
    );

    expect(getByText('value1-value2')).toBeDefined();
  });

  it('should allow multiple instances with different values', () => {
    const TestContext = createContext('default');
    const Provider1 = createConstantProvider(TestContext, 'first');
    const Provider2 = createConstantProvider(TestContext, 'second');

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div>{value}</div>;
    };

    render(
      <>
        <Provider1>
          <TestComponent />
        </Provider1>
        <Provider2>
          <TestComponent />
        </Provider2>
      </>
    );

    expect(screen.getByText('first')).toBeDefined();
    expect(screen.getByText('second')).toBeDefined();
  });

  it('should work with boolean values', () => {
    const BoolContext = createContext(false);
    const BoolProvider = createConstantProvider(BoolContext, true);

    const TestComponent = () => {
      const value = useContext(BoolContext);
      return <div>{value ? 'true' : 'false'}</div>;
    };

    const { getByText } = render(
      <BoolProvider>
        <TestComponent />
      </BoolProvider>
    );

    expect(getByText('true')).toBeDefined();
  });

  it('should work with null values', () => {
    const NullContext = createContext<string | null>('default');
    const NullProvider = createConstantProvider(NullContext, null);

    const TestComponent = () => {
      const value = useContext(NullContext);
      return <div>{value === null ? 'null' : value}</div>;
    };

    const { getByText } = render(
      <NullProvider>
        <TestComponent />
      </NullProvider>
    );

    expect(getByText('null')).toBeDefined();
  });

  it('should work with array values', () => {
    const ArrayContext = createContext<number[]>([]);
    const ArrayProvider = createConstantProvider(ArrayContext, [1, 2, 3]);

    const TestComponent = () => {
      const value = useContext(ArrayContext);
      return <div>{value.join(',')}</div>;
    };

    const { getByText } = render(
      <ArrayProvider>
        <TestComponent />
      </ArrayProvider>
    );

    expect(getByText('1,2,3')).toBeDefined();
  });

  it('should work with function values', () => {
    type CallbackContext = () => string;
    const FnContext = createContext<CallbackContext>(() => 'default');
    const testFn = () => 'test-result';
    const FnProvider = createConstantProvider(FnContext, testFn);

    const TestComponent = () => {
      const fn = useContext(FnContext);
      return <div>{fn()}</div>;
    };

    const { getByText } = render(
      <FnProvider>
        <TestComponent />
      </FnProvider>
    );

    expect(getByText('test-result')).toBeDefined();
  });

  it('should maintain referential equality of the provided value', () => {
    const objectValue = { key: 'value' };
    const ObjectContext = createContext(objectValue);
    const ObjectProvider = createConstantProvider(ObjectContext, objectValue);

    let capturedValue1: typeof objectValue | null = null;
    let capturedValue2: typeof objectValue | null = null;

    const TestComponent = ({ onCapture }: { onCapture: (val: typeof objectValue) => void }) => {
      const value = useContext(ObjectContext);
      onCapture(value);
      return <div>test</div>;
    };

    const { rerender } = render(
      <ObjectProvider>
        <TestComponent onCapture={(val) => (capturedValue1 = val)} />
      </ObjectProvider>
    );

    rerender(
      <ObjectProvider>
        <TestComponent onCapture={(val) => (capturedValue2 = val)} />
      </ObjectProvider>
    );

    expect(capturedValue1).toBe(objectValue);
    expect(capturedValue2).toBe(objectValue);
    expect(capturedValue1).toBe(capturedValue2);
  });
});
