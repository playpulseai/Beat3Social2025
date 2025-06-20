import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useLikePost, useSharePost, useComments, useAddComment } from "@/hooks/usePosts";
import { PostWithAuthor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PostCardProps {
  post: PostWithAuthor;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.uid || ""));

  const likePostMutation = useLikePost();
  const sharePostMutation = useSharePost();
  const addCommentMutation = useAddComment();
  const { data: comments } = useComments(post.id);

  const handleLike = async () => {
    if (!user) return;

    try {
      await likePostMutation.mutateAsync({
        postId: post.id,
        userId: user.uid,
      });
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!user) return;

    try {
      await sharePostMutation.mutateAsync({
        postId: post.id,
        userId: user.uid,
      });
      toast({
        title: "Success",
        description: "Post shared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        postId: post.id,
        authorId: user.uid,
        content: commentText.trim(),
      });
      setCommentText("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "text-green-600 dark:text-green-400";
      case "educator":
        return "text-blue-600 dark:text-blue-400";
      case "parent":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "ai":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "education":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "edtech":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "stem":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <CardContent className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.profilePicture} alt={post.author.displayName} />
              <AvatarFallback>
                {post.author.displayName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author.displayName}
                </h4>
                {post.author.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className={getRoleColor(post.author.role)}>
                  {post.author.role.charAt(0).toUpperCase() + post.author.role.slice(1)}
                </span>
                <span>•</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>

      {/* Post Content */}
      <CardContent className="px-6 pb-4">
        <p className="text-gray-900 dark:text-gray-100 mb-4">{post.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className={getTagColor(tag)}>
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Post Media */}
      {post.mediaUrls.length > 0 && (
        <div className="px-6 pb-4">
          {post.mediaType === "image" && (
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          {post.mediaType === "video" && (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <video
                src={post.mediaUrls[0]}
                className="w-full h-64 object-cover"
                controls
                preload="metadata"
              />
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <CardContent className="px-6 pb-6">
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likePostMutation.isPending}
              className={isLiked ? "text-red-500" : "text-gray-500"}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
              <span>{post.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>{post.comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={sharePostMutation.isPending}
            >
              <Share2 className="w-5 h-5 mr-2" />
              <span>{post.shares.length}</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Add Comment */}
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.profilePicture} alt={userData?.displayName} />
                <AvatarFallback>
                  {userData?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                >
                  Comment
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {comments && comments.length > 0 && (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.profilePicture} alt={comment.author.displayName} />
                      <AvatarFallback>
                        {comment.author.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {comment.author.displayName}
                          </span>
                          {comment.author.isVerified && (
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likes.length}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
