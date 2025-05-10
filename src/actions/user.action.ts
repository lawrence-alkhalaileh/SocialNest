"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
        role: true,
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

export async function toggleFollow(targetUser: string, userId: string) {
  try {
    if (userId === targetUser) return new Error("You cannot follow yourself !");
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUser,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUser,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUser,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUser,
            creatorId: userId,
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
