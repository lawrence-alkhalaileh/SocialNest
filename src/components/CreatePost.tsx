"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createPost } from "@/actions/post.action";
import { uploadFile } from "@/actions/aws.action";
import { ImageUpload } from "./ImageUpload";

const CreatePost = () => {
  const { data: session } = useSession();
  const id = session?.user.id;
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    if (!id) {
      toast.error("You need to be logged in to post");
      return;
    }

    setIsPosting(true);
    try {
      const result = await createPost(id, content, imageUrl);
      if (result.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created successfully!");
      } else {
        toast.error(result.message || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    try {
      const result = await uploadFile(formData);
      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while uploading the image");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12 ">
              <AvatarImage src={session?.user?.image || "/avatar.png"} />
            </Avatar>
            <Textarea
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-3 text-base"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {showImageUpload && (
            <div className="pl-16">
              <form action={handleImageUpload}>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  className="mb-2"
                />
                <ImageUpload />
              </form>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
