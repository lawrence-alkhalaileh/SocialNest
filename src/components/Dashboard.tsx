// app/dashboard/page.tsx (or wherever this Dashboard is)
import { getReports } from "@/actions/admin.action";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Dashboard() {
  const reports = await getReports();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Report ID</TableHead>
          <TableHead>Reporter ID</TableHead>
          <TableHead>Post ID</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.id}</TableCell>
            <TableCell>{report.reporterId}</TableCell>
            <TableCell>{report.postId}</TableCell>
            <TableCell>{report.reason}</TableCell>
            <TableCell className="text-right">
              {new Date(report.createdAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total Reports: {reports.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
