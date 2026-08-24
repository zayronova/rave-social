"use client";

import { useEffect, useState } from "react";

type Notification = { id: string; type: string; createdAt: string; readAt: string | null; actor: { id: string; name: string; avatarUrl: string } };

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/notifications").then(async r => { const d = await r.json(); if (!r.ok) return setError(d.error || "Unable to load notifications."); setItems(d.notifications); });
    fetch("/api/notifications", { method: "PATCH" });
  }, []);

  return <main className="container" style={{ paddingTop: 30 }}><section className="card"><h1>Notifications</h1>{error && <div className="error">{error}</div>}{items.length === 0 && !error && <p>No notifications yet.</p>}{items.map(item => <div className="panel" style={{ margin: "10px 0" }} key={item.id}><strong>{item.actor.name}</strong> {item.type.replaceAll("_", " ")}<div className="stats">{new Date(item.createdAt).toLocaleString()}</div></div>)}</section></main>;
}
