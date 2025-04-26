"use server";

import { prisma } from "@/lib/db";

export async function getReports() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: {
        select: {
          name: true,
        },
      },
      post: {
        select: {
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return reports;
}

export async function deletePost(postId: string) {
  await prisma.post.delete({
    where: { id: postId },
  });
}