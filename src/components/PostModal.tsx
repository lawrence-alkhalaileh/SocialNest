"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PostData = {
  content?: string;
  image?: string;
};

export function PostModal({ post }: { post: PostData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-semibold">
          Post Details
        </DialogTitle>

        {post.image ? (
          <img
            src={post.image}
            alt="Post Image"
            className="w-full max-h-64 object-cover rounded mt-4"
          />
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            No image available.
          </p>
        )}

        <div className="mt-4">
          <p className="text-sm">
            {post.content || "No description available."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
