import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
const schema=z.object({content:z.string().trim().min(1).max(5000)});
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const {id}=await context.params;const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Post content is invalid."},{status:400});const post=await prisma.post.findUnique({where:{id},select:{id:true,authorId:true}});if(!post)return NextResponse.json({error:"Post not found."},{status:404});if(post.authorId!==user.id)return NextResponse.json({error:"You can only edit your own posts."},{status:403});const updated=await prisma.post.update({where:{id},data:{content:parsed.data.content},include:{author:{select:{id:true,name:true,avatarUrl:true}},_count:{select:{likes:true,comments:true}}}});return NextResponse.json({post:updated});}
