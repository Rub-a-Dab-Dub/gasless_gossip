import { useQuery } from "@tanstack/react-query";
import { getProfile, getProfileStats, getMyPosts } from "@/services/profile";

export function useProfileData() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });

  const statsQuery = useQuery({
    queryKey: ["profileStats"],
    queryFn: getProfileStats,
    staleTime: 1000 * 60 * 5,
  });

  const postsQuery = useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
    staleTime: 1000 * 60 * 1,
  });

  return {
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    profileStats: statsQuery.data,
    statsLoading: statsQuery.isLoading,

    myPosts: postsQuery.data ?? [],
    postsLoading: postsQuery.isLoading,
    postsError: postsQuery.error,
  };
}
