/** A generic type ModeType that represents a valid mode from the given list of modes. */
export type ModeType<Modes extends readonly string[]> = Modes[number];

export default class ModeManager<Modes extends readonly string[]> {
  /** An array of available modes */
  readonly modes: Modes;
  /** A map that stores the mode as a key and its corresponding index as the value. */
  private readonly modeToIndexMap: Record<ModeType<Modes>, number>;

  constructor(modes: Modes) {
    this.modes = modes;
    // Create the modeToIndexMap using the modes array to enable fast mode-to-index lookup.
    this.modeToIndexMap = modes.reduce(
      (acc, mode, index) => {
        acc[mode as ModeType<Modes>] = index;
        return acc;
      },
      {} as Record<ModeType<Modes>, number>
    );
  }

  /**
   * Get the mode at the specified index.
   * Throws an error if the index is out of bounds.
   * @param index
   * @returns mode
   */
  getMode(index: number): ModeType<Modes> {
    if (index < 0 || index >= this.modes.length) {
      throw new Error(`Invalid index: ${index}`);
    }
    return this.modes[index];
  }

  /**
   * Get the index of the specified mode.
   * Throws an error if the mode name is not found in the list of available modes.
   * @param mode
   * @returns index
   */
  getIndex(mode: string): number {
    const index = this.modeToIndexMap[mode as ModeType<Modes>];
    if (index === undefined) {
      throw new Error(`Invalid mode name: ${mode}`);
    }
    return index;
  }
}
