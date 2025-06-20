import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { isAdmin } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Lightbulb, BarChart3, Shield } from "lucide-react";

interface LeftSidebarProps {
  onOpenCreatePost: () => void;
  onOpenNFTMinting: () => void;
  onOpenAdminDashboard?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenCreatePost,
  onOpenNFTMinting,
  onOpenAdminDashboard,
}) => {
  const { userData } = useAuth();

  if (!userData) return null;

  const getRoleDisplay = (role: string, isVerified: boolean) => {
    if (isVerified) {
      switch (role) {
        case "teacher":
          return "Verified Teacher";
        case "educator":
          return "Verified Educator";
        case "parent":
          return "Parent";
        default:
          return "User";
      }
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
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

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="overflow-hidden">
        {/* Profile banner */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-green-500">
          {userData.bannerImage && (
            <img
              src={userData.bannerImage}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <CardContent className="px-6 pb-6">
          {/* Profile picture */}
          <div className="flex items-center -mt-10 mb-4">
            <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-900 shadow-lg">
              <AvatarImage src={userData.profilePicture} alt={userData.displayName} />
              <AvatarFallback className="text-2xl">
                {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {userData.displayName}
                </h3>
                {userData.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </Badge>
                )}
              </div>
              <p className={`text-sm font-medium ${getRoleColor(userData.role)}`}>
                {getRoleDisplay(userData.role, userData.isVerified)}
              </p>
            </div>

            {userData.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{userData.bio}</p>
            )}

            {/* Quick Stats */}
            <div className="flex justify-between text-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {userData.stats?.posts || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {userData.stats?.following || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {userData.stats?.followers || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onOpenCreatePost}
            >
              <Plus className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-sm font-medium">Create Post</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onOpenNFTMinting}
            >
              <Lightbulb className="w-5 h-5 mr-3 text-green-600" />
              <span className="text-sm font-medium">Mint Achievement</span>
            </Button>

            <Link href="/analytics">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="w-5 h-5 mr-3 text-amber-600" />
                <span className="text-sm font-medium">View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Admin Panel Access */}
      {isAdmin(userData) && (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </h4>
            <Button
              onClick={onOpenAdminDashboard}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeftSidebar;
