"use client";

import { FormEvent, useEffect, useState } from "react";

type Story={id:string;mediaUrl:string;caption:string;createdAt:string;user:{name:string;avatarUrl:string}};
export default function StoriesPage(){const[stories,setStories]=useState<Story[]>([]);const[url,setUrl]=useState("");const[caption,setCaption]=useState("");const[error,setError]=useState("");
async function load(){const r=await fetch("/api/stories");const d=await r.json();if(!r.ok)return setError(d.error||"Unable to load stories.");setStories(d.stories)}
useEffect(()=>{load()},[]);
async function submit(e:FormEvent){e.preventDefault();setError("");const r=await fetch("/api/stories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mediaUrl:url,caption})});const d=await r.json();if(!r.ok)return setError(d.error||"Unable to create story.");setUrl("");setCaption("");load()}
return <main className="container" style={{paddingTop:30}}><section className="card"><h1>Stories</h1>{error&&<div className="error">{error}</div>}<form onSubmit={submit}><input className="field" type="url" placeholder="Image URL" value={url} onChange={e=>setUrl(e.target.value)} required/><input className="field" placeholder="Caption" value={caption} onChange={e=>setCaption(e.target.value)} maxLength={500}/><button className="primary">Add story</button></form></section><section style={{display:"grid",gap:16,marginTop:16}}>{stories.map(s=><article className="card" key={s.id}><strong>{s.user.name}</strong><img src={s.mediaUrl} alt={s.caption||"Story"} style={{display:"block",width:"100%",maxHeight:500,objectFit:"cover",marginTop:10,borderRadius:12}}/><p>{s.caption}</p><small className="stats">{new Date(s.createdAt).toLocaleString()}</small></article>)}</section></main>}
