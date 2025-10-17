export const getFromCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

export const setToCookie = (
  name: string,
  value: string,
  options: { path?: string; expires?: Date } = {}
) => {
  if (typeof document === "undefined") return;

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires)
    cookieStr += `; expires=${options.expires.toUTCString()}`;
  if (options.path) cookieStr += `; path=${options.path}`;

  document.cookie = cookieStr;
};

export const deleteFromCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
};
