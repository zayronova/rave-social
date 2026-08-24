"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = { id: string; senderId: string; content: string; createdAt: string };

export default function MessagesPage() {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function load() {
    if (!conversationId) return;
    const r = await fetch(`/api/messages?conversationId=${encodeURIComponent(conversationId)}`);
    const d = await r.json();
    if (!r.ok) return setError(d.error || "Unable to load messages.");
    setMessages(d.messages);
  }

  useEffect(() => { load(); }, [conversationId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!conversationId || !content.trim()) return;
    const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, content }) });
    const d = await r.json();
    if (!r.ok) return setError(d.error || "Unable to send message.");
    setContent("");
    await load();
  }

  return <main className="container" style={{ paddingTop: 30 }}><section className="card"><h1>Messenger</h1><p>Enter a conversation ID to open a conversation.</p>{error && <div className="error">{error}</div>}<input className="field" placeholder="Conversation ID" value={conversationId} onChange={e => setConversationId(e.target.value)} /><div style={{ minHeight: 260, padding: 10 }}>{messages.map(m => <div className="panel" style={{ margin: "8px 0" }} key={m.id}><div>{m.content}</div><small className="stats">{new Date(m.createdAt).toLocaleString()}</small></div>)}</div><form onSubmit={send}><textarea className="field" placeholder="Write a message..." value={content} onChange={e => setContent(e.target.value)} maxLength={5000} /><button className="primary">Send</button></form></section></main>;
}
