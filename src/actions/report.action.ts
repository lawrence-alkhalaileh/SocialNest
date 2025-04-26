"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function reportPost(
  reporterId: string,
  postId: string,
  reason: string
) {
  try {
    await db.report.create({
      data: {
        reporterId,
        postId,
        reason,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error reporting post:", error);
    return { success: false, error: "Failed to report post" };
  }
}
