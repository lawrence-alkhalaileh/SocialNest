"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPost(id: string, content: string, image: string) {
  try {
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: id,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post: ", error);
    return { success: false, message: "Failed to create post!" };
  }
}
