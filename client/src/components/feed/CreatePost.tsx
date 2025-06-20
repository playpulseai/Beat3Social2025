import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Video } from "lucide-react";

interface CreatePostProps {
  onOpenModal: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onOpenModal }) => {
  const { userData } = useAuth();

  if (!userData) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.profilePicture} alt={userData.displayName} />
            <AvatarFallback>
              {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="flex-1 justify-start text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onOpenModal}
          >
            What's happening in your classroom today?
          </Button>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" onClick={onOpenModal}>
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm">Photo</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onOpenModal}>
              <Video className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm">Video</span>
            </Button>
          </div>
          <Button onClick={onOpenModal} className="bg-blue-600 hover:bg-blue-700 text-white">
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
