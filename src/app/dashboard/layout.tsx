import { Button } from "@/components/ui/button";
import SignOut from "@/components/ui/SignOut";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex min-h-screen">
        <div className="w-64 shadow-lg p-4">
          <h1 className="text-xl font-bold mb-6">
            <Link href="/dashboard">Admin Dashboard</Link>
          </h1>
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/reports">Reports</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/users">Users</Link>
            </Button>
          </nav>
          <div className="mt-auto pt-6">
            <SignOut />
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
