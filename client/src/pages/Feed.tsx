import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import Navigation from "@/components/layout/Navigation";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import CreatePostModal from "@/components/modals/CreatePostModal";
import NFTMintingModal from "@/components/modals/NFTMintingModal";
import AdminDashboard from "@/components/modals/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const Feed: React.FC = () => {
  const { user } = useAuth();
  const { posts, isLoading, hasMore, loadMore } = usePosts();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isNFTMintingOpen, setIsNFTMintingOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <LeftSidebar
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onOpenNFTMinting={() => setIsNFTMintingOpen(true)}
              onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
            />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Component */}
            <CreatePost onOpenModal={() => setIsCreatePostOpen(true)} />

            {/* Feed Posts */}
            <div className="space-y-6">
              {isLoading && posts.length === 0 ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </div>
                ))
              ) : posts.length === 0 ? (
                // Empty state
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Be the first to share something educational! Create a post to get started.
                  </p>
                  <Button onClick={() => setIsCreatePostOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                // Posts list
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center py-8">
                  <Button
                    onClick={loadMore}
                    disabled={isLoading}
                    variant="outline"
                    className="px-8 py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Posts"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RightSidebar onOpenNFTMinting={() => setIsNFTMintingOpen(true)} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
      
      <NFTMintingModal
        isOpen={isNFTMintingOpen}
        onClose={() => setIsNFTMintingOpen(false)}
      />
      
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
};

export default Feed;
