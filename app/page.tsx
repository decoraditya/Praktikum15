import Link from "next/link";
import { prisma } from "../lib/prisma";
import { createNote, updateNote, deleteNote } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? Number(edit) : null;
  const notes = await prisma.note.findMany({ orderBy: { id: "desc" } });

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Aplikasi Catatan</h1>

      <form action={createNote} style={{ display: "grid", gap: 8, margin: "16px 0" }}>
        <input name="title" placeholder="Judul" required />
        <textarea name="content" placeholder="Isi catatan" required />
        <button type="submit">Tambah Catatan</button>
      </form>

      <hr />

      {notes.length === 0 && <p>Belum ada catatan.</p>}

      {notes.map((note) =>
        note.id === editId ? (
          <form key={note.id} action={updateNote} style={{ display: "grid", gap: 8, margin: "16px 0" }}>
            <input type="hidden" name="id" value={note.id} />
            <input name="title" defaultValue={note.title} required />
            <textarea name="content" defaultValue={note.content} required />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Simpan</button>
              <Link href="/">Batal</Link>
            </div>
          </form>
        ) : (
          <div key={note.id} style={{ margin: "16px 0", padding: 12, border: "1px solid #888", borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{note.title}</h3>
            <p>{note.content}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/?edit=${note.id}`}>Edit</Link>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <button type="submit">Hapus</button>
              </form>
            </div>
          </div>
        )
      )}
    </main>
  );
} 