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

export const getCurrentUrl = (cb: (url: chrome.tabs.Tab) => void) => {
  chrome.tabs.query(
    {
      active: true,
    },
    (tabs) => {
      console.log(tabs);
      const tab = tabs.find(
        (t) => t.url && !t.url.startsWith("chrome-extension://")
      );
      if (tab) {
        cb(tab);
      }
    }
  );
};