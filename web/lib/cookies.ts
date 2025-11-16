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

  const cookieOptions = {
    path: "/",
    ...options,
  };

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.expires)
    cookieStr += `; expires=${cookieOptions.expires.toUTCString()}`;
  if (cookieOptions.path) cookieStr += `; path=${cookieOptions.path}`;

  document.cookie = cookieStr;
};

export const deleteFromCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
};
