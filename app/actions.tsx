"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

export async function createNote(formData: FormData) {
  await prisma.note.create({
    data: {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
    },
  });
  revalidatePath("/");
}

export async function updateNote(formData: FormData) {
  await prisma.note.update({
    where: { id: Number(formData.get("id")) },
    data: {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
    },
  });
  revalidatePath("/");
  redirect("/");
}

export async function deleteNote(formData: FormData) {
  await prisma.note.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/");
}