// app/dashboard/page.tsx

import { getReports, deletePost } from "@/actions/admin.action";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import SignOut from "./ui/SignOut";
import { Card } from "@/components/ui/card";

export default async function Dashboard() {
  const reports = await getReports();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <SignOut />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[100px]">Report ID</TableHead>
                <TableHead>Reporter Name</TableHead>
                <TableHead>Poster Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.reporter?.name || "Unknown"}</TableCell>
                  <TableCell>{report.post?.author?.name || "Unknown"}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    {report.postId && (
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(report.postId);
                          revalidatePath("/dashboard");
                        }}
                      >
                        <Button type="submit" variant="destructive" size="sm">
                          Delete Post
                        </Button>
                      </form>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(report.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="bg-gray-100">Total Reports: {reports.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </div>
    </div>
  );
}