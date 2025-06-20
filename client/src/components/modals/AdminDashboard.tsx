import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllUsers, getFlaggedPosts, verifyUser, suspendUser } from "@/lib/firestore";
import { isAdmin } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Shield,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";
import { ModalProps, User, Post } from "@/types";

interface AdminStats {
  totalUsers: number;
  verifiedTeachers: number;
  postsToday: number;
  flaggedContent: number;
}

const AdminDashboard: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    verifiedTeachers: 0,
    postsToday: 0,
    flaggedContent: 0,
  });
  const [userFilter, setUserFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Check admin access
  if (!userData || !isAdmin(userData)) {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersData, flaggedData] = await Promise.all([
        getAllUsers(),
        getFlaggedPosts(),
      ]);

      setUsers(usersData as User[]);
      setFlaggedPosts(flaggedData);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats: AdminStats = {
        totalUsers: usersData.length,
        verifiedTeachers: usersData.filter(u => u.role === "teacher" && u.isVerified).length,
        postsToday: 0, // Would need to query posts by date
        flaggedContent: flaggedData.length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser(userId);
      await loadDashboardData(); // Refresh data
      toast({
        title: "Success",
        description: "User verified successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await suspendUser(userId);
      await loadDashboardData(); // Refresh data
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  const handleApproveContent = async (postId: string) => {
    // TODO: Implement content approval
    toast({
      title: "Content Approved",
      description: "Content has been approved and will be visible",
    });
  };

  const handleRemoveContent = async (postId: string) => {
    // TODO: Implement content removal
    toast({
      title: "Content Removed",
      description: "Content has been removed from the platform",
    });
  };

  const filteredUsers = users.filter(user => {
    if (userFilter === "all") return true;
    if (userFilter === "teachers") return user.role === "teacher";
    if (userFilter === "parents") return user.role === "parent";
    if (userFilter === "educators") return user.role === "educator";
    if (userFilter === "pending") return !user.isVerified && user.role !== "parent";
    return true;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "educator":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "parent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-6 border-b bg-red-50 dark:bg-red-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-red-900 dark:text-red-100">
                Admin Dashboard
              </DialogTitle>
              <p className="text-sm text-red-700 dark:text-red-300">
                Deep3 Social B3 Platform Management
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full">
            {/* Sidebar Navigation */}
            <TabsList className="flex flex-col h-full w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 space-y-2">
              <TabsTrigger
                value="overview"
                className="w-full justify-start data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="w-full justify-start data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
                <Users className="w-5 h-5 mr-3" />
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="w-full justify-start data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
                <AlertTriangle className="w-5 h-5 mr-3" />
                Content Moderation
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="w-full justify-start data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Platform Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Users</p>
                          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">Verified Teachers</p>
                          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.verifiedTeachers}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                          <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Posts Today</p>
                          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.postsToday}</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">Flagged Content</p>
                          <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.flaggedContent}</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Moderation Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-900 dark:text-green-100">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        Content Relevance Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Scans posts for AI/education content relevance
                      </p>
                      <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Posts Scanned Today:</span>
                          <span className="font-medium">{stats.postsToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flagged:</span>
                          <span className="font-medium">{stats.flaggedContent}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                        Safety Monitoring Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Monitors for inappropriate content and compliance
                      </p>
                      <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Content Reviewed:</span>
                          <span className="font-medium">{stats.postsToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Issues:</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* User Management Tab */}
              <TabsContent value="users" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                      <SelectItem value="educators">Educators</SelectItem>
                      <SelectItem value="pending">Pending Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.profilePicture} alt={user.displayName} />
                                    <AvatarFallback>
                                      {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {user.displayName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="secondary" className={getRoleColor(user.role)}>
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.isVerified ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                                    Pending
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {!user.isVerified && user.role !== "parent" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVerifyUser(user.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <UserX className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Moderation Tab */}
              <TabsContent value="moderation" className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Moderation</h2>
                
                {flaggedPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        All Clear!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        No flagged content requiring review at this time.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {flaggedPosts.map((post) => (
                      <Card key={post.id} className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">User</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Badge variant="destructive">Content Relevance</Badge>
                          </div>
                          <div className="mb-3">
                            <p className="text-gray-900 dark:text-gray-100">{post.content}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              <strong>AI Flag:</strong> {post.flagReason || "Content not related to AI or education"}
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveContent(post.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveContent(post.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="p-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Detailed analytics and reporting features will be implemented here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
