import { getProfileByUsername } from "@/actions/profile.acion";


export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

const Profile = async ({ params }: { params: { username: string[] } }) => {
  const { username } = await params;

  console.log(username);
  return <h1>{username}</h1>;
};

export default Profile;
