import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
const schema=z.object({name:z.string().trim().min(2).max(80),bio:z.string().trim().max(500)});
export async function GET(_:Request,context:{params:Promise<{slug:string}>}){const {slug}=await context.params;const page=await prisma.page.findUnique({where:{slug},include:{owner:{select:{id:true,name:true}},_count:{select:{posts:true}}}});if(!page)return NextResponse.json({error:"Page not found."},{status:404});return NextResponse.json({page});}
export async function PATCH(request:Request,context:{params:Promise<{slug:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const {slug}=await context.params;const page=await prisma.page.findUnique({where:{slug},select:{id:true,ownerId:true}});if(!page)return NextResponse.json({error:"Page not found."},{status:404});if(page.ownerId!==user.id)return NextResponse.json({error:"Only the Page owner can edit it."},{status:403});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid Page details."},{status:400});const updated=await prisma.page.update({where:{id:page.id},data:{name:parsed.data.name,bio:parsed.data.bio}});return NextResponse.json({page:updated});}
