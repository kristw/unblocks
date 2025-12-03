import React, { createContext, useContext } from 'react';

import { render, screen } from '@testing-library/react';

import type { ProviderProps } from '../src/composeProviders';
import composeProviders from '../src/composeProviders';

describe('composeProviders', () => {
  it('should return a provider component when given an empty array', () => {
    const ComposedProvider = composeProviders([]);
    const { getByText } = render(
      <ComposedProvider>
        <div>Test Content</div>
      </ComposedProvider>
    );
    expect(getByText('Test Content')).toBeDefined();
  });

  it('should compose a single provider', () => {
    const TestContext = createContext('default');
    const TestProvider = ({ children }: ProviderProps) => (
      <TestContext.Provider value="test-value">{children}</TestContext.Provider>
    );

    const ComposedProvider = composeProviders([TestProvider]);

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div>{value}</div>;
    };

    const { getByText } = render(
      <ComposedProvider>
        <TestComponent />
      </ComposedProvider>
    );

    expect(getByText('test-value')).toBeDefined();
  });

  it('should compose multiple providers in correct order', () => {
    const Context1 = createContext('default1');
    const Context2 = createContext('default2');
    const Context3 = createContext('default3');

    const Provider1 = ({ children }: ProviderProps) => <Context1.Provider value="value1">{children}</Context1.Provider>;
    const Provider2 = ({ children }: ProviderProps) => <Context2.Provider value="value2">{children}</Context2.Provider>;
    const Provider3 = ({ children }: ProviderProps) => <Context3.Provider value="value3">{children}</Context3.Provider>;

    const ComposedProvider = composeProviders([Provider1, Provider2, Provider3]);

    const TestComponent = () => {
      const value1 = useContext(Context1);
      const value2 = useContext(Context2);
      const value3 = useContext(Context3);
      return (
        <div>
          {value1}-{value2}-{value3}
        </div>
      );
    };

    const { getByText } = render(
      <ComposedProvider>
        <TestComponent />
      </ComposedProvider>
    );

    expect(getByText('value1-value2-value3')).toBeDefined();
  });

  it('should maintain provider nesting order (first provider is outermost)', () => {
    const OrderContext = createContext<string[]>([]);

    const OuterProvider = ({ children }: ProviderProps) => {
      const existing = useContext(OrderContext);
      return <OrderContext.Provider value={[...existing, 'outer']}>{children}</OrderContext.Provider>;
    };

    const InnerProvider = ({ children }: ProviderProps) => {
      const existing = useContext(OrderContext);
      return <OrderContext.Provider value={[...existing, 'inner']}>{children}</OrderContext.Provider>;
    };

    const ComposedProvider = composeProviders([OuterProvider, InnerProvider]);

    const TestComponent = () => {
      const order = useContext(OrderContext);
      return <div>{order.join(',')}</div>;
    };

    const { getByText } = render(
      <ComposedProvider>
        <TestComponent />
      </ComposedProvider>
    );

    // First provider should be outermost, so 'outer' should come before 'inner'
    expect(getByText('outer,inner')).toBeDefined();
  });

  it('should pass props correctly through the provider chain', () => {
    const TestContext = createContext('default');

    const TestProvider = ({ children }: ProviderProps) => (
      <TestContext.Provider value="provided">{children}</TestContext.Provider>
    );

    const ComposedProvider = composeProviders([TestProvider]);

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div data-testid="test">{value}</div>;
    };

    const { rerender, getByTestId } = render(
      <ComposedProvider>
        <TestComponent />
      </ComposedProvider>
    );

    expect(getByTestId('test').textContent).toBe('provided');

    // Rerender to ensure props are still passed correctly
    rerender(
      <ComposedProvider>
        <div>Different content</div>
      </ComposedProvider>
    );

    expect(screen.getByText('Different content')).toBeDefined();
  });

  it('should handle complex nested children', () => {
    const ThemeContext = createContext('light');
    const UserContext = createContext('guest');

    const ThemeProvider = ({ children }: ProviderProps) => (
      <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
    );

    const UserProvider = ({ children }: ProviderProps) => (
      <UserContext.Provider value="authenticated">{children}</UserContext.Provider>
    );

    const ComposedProvider = composeProviders([ThemeProvider, UserProvider]);

    const TestComponent = () => {
      const theme = useContext(ThemeContext);
      const user = useContext(UserContext);
      return (
        <div>
          <span>Theme: {theme}</span>
          <span>User: {user}</span>
        </div>
      );
    };

    const { getByText } = render(
      <ComposedProvider>
        <div>
          <TestComponent />
          <div>Other content</div>
        </div>
      </ComposedProvider>
    );

    expect(getByText('Theme: dark')).toBeDefined();
    expect(getByText('User: authenticated')).toBeDefined();
    expect(getByText('Other content')).toBeDefined();
  });

  it('should work with providers that have side effects', () => {
    const sideEffectLog: string[] = [];

    const Provider1 = ({ children }: ProviderProps) => {
      sideEffectLog.push('provider1-render');
      return <>{children}</>;
    };

    const Provider2 = ({ children }: ProviderProps) => {
      sideEffectLog.push('provider2-render');
      return <>{children}</>;
    };

    const ComposedProvider = composeProviders([Provider1, Provider2]);

    const { getByText } = render(
      <ComposedProvider>
        <div>Content</div>
      </ComposedProvider>
    );

    expect(sideEffectLog).toContain('provider1-render');
    expect(sideEffectLog).toContain('provider2-render');
    expect(getByText('Content')).toBeDefined();
  });

  it('should create a component that can be reused multiple times', () => {
    const TestContext = createContext('default');
    const TestProvider = ({ children }: ProviderProps) => (
      <TestContext.Provider value="reusable">{children}</TestContext.Provider>
    );

    const ComposedProvider = composeProviders([TestProvider]);

    const TestComponent = () => {
      const value = useContext(TestContext);
      return <div>{value}</div>;
    };

    render(
      <>
        <ComposedProvider>
          <TestComponent />
        </ComposedProvider>
        <ComposedProvider>
          <TestComponent />
        </ComposedProvider>
      </>
    );

    const elements = screen.getAllByText('reusable');
    expect(elements).toHaveLength(2);
  });
});
