import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
export async function GET(request:Request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const q=new URL(request.url).searchParams.get("q")?.trim()||"";if(q.length<2)return NextResponse.json({users:[]});const users=await prisma.user.findMany({where:{AND:[{id:{not:user.id}},{OR:[{name:{contains:q,mode:"insensitive"}},{email:{contains:q,mode:"insensitive"}}]}]},select:{id:true,name:true,avatarUrl:true},take:25,orderBy:{name:"asc"}});return NextResponse.json({users});}
