import { formatDistanceToNow } from "date-fns";
export const timeAgo = (_date: string) => {
  const date = new Date(_date);
  return formatDistanceToNow(date, { addSuffix: true });
};
