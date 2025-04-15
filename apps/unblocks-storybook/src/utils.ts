export function minimalParameters(argTypes: Record<string, unknown> | undefined) {
  if (argTypes) {
    return {
      controls: {
        include: Object.keys(argTypes),
      },
    };
  }
  return {};
}
