import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Zap, Lightbulb } from "lucide-react";

interface RightSidebarProps {
  onOpenNFTMinting: () => void;
}

// Mock data for demonstration - in production, this would come from Firebase
const trendingTopics = [
  { tag: "ChatGPTInClassroom", count: 245, status: "trending" as const },
  { tag: "AITutoring", count: 189, status: "rising" as const },
  { tag: "EdTechTools", count: 156, status: "stable" as const },
  { tag: "STEMEducation", count: 134, status: "stable" as const },
];

const suggestedUsers = [
  {
    id: "1",
    name: "Dr. Alex Kumar",
    role: "EdTech Specialist",
    isVerified: true,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "2",
    name: "Emma Thompson",
    role: "Math Teacher",
    isVerified: false,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "3",
    name: "Sofia Martinez",
    role: "Parent Advocate",
    isVerified: false,
    avatar: "/api/placeholder/40/40",
  },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ onOpenNFTMinting }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "trending":
        return "text-green-600 dark:text-green-400";
      case "rising":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "trending":
        return "Trending";
      case "rising":
        return "Rising";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trending in Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">#{topic.tag}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{topic.count} posts</p>
              </div>
              {getStatusLabel(topic.status) && (
                <Badge variant="secondary" className={getStatusColor(topic.status)}>
                  {getStatusLabel(topic.status)}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Suggested for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    {user.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NFT Minting Preview */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100">NFT Achievements</h4>
          </div>

          <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
            Mint educational achievements as NFTs. Perfect for certificates, test scores, and milestones!
          </p>

          {/* Fee Structure Preview */}
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Minting Fees</h5>
            <div className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <div className="flex justify-between">
                <span>Base Minting Fee:</span>
                <span>0.005 ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>0.002 ETH</span>
              </div>
              <div className="flex justify-between font-medium border-t border-purple-200 dark:border-purple-700 pt-1 mt-2">
                <span>Total:</span>
                <span>0.007 ETH</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onOpenNFTMinting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            Start Minting
          </Button>

          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 text-center">
            Wallet required (MetaMask, Foxfire, etc.)
          </p>
        </CardContent>
      </Card>

      {/* AI Moderation Status */}
      <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">AI Moderation Active</h4>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mb-3">
            All posts are automatically scanned for educational relevance and safety.
          </p>
          <div className="space-y-2 text-xs text-green-600 dark:text-green-400">
            <div className="flex justify-between">
              <span>Content Agent:</span>
              <span className="text-green-500">Online ✓</span>
            </div>
            <div className="flex justify-between">
              <span>Safety Agent:</span>
              <span className="text-green-500">Online ✓</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
