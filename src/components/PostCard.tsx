"use client";

import { toggleLike } from "@/actions/post.action";
import { useState } from "react";

type Post = any;

const PostCard = ({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) => {
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like: any) => like.userId === dbUserId)
  );
  const [likes, setLikes] = useState(post._count.likes);

  console.log(dbUserId);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev: any) => !prev);
      setLikes((prev: any) => prev + (hasLiked ? -1 : 1));
      await toggleLike(dbUserId, post.id);
    } catch (err) {
      console.error("Error liking a post", err);
      setLikes(post._count.likes);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {};

  const handleDeletePost = async () => {};

  return (
    <div>
      <h1>{likes}</h1>
    </div>
  );
};

export default PostCard;
