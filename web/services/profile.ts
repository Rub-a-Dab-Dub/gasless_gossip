import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export const getProfile = async () => {
  const res = await api.get<ApiResponse>("users/profile");
  if (res.data.error) throw new Error(res.data.message);
  return res.data.data;
};

export const getProfileStats = async () => {
  const res = await api.get<ApiResponse>("users/profile/stats");
  if (res.data.error) throw new Error(res.data.message);
  return res.data.data;
};

export const getMyPosts = async () => {
  const res = await api.get<ApiResponse>("posts/user/me");
  if (res.data.error) throw new Error(res.data.message);
  return res.data.data;
};
