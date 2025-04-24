type ValueOf<T extends readonly string[]> = T[number];

/**
 * A generic class Sizer that manages a list of sizes (e.g. "S", "M", "L").
 * It provides methods to get the index of a size, adjust sizes up or down.
 */
export default class Sizer<O extends readonly string[]> {
  public options: O;

  constructor(options: O) {
    this.options = options;
  }

  indexOf(size: ValueOf<O>): number {
    const index = this.options.indexOf(size);
    if (index === -1) {
      throw new Error(`Invalid size: ${size}`);
    }
    return index;
  }

  /**
   * Adjust size down
   * @param size size to change
   * @param amount offset
   * @param minSize minimum size allowed
   * @returns new size
   */
  down(size: ValueOf<O>, amount: number = 1, minSize?: ValueOf<O>): ValueOf<O> {
    const index = this.indexOf(size);
    const minIndex = typeof minSize !== 'undefined' ? this.options.indexOf(minSize) : 0;

    return this.options[Math.max(index - amount, minIndex)] as ValueOf<O>;
  }

  /**
   * Adjust size up
   * @param size size to change
   * @param amount offset
   * @param maxSize maximum size allowed
   * @returns new size
   */
  up(size: ValueOf<O>, amount: number = 1, maxSize?: ValueOf<O>): ValueOf<O> {
    const index = this.indexOf(size);
    const maxIndex = typeof maxSize !== 'undefined' ? this.options.indexOf(maxSize) : this.options.length - 1;

    return this.options[Math.min(index + amount, maxIndex)] as ValueOf<O>;
  }
}
