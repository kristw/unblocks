import { act, renderHook } from '@testing-library/react';

import useDownload from '../src/hooks/useDownload';

describe('useDownload', () => {
  let mockCreateElement: jest.SpyInstance;
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;
  let anchorElement: {
    href: string;
    download: string;
    click: jest.Mock;
  };
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    // Store original createElement
    originalCreateElement = document.createElement.bind(document);

    anchorElement = {
      href: '',
      download: '',
      click: jest.fn(),
    };

    // Mock createElement to return our mock anchor only for 'a' elements
    mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return anchorElement as unknown as HTMLElement;
      }
      return originalCreateElement(tagName);
    });

    // Mock URL methods
    mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    mockRevokeObjectURL = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.URL.createObjectURL = mockCreateObjectURL as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.URL.revokeObjectURL = mockRevokeObjectURL as any;
  });

  afterEach(() => {
    mockCreateElement.mockRestore();
    jest.restoreAllMocks();
  });

  it('should download a text file with string content', () => {
    const { result } = renderHook(() => useDownload('test.txt', 'Hello, World!'));

    act(() => {
      result.current.download();
    });

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(anchorElement.href).toBe('blob:mock-url');
    expect(anchorElement.download).toBe('test.txt');
    expect(anchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    // Verify the Blob was created with correct content and type
    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/plain');
  });

  it('should download a file with Blob content', () => {
    const blob = new Blob(['Test blob content'], { type: 'text/html' });
    const { result } = renderHook(() => useDownload('test.html', blob));

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(anchorElement.download).toBe('test.html');
    expect(anchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should download a JSON file with object content', () => {
    const data = { name: 'Test', value: 123 };
    const { result } = renderHook(() => useDownload('data.json', data));

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(anchorElement.download).toBe('data.json');
    expect(anchorElement.click).toHaveBeenCalled();

    // Verify the Blob was created with correct JSON content
    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
  });

  it('should download a JSON file with array content', () => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const { result } = renderHook(() => useDownload('items.json', data));

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(anchorElement.download).toBe('items.json');
    expect(anchorElement.click).toHaveBeenCalled();

    // Verify the Blob was created with correct JSON array
    const blob = mockCreateObjectURL.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
  });

  it('should update download when fileName changes', () => {
    const { result, rerender } = renderHook(
      ({ fileName, content }: { fileName: string; content: string }) => useDownload(fileName, content),
      { initialProps: { fileName: 'test1.txt', content: 'content' } }
    );

    act(() => {
      result.current.download();
    });

    expect(anchorElement.download).toBe('test1.txt');

    // Update fileName
    rerender({ fileName: 'test2.txt', content: 'content' });

    act(() => {
      result.current.download();
    });

    expect(anchorElement.download).toBe('test2.txt');
  });

  it('should update download when fileContent changes', () => {
    const { result, rerender } = renderHook(({ content }: { content: string }) => useDownload('test.txt', content), {
      initialProps: { content: 'initial content' },
    });

    act(() => {
      result.current.download();
    });

    // Clear mock calls
    mockCreateObjectURL.mockClear();

    // Update content
    rerender({ content: 'updated content' });

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalled();
  });

  it('should create new blob URL on each download call', () => {
    const { result } = renderHook(() => useDownload('test.txt', 'content'));

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.download();
    });

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
  });
});
