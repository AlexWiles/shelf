
export const uuid = (): string => {
  // not good, get a better solution
  return Math.random().toString(36).substr(2, 9);
};
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
