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
import { Card } from "@/components/ui/card";
import { PostModal } from "@/components/PostModal";
const Reports = async () => {
  const reports = await getReports();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporter Name</TableHead>
                <TableHead>Poster Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.reporter?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {report.post?.author?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="space-x-2">
                    {report.postId && (
                      <>
                        <form
                          action={async () => {
                            "use server";
                            await deletePost(report.postId);
                            revalidatePath("/dashboard");
                          }}
                          style={{ display: "inline" }}
                        >
                          <Button type="submit" variant="destructive" size="sm">
                            Delete Post
                          </Button>
                        </form>
                        {report.post && (
                          <PostModal
                            post={{
                              image: report.post.image ?? undefined,
                              content: report.post.content ?? undefined,
                            }}
                          />
                        )}
                      </>
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
                <TableCell colSpan={6}>
                  Total Reports: {reports.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
