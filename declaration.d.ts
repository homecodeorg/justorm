declare module 'compareq' {
  /**
   * Deep comparison of two values
   * @param a First value to compare
   * @param b Second value to compare
   * @returns True if values are equal
   */
  export default function compare<T>(a: T, b: T): boolean;
}

declare module 'rollup-plugin-uglify';
declare module 'rollup-plugin-optimize-js';
