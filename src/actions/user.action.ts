"use server";

import { prisma } from "@/lib/db";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getRandomUsers(id: any) {
  try {
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: id,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}
