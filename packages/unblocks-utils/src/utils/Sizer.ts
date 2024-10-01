type ValueOf<T extends readonly string[]> = T[number];

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
  down(size: ValueOf<O>, amount: number = 1, minSize: ValueOf<O> = 'xs'): ValueOf<O> {
    const index = this.indexOf(size);
    const minIndex = this.options.indexOf(minSize);

    return this.options[Math.max(index - amount, minIndex)] as ValueOf<O>;
  }

  /**
   * Adjust size up
   * @param size size to change
   * @param amount offset
   * @param maxSize maximum size allowed
   * @returns new size
   */
  up(size: ValueOf<O>, amount: number = 1, maxSize: ValueOf<O> = 'xl'): ValueOf<O> {
    const index = this.indexOf(size);
    const maxIndex = this.options.indexOf(maxSize);

    return this.options[Math.min(index + amount, maxIndex)] as ValueOf<O>;
  }
}
