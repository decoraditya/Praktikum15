"use client";

import { useEffect, useState } from "react";

type Note = { id: number; title: string; content: string };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch {}
  }, [notes, loaded]);

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    setNotes([{ id: Date.now(), title, content }, ...notes]);
    setTitle("");
    setContent("");
  }

  function startEdit(n: Note) {
    setEditId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setNotes(
      notes.map((n) =>
        n.id === editId ? { ...n, title: editTitle, content: editContent } : n
      )
    );
    setEditId(null);
  }

  function deleteNote(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Aplikasi Catatan</h1>

      <form onSubmit={addNote} style={{ display: "grid", gap: 8, margin: "16px 0" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi catatan" required />
        <button type="submit">Tambah Catatan</button>
      </form>

      <hr />

      {loaded && notes.length === 0 && <p>Belum ada catatan.</p>}

      {notes.map((n) =>
        n.id === editId ? (
          <form key={n.id} onSubmit={saveEdit} style={{ display: "grid", gap: 8, margin: "16px 0" }}>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} required />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Simpan</button>
              <button type="button" onClick={() => setEditId(null)}>Batal</button>
            </div>
          </form>
        ) : (
          <div key={n.id} style={{ margin: "16px 0", padding: 12, border: "1px solid #888", borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{n.title}</h3>
            <p>{n.content}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(n)}>Edit</button>
              <button onClick={() => deleteNote(n.id)}>Hapus</button>
            </div>
          </div>
        )
      )}
    </main>
  );
}