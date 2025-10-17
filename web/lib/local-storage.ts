export const getFromLocalStorage = (key: string) => localStorage.getItem(key);
export const setToLocalStorage = (key: string, value: string) =>
  localStorage.setItem(key, value);
export const deleteFromLocalStorage = (key: string) =>
  localStorage.removeItem(key);
