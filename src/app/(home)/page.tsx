import { getUserById } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">{user && <CreatePost />}</div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestUsers />
      </div>
    </div>
  );
}
