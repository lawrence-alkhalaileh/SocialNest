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
          content: true,
          image: true,
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


export async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  return users;
}

export async function getRecentPosts() {
  const posts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return posts;
}
