import React from 'react';

import { render } from '@testing-library/react';

import createDynamicRenderer from '../src/createDynamicRenderer';

describe('createDynamicRenderer', () => {
  type TestProps = {
    name: string;
    value: number;
  };

  const RendererA = ({ name, value }: TestProps) => (
    <div>
      Renderer A: {name} - {value}
    </div>
  );

  const RendererB = ({ name, value }: TestProps) => (
    <div>
      Renderer B: {name} - {value}
    </div>
  );

  const DefaultRenderer = ({ name, value }: TestProps) => (
    <div>
      Default: {name} - {value}
    </div>
  );

  it('should return Context, DynamicRenderer, and createConstantProvider', () => {
    const result = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    expect(result.Context).toBeDefined();
    expect(result.DynamicRenderer).toBeDefined();
    expect(result.createConstantProvider).toBeDefined();
  });

  it('should render the component returned by getRenderer', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    const getRenderer = () => RendererA;

    const { getByText } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="test" value={42} />
      </Context.Provider>
    );

    expect(getByText('Renderer A: test - 42')).toBeDefined();
  });

  it('should use DefaultRenderer when getRenderer returns undefined', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
      DefaultRenderer,
    });

    const getRenderer = () => undefined;

    const { getByText } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="test" value={42} />
      </Context.Provider>
    );

    expect(getByText('Default: test - 42')).toBeDefined();
  });

  it('should render null when getRenderer returns undefined and no DefaultRenderer', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    const getRenderer = () => undefined;

    const { container } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="test" value={42} />
      </Context.Provider>
    );

    expect(container.textContent).toBe('');
  });

  it('should dynamically select renderer based on props', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    const getRenderer = (props: TestProps) => {
      return props.value > 50 ? RendererA : RendererB;
    };

    const { getByText, rerender } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="test" value={30} />
      </Context.Provider>
    );

    expect(getByText('Renderer B: test - 30')).toBeDefined();

    rerender(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="test" value={60} />
      </Context.Provider>
    );

    expect(getByText('Renderer A: test - 60')).toBeDefined();
  });

  it('should throw error when not wrapped in Context.Provider', () => {
    const { DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'MyRenderer',
    });

    expect(() => {
      render(<DynamicRenderer name="test" value={42} />);
    }).toThrow(
      "Invalid MyRenderer 'undefined'. Make sure this component is wrapped under <MyRendererContext.Provider> with valid value."
    );
  });

  it('should pass all props to the selected renderer', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    const capturedProps: TestProps[] = [];
    const PropsCapture = (props: TestProps) => {
      capturedProps.push(props);
      return <div>captured</div>;
    };

    const getRenderer = () => PropsCapture;

    render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="capture-test" value={123} />
      </Context.Provider>
    );

    expect(capturedProps[0]).toEqual({ name: 'capture-test', value: 123 });
  });

  it('should work with createConstantProvider', () => {
    const { DynamicRenderer, createConstantProvider } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    const getRenderer = () => RendererA;
    const ConstantProvider = createConstantProvider({ getRenderer });

    const { getByText } = render(
      <ConstantProvider>
        <DynamicRenderer name="constant" value={99} />
      </ConstantProvider>
    );

    expect(getByText('Renderer A: constant - 99')).toBeDefined();
  });

  it('should support multiple DynamicRenderer instances with different contexts', () => {
    const { Context: Context1, DynamicRenderer: DynamicRenderer1 } = createDynamicRenderer<TestProps>({
      contextName: 'Renderer1',
    });

    const { Context: Context2, DynamicRenderer: DynamicRenderer2 } = createDynamicRenderer<TestProps>({
      contextName: 'Renderer2',
    });

    const getRenderer1 = () => RendererA;
    const getRenderer2 = () => RendererB;

    const { getByText } = render(
      <>
        <Context1.Provider value={{ getRenderer: getRenderer1 }}>
          <DynamicRenderer1 name="first" value={1} />
        </Context1.Provider>
        <Context2.Provider value={{ getRenderer: getRenderer2 }}>
          <DynamicRenderer2 name="second" value={2} />
        </Context2.Provider>
      </>
    );

    expect(getByText('Renderer A: first - 1')).toBeDefined();
    expect(getByText('Renderer B: second - 2')).toBeDefined();
  });

  it('should handle renderer switching at runtime', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
    });

    let currentRenderer = RendererA;
    const getRenderer = () => currentRenderer;

    const { getByText, rerender } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="switch" value={10} />
      </Context.Provider>
    );

    expect(getByText('Renderer A: switch - 10')).toBeDefined();

    currentRenderer = RendererB;

    rerender(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="switch" value={10} />
      </Context.Provider>
    );

    expect(getByText('Renderer B: switch - 10')).toBeDefined();
  });

  it('should fallback to DefaultRenderer only when getRenderer returns undefined', () => {
    const { Context, DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'Test',
      DefaultRenderer,
    });

    const getRenderer = (props: TestProps) => {
      return props.value > 0 ? RendererA : undefined;
    };

    const { getByText, rerender } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="fallback" value={5} />
      </Context.Provider>
    );

    expect(getByText('Renderer A: fallback - 5')).toBeDefined();

    rerender(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer name="fallback" value={0} />
      </Context.Provider>
    );

    expect(getByText('Default: fallback - 0')).toBeDefined();
  });

  it('should work with complex prop types', () => {
    type ComplexProps = {
      id: string;
      data: { label: string; count: number };
      onClick: () => void;
    };

    const ComplexRenderer = ({ id, data, onClick }: ComplexProps) => (
      <div onClick={onClick}>
        {id}: {data.label} ({data.count})
      </div>
    );

    const { Context, DynamicRenderer } = createDynamicRenderer<ComplexProps>({
      contextName: 'Complex',
    });

    const getRenderer = () => ComplexRenderer;
    const handleClick = jest.fn();

    const { getByText } = render(
      <Context.Provider value={{ getRenderer }}>
        <DynamicRenderer id="complex-1" data={{ label: 'Test', count: 5 }} onClick={handleClick} />
      </Context.Provider>
    );

    const element = getByText('complex-1: Test (5)');
    expect(element).toBeDefined();

    element.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should use custom context name in error messages', () => {
    const { DynamicRenderer } = createDynamicRenderer<TestProps>({
      contextName: 'CustomDynamic',
    });

    expect(() => {
      render(<DynamicRenderer name="test" value={1} />);
    }).toThrow(
      "Invalid CustomDynamic 'undefined'. Make sure this component is wrapped under <CustomDynamicContext.Provider> with valid value."
    );
  });
});
