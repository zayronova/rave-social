import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
export async function GET(_:Request,context:{params:Promise<{id:string}>}){const me=await getCurrentUser();if(!me)return NextResponse.json({error:"Authentication required."},{status:401});const {id}=await context.params;const user=await prisma.user.findUnique({where:{id},select:{id:true,name:true,email:true,avatarUrl:true,bio:true,createdAt:true,_count:{select:{followers:true,following:true,posts:true}}}});if(!user)return NextResponse.json({error:"User not found."},{status:404});const following=!!await prisma.follow.findUnique({where:{followerId_followingId:{followerId:me.id,followingId:id}}});return NextResponse.json({user,following});}
