import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar ";
import SideLogged from "./SideLogged";
import { getUserById } from "@/actions/user.action";

const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <UnAuthenticatedSidebar />;
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return <UnAuthenticatedSidebar />;
  }

  return <SideLogged user={user} />;
};

export default Sidebar;
