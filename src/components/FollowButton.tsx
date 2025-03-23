"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow } from "@/actions/user.action";

type FollowButtonProps = {
  targetUserId: string;
  userId: string;
};

function FollowButton({ targetUserId, userId }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await toggleFollow(targetUserId, userId);
      toast.success("User Followed Successfully");
    } catch (error) {
      toast.error("Error following user");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
}
export default FollowButton;