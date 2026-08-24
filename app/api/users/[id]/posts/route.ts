import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";

export async function GET(request:Request,context:{params:Promise<{id:string}>}){
 const me=await getCurrentUser();
 if(!me)return NextResponse.json({error:"Authentication required."},{status:401});
 const {id:userId}=await context.params;
 const exists=await prisma.user.findUnique({where:{id:userId},select:{id:true}});
 if(!exists)return NextResponse.json({error:"User not found."},{status:404});
 const url=new URL(request.url);const limit=Math.min(Math.max(Number(url.searchParams.get("limit"))||20,1),50);const cursor=url.searchParams.get("cursor")||undefined;
 const posts=await prisma.post.findMany({where:{authorId:userId},orderBy:{createdAt:"desc"},take:limit+1,cursor:cursor?{id:cursor}:undefined,skip:cursor?1:0,include:{author:{select:{id:true,name:true,avatarUrl:true}},_count:{select:{likes:true,comments:true}}}});
 const next=posts.length>limit?posts[limit].id:null;if(posts.length>limit)posts.pop();
 return NextResponse.json({posts,nextCursor:next});
}
