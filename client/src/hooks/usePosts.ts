import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, likePost, sharePost, getComments, addComment } from "@/lib/firestore";
import { getMockPosts, createMockPost } from "@/lib/mockData";
import { getUserData } from "@/lib/auth";
import { PostWithAuthor, CommentWithAuthor, CreatePostData } from "@/types";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const usePosts = () => {
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [allPosts, setAllPosts] = useState<PostWithAuthor[]>([]);

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/posts", lastDoc],
    queryFn: async () => {
      try {
        return await getPosts(lastDoc);
      } catch (error) {
        // Fallback to mock data when Firebase is unavailable
        console.log("Using mock data for posts");
        return await getMockPosts();
      }
    },
  });

  useEffect(() => {
    if (postsData?.posts) {
      const fetchPostsWithAuthors = async () => {
        const postsWithAuthors = await Promise.all(
          postsData.posts.map(async (post) => {
            const author = await getUserData(post.authorId);
            return {
              ...post,
              author: author!,
            } as PostWithAuthor;
          })
        );

        if (lastDoc) {
          setAllPosts(prev => [...prev, ...postsWithAuthors]);
        } else {
          setAllPosts(postsWithAuthors);
        }
      };

      fetchPostsWithAuthors();
    }
  }, [postsData, lastDoc]);

  const loadMore = () => {
    if (postsData?.lastDoc && postsData?.hasMore) {
      setLastDoc(postsData.lastDoc);
    }
  };

  return {
    posts: allPosts,
    isLoading,
    error,
    hasMore: postsData?.hasMore || false,
    loadMore,
    refetch,
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postData, authorId }: { postData: CreatePostData; authorId: string }) => {
      try {
        // Try Firebase first, fall back to mock if it fails
        const { createPost } = await import("@/lib/firestore");
        
        // Upload media files to Firebase Storage first
        const mediaUrls: string[] = [];
        
        if (postData.mediaFiles && postData.mediaFiles.length > 0) {
          const { uploadPostMedia } = await import("@/lib/storage");
          
          for (const file of postData.mediaFiles) {
            const postId = Date.now().toString(); // Temporary ID for file naming
            const url = await uploadPostMedia(file, authorId, postId);
            mediaUrls.push(url);
          }
        }

        return await createPost({
          content: postData.content,
          tags: postData.tags,
          mediaUrls,
          mediaType: postData.mediaFiles.length > 0 ? 
            (postData.mediaFiles[0].type.startsWith('video/') ? 'video' : 'image') : 'none',
          authorId,
          isModerated: false,
          isFlagged: false,
        });
      } catch (error) {
        // Fallback to mock data system
        console.log("Using mock data for post creation");
        const { createMockPost } = await import("@/lib/mockData");
        
        return await createMockPost({
          content: postData.content,
          tags: postData.tags,
          authorId,
          mediaUrls: [],
          mediaType: "none",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) => {
      return likePost(postId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) => {
      return sharePost(postId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["/api/comments", postId],
    queryFn: async () => {
      const comments = await getComments(postId);
      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          const author = await getUserData(comment.authorId);
          return {
            ...comment,
            author: author!,
          } as CommentWithAuthor;
        })
      );
      return commentsWithAuthors;
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });
};
