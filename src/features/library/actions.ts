"use server";

import { prisma } from "@/shared/config/prisma";
import { revalidatePath } from "next/cache";

export async function addToLibraryAction(userId: string, mangaId: string) {
  try {
    await prisma.libraryManga.create({
      data: {
        library: { connect: { userId } },
        manga: { connect: { mangadexId: mangaId } },
        category: "READING",
      },
    });

    revalidatePath(`/manga/${mangaId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add to library:", error);
    return { success: false, error: "Something went wrong" };
  }
}
