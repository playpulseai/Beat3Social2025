import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePost } from "@/hooks/usePosts";
import { uploadPostMedia } from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/FileUpload";
import { X } from "lucide-react";
import { CreatePostData, ModalProps } from "@/types";

const availableTags = [
  "ai",
  "education",
  "edtech",
  "stem",
  "classroom",
  "learning",
  "teaching",
  "students",
  "math",
  "science",
  "physics",
  "chemistry",
  "biology",
  "history",
  "language",
  "coding",
  "programming",
  "robotics",
  "innovation",
  "creativity",
];

const CreatePostModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const createPostMutation = useCreatePost();

  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userData) return;
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post",
        variant: "destructive",
      });
      return;
    }

    if (selectedTags.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one tag",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files first
      const mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map((file) =>
          uploadPostMedia(file, user.uid, Date.now().toString())
        );
        const urls = await Promise.all(uploadPromises);
        mediaUrls.push(...urls);
      }

      const postData: CreatePostData = {
        content: content.trim(),
        tags: selectedTags,
        mediaFiles,
      };

      await createPostMutation.mutateAsync({
        postData,
        authorId: user.uid,
      });

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      // Reset form
      setContent("");
      setSelectedTags([]);
      setMediaFiles([]);
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  if (!userData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.profilePicture} alt={userData.displayName} />
              <AvatarFallback>
                {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userData.isVerified ? "Verified " : ""}{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </p>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your educational insights, AI discoveries, or classroom innovations..."
              className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Required) - Select at least one
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Media (Optional)
            </label>
            <FileUpload
              onFilesSelected={setMediaFiles}
              maxFiles={3}
              maxSize={10 * 1024 * 1024} // 10MB
              acceptedTypes={["image/*", "video/*"]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || selectedTags.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
