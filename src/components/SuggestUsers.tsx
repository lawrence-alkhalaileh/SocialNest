import { getRandomUsers } from "@/actions/user.action";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import FollowButton from "./FollowButton";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";

const SuggestUsers = async () => {
  const session = await getServerSession(authOptions);
  let users;
  if (session?.user?.id) {
    const id = session.user.id;
    users = await getRandomUsers(id);
  } else {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who To Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-1xl pl-2 leading-5">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowButton targetUserId={user.id} userId={session.user.id}/>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default SuggestUsers;