import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema=z.object({content:z.string().trim().max(2000).optional()});
export async function POST(request:Request,context:{params:Promise<{id:string}>}){
 const user=await getCurrentUser(); if(!user)return NextResponse.json({error:"Authentication required."},{status:401});
 const {id:postId}=await context.params; const original=await prisma.post.findUnique({where:{id:postId},select:{id:true}});
 if(!original)return NextResponse.json({error:"Post not found."},{status:404});
 const parsed=schema.safeParse(await request.json().catch(()=>({}))); if(!parsed.success)return NextResponse.json({error:"Invalid share."},{status:400});
 const shared=await prisma.post.create({data:{content:parsed.data.content||"",authorId:user.id,sharedPostId:postId}});
 return NextResponse.json({post:shared},{status:201});
}
