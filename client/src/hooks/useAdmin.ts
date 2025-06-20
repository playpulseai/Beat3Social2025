import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllUsers, 
  verifyUser, 
  suspendUser, 
  getFlaggedPosts,
  createModerationLog 
} from "@/lib/firestore";
import { AdminStats } from "@/types";

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });
};

export const useFlaggedPosts = () => {
  return useQuery({
    queryKey: ["admin", "flaggedPosts"],
    queryFn: getFlaggedPosts,
  });
};

export const useAdminStats = () => {
  const { data: users } = useAllUsers();
  const { data: flaggedPosts } = useFlaggedPosts();

  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async (): Promise<AdminStats> => {
      const totalUsers = users?.length || 0;
      const verifiedTeachers = users?.filter(user => 
        user.role === "teacher" && user.isVerified
      ).length || 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const postsToday = users?.reduce((count, user) => {
        return count + (user.stats?.posts || 0);
      }, 0) || 0;

      const flaggedContent = flaggedPosts?.length || 0;

      return {
        totalUsers,
        verifiedTeachers,
        postsToday,
        flaggedContent,
      };
    },
    enabled: !!users,
  });
};

export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, adminId }: { userId: string; adminId: string }) => {
      await verifyUser(userId);
      
      // Log the moderation action
      await createModerationLog({
        action: "verify_user",
        targetId: userId,
        targetType: "user",
        moderatorId: adminId,
        reason: "Teacher verification approved",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      adminId, 
      reason 
    }: { 
      userId: string; 
      adminId: string; 
      reason: string; 
    }) => {
      await suspendUser(userId);
      
      // Log the moderation action
      await createModerationLog({
        action: "suspend_user",
        targetId: userId,
        targetType: "user",
        moderatorId: adminId,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

export const useFlagPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      postId, 
      reason, 
      moderatorId 
    }: { 
      postId: string; 
      reason: string; 
      moderatorId: string; 
    }) => {
      const { flagPost } = await import("@/lib/firestore");
      await flagPost(postId, reason);
      
      // Log the moderation action
      await createModerationLog({
        action: "flag_post",
        targetId: postId,
        targetType: "post",
        moderatorId,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flaggedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
};