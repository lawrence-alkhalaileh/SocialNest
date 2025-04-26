import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOut from "./ui/SignOut";

async function DesktopNavbar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {session?.user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`profile/${session.user.username}`}>
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <SignOut />
        </>
      ) : (
        <Link href="login">
          <Button variant="default">Log in</Button>
        </Link>
      )}
    </div>
  );
}
export default DesktopNavbar;
