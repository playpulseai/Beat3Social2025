import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { uploadProfilePicture, uploadBannerImage } from "@/lib/storage";
import Navigation from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Save, User, Mail, Briefcase, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Profile: React.FC = () => {
  const { user, userData, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || "",
    bio: userData?.bio || "",
  });

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        bio: userData.bio || "",
      });
    }
  }, [userData]);

  if (!user || !userData) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
      });
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userData.displayName || "",
      bio: userData.bio || "",
    });
    setIsEditing(false);
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Profile picture must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageUrl = await uploadProfilePicture(file, user.uid);
      await updateProfile({ profilePicture: imageUrl });
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Banner image must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageUrl = await uploadBannerImage(file, user.uid);
      await updateProfile({ bannerImage: imageUrl });
      
      toast({
        title: "Banner updated",
        description: "Your banner image has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload banner image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "educator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "parent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            {/* Banner Section */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-green-500">
              {userData.bannerImage && (
                <img
                  src={userData.bannerImage}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4">
                <label htmlFor="banner-upload" className="cursor-pointer">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Banner
                  </Button>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start justify-between -mt-16 mb-6">
                <div className="flex items-end space-x-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 shadow-lg">
                      <AvatarImage src={userData.profilePicture} alt={userData.displayName} />
                      <AvatarFallback className="text-2xl">
                        {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 cursor-pointer">
                      <div className="p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                        <Camera className="w-3 h-3" />
                      </div>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="pt-8">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {userData.displayName}
                      </h1>
                      {userData.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                    <Badge variant="secondary" className={getRoleColor(userData.role)}>
                      {getRoleDisplay(userData.role, userData.isVerified)}
                    </Badge>
                  </div>
                </div>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="default"
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center space-x-8 py-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {userData.stats?.posts || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {userData.stats?.following || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {userData.stats?.followers || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        className="mt-1 min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</Label>
                      <p className="text-gray-900 dark:text-gray-100 mt-1">
                        {userData.bio || "No bio provided yet."}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</Label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">{userData.email}</p>
                </div>
                
                {userData.workEmail && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      Work Email
                    </Label>
                    <p className="text-gray-900 dark:text-gray-100 mt-1">{userData.workEmail}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member Since
                  </Label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {formatDistanceToNow(userData.createdAt, { addSuffix: true })}
                  </p>
                </div>

                {!userData.isVerified && userData.role !== "parent" && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Verification Pending:</strong> Your account is under review for verification. 
                      This usually takes 24-48 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
