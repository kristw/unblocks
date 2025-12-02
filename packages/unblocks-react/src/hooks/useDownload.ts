import { useCallback } from 'react';

function prepareBlob(content: string | Blob | Record<string, unknown> | Record<string, unknown>[]): Blob {
  if (typeof content === 'string') {
    return new Blob([content], { type: 'text/plain' });
  }
  if (content instanceof Blob) {
    return content;
  }
  return new Blob([JSON.stringify(content)], { type: 'application/json' });
}

/**
 * A hook that returns a function to download a file with the given name and content.
 * @param fileName file name with extension
 * @param fileContent the content of the file, can be a string or a Blob
 */
export default function useDownload(
  fileName: string,
  fileContent: string | Blob | Record<string, unknown> | Record<string, unknown>[]
) {
  const download = useCallback(() => {
    const url = URL.createObjectURL(prepareBlob(fileContent));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [fileName, fileContent]);

  return { download };
}
