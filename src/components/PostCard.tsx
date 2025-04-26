"use client";

import { createComment, deletePost, toggleLike } from "@/actions/post.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { FlagIcon, HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { getUserById } from "@/actions/user.action";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { reportPost } from "@/actions/report.action";

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
  const [showComments, setShowComments] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (dbUserId) {
        try {
          const user = await getUserById(dbUserId);
          if (user && user.image) {
            setUserImage(user.image);
          }
        } catch (err) {
          console.error("Failed to fetch user image", err);
        }
      }
    };

    fetchUserImage();
  }, [dbUserId]);

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

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(dbUserId, post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(dbUserId, post.id);
      if (result?.success) {
        toast.success("Post deleted successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportPost = async () => {
    if (!dbUserId || isReporting || !reportReason.trim()) return;

    try {
      setIsReporting(true);
      const result = await reportPost(dbUserId, post.id, reportReason.trim());

      if (result?.success) {
        toast.success("Report submitted successfully");
        setOpenReportDialog(false);
        setReportReason("");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Reason for reporting..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              disabled={isReporting || !reportReason.trim()}
              onClick={handleReportPost}
            >
              {isReporting ? "Reporting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex space-x-3 sm:space-x-4">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar className="size-12 sm:w-16 sm:h-16">
                  <AvatarImage src={post.author.image ?? "/avatar.png"} />
                </Avatar>
              </Link>

              {/* POST HEADER & TEXT CONTENT */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="font-semibold truncate"
                    >
                      {post.author.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Link href={`/profile/${post.author.username}`}>
                        @{post.author.username}
                      </Link>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  {/* Check if current user is the post author */}
                  {dbUserId === post.author.id && (
                    <DeleteAlertDialog
                      isDeleting={isDeleting}
                      onDelete={handleDeletePost}
                    />
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground break-words">
                  {post.content}
                </p>
              </div>
            </div>

            {/* POST IMAGE */}
            {post.image && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* POST OPERATIONS */}
            <div className="flex items-center pt-3 space-x-2 border-t mt-4">
              {dbUserId ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    hasLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-red-500"
                  }`}
                  onClick={handleLike}
                >
                  {hasLiked ? (
                    <HeartIcon className="size-4 fill-current" />
                  ) : (
                    <HeartIcon className="size-4" />
                  )}
                  <span className="text-sm font-medium">{likes}</span>
                </Button>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground gap-2"
                  >
                    <HeartIcon className="size-4" />
                    <span className="text-sm font-medium">{likes}</span>
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${
                  showComments
                    ? "text-blue-500"
                    : "text-muted-foreground hover:text-blue-500"
                }`}
                onClick={() => setShowComments((prev) => !prev)}
              >
                <MessageCircleIcon
                  className={`size-4 ${
                    showComments ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {post.comments.length}
                </span>
              </Button>

              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setOpenReportDialog(true)}
                      className="cursor-pointer flex items-center"
                    >
                      <FlagIcon className="size-4 mr-2 text-muted-foreground" />
                      <span>Report post</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {showComments && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-4">
                  {/* DISPLAY COMMENTS */}
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage
                          src={comment.author.image ?? "/avatar.png"}
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            @{comment.author.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ·
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                            ago
                          </span>
                        </div>
                        <p className="text-sm break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {dbUserId ? (
                  <div className="flex space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={userImage ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          className="flex items-center gap-2"
                          disabled={!newComment.trim() || isCommenting}
                        >
                          {isCommenting ? (
                            "Posting..."
                          ) : (
                            <>
                              <SendIcon className="size-4" />
                              Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                    {/* <SignInButton mode="modal">
                    <Button variant="outline" className="gap-2">
                      <LogInIcon className="size-4" />
                      Sign in to comment
                    </Button>
                  </SignInButton> */}
                    <p>Log in</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;

{
  /* <div className="flex items-center pt-3 space-x-2 border-t mt-4">
  {dbUserId ? (
    <Button
      variant="ghost"
      size="sm"
      className={`rounded-full transition-colors ${
        hasLiked
          ? "text-red-500 hover:text-red-600 hover:bg-red-100"
          : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
      }`}
      onClick={handleLike}
    >
      {hasLiked ? (
        <HeartIcon className="size-4 fill-current mr-1.5" />
      ) : (
        <HeartIcon className="size-4 mr-1.5" />
      )}
      <span className="text-sm font-medium">{likes}</span>
    </Button>
  ) : (
    <Link href="/login">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full text-muted-foreground hover:bg-slate-100 transition-colors"
      >
        <HeartIcon className="size-4 mr-1.5" />
        <span className="text-sm font-medium">{likes}</span>
      </Button>
    </Link>
  )}

  <Button
    variant="ghost"
    size="sm"
    className={`rounded-full transition-colors ${
      showComments
        ? "text-blue-500 hover:text-blue-600 hover:bg-blue-100"
        : "text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
    }`}
    onClick={() => setShowComments((prev) => !prev)}
  >
    <MessageCircleIcon
      className={`size-4 mr-1.5 ${
        showComments ? "fill-blue-500 text-blue-500" : ""
      }`}
    />
    <span className="text-sm font-medium">{post.comments.length}</span>
  </Button>

  <div className="ml-auto">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => setOpenReportDialog(true)}
          className="cursor-pointer flex items-center"
        >
          <FlagIcon className="size-4 mr-2 text-muted-foreground" />
          <span>Report post</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center">
          <ShareIcon className="size-4 mr-2 text-muted-foreground" />
          <span>Share post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div> */
}
