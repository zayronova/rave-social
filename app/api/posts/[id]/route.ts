import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
export async function DELETE(_:Request,context:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const {id}=await context.params;const post=await prisma.post.findUnique({where:{id},select:{id:true,authorId:true}});if(!post)return NextResponse.json({error:"Post not found."},{status:404});if(post.authorId!==user.id)return NextResponse.json({error:"You can only delete your own posts."},{status:403});await prisma.post.delete({where:{id}});return NextResponse.json({success:true});}
