import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user = await getCurrentUser();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { author: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { likes: true, comments: true } } },
  });

  if (!user) {
    return (
      <main className="auth">
        <section className="card auth-card">
          <h1>Rave Social</h1>
          <p>An independent social network for connecting with people, sharing posts, and building communities.</p>
          <Link href="/login"><button className="primary">Log in</button></Link>
          <Link href="/signup"><button className="secondary">Create account</button></Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">Rave Social</div>
        <nav className="nav"><Link href="/">Home</Link><Link href="/profile">Profile</Link><Link href="/pages">Pages</Link><form action="/api/auth/logout" method="post"><button>Log out</button></form></nav>
      </header>
      <main className="container feed-layout">
        <aside className="side panel"><strong>{user.name}</strong><p>{user.email}</p><Link href="/profile">View profile</Link></aside>
        <section>
          <div className="panel postbox">
            <h2>Home Feed</h2>
            <form action="/api/posts" method="post"><textarea name="content" placeholder="What's on your mind?" required maxLength={5000}/><button className="primary">Post</button></form>
          </div>
          {posts.map((post) => <article className="panel post" key={post.id}><div className="post-head"><div className="avatar">{post.author.name.slice(0,1).toUpperCase()}</div><div><strong>{post.author.name}</strong><div className="stats">{post.createdAt.toLocaleString()}</div></div></div><p>{post.content}</p><div className="stats">{post._count.likes} likes · {post._count.comments} comments</div><div className="actions"><button className="action">Like</button><button className="action">Comment</button><button className="action">Share</button></div></article>)}
        </section>
        <aside className="side panel"><strong>Rave Social</strong><p>More features are being built into the platform.</p></aside>
      </main>
    </>
  );
}
