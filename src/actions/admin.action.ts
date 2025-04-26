// app/actions/getReports.ts (or wherever your actions live)
"use server";

import { prisma } from "@/lib/db";

export async function getReports() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: true, // if you want reporter details
      post: true, // if you want post details
    },
  });

  return reports;
}
