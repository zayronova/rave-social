"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/profile").then(async r => { const d = await r.json(); if (!r.ok) return setError(d.error || "Unable to load profile."); setName(d.profile.name); setBio(d.profile.bio); setAvatarUrl(d.profile.avatarUrl); }); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setSaved(false);
    const r = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, bio, avatarUrl }) });
    const d = await r.json();
    if (!r.ok) return setError(d.error || "Unable to save profile.");
    setSaved(true); router.refresh();
  }

  return <main className="container" style={{ paddingTop: 30 }}><section className="card"><h1>Edit profile</h1>{error && <div className="error">{error}</div>}{saved && <div className="success">Profile saved.</div>}<form onSubmit={submit}><label>Name</label><input className="field" value={name} onChange={e => setName(e.target.value)} maxLength={80} required /><label>Bio</label><textarea className="field" value={bio} onChange={e => setBio(e.target.value)} maxLength={500} /><label>Avatar image URL</label><input className="field" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." /><button className="primary">Save profile</button></form></section></main>;
}
