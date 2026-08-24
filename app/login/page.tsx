"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
 const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok){setError(d.error||"Login failed");setBusy(false);return}router.push("/");router.refresh();}
 return <main className="auth"><form className="card auth-card" onSubmit={submit}><h1>Rave Social</h1><p>Log in to your account.</p>{error&&<div className="error">{error}</div>}<input className="field" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="field" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="primary" disabled={busy}>{busy?"Logging in...":"Log in"}</button><Link href="/signup"><button type="button" className="secondary">Create new account</button></Link></form></main>
}
