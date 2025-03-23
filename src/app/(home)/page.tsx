import { getPosts } from "@/actions/post.action";
import { getUserById } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import SuggestUsers from "@/components/SuggestUsers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">
          <p>Please log in to see the content</p>
        </div>
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <SuggestUsers />
        </div>
      </div>
    );
  }

  const user = await getUserById(session.user.id);
  const posts: any = await getPosts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user && <CreatePost />}
        <div className="space-y-6">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} dbUserId={session.user.id} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestUsers />
      </div>
    </div>
  );
}
