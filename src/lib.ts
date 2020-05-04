export const uuid = (): string => {
  // not good, get a better solution
  return Math.random().toString(36).substr(2, 9);
};
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

declare global {
  interface Array<T> {
    uniqueBy(getKey: (obj: T) => string): T[];
  }
}

Array.prototype.uniqueBy = function (getKey) {
  const flags: { [flag: string]: true } = {};

  return this.filter((obj) => {
    const exists = flags[getKey(obj)];
    flags[getKey(obj)] = true;
    return !exists;
  });
}