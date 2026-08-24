import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
const schema=z.object({name:z.string().trim().min(2).max(100),description:z.string().trim().max(1000).optional()});
export async function GET(){const pages=await prisma.page.findMany({orderBy:{createdAt:"desc"},take:50,include:{owner:{select:{id:true,name:true}},_count:{select:{posts:true}}}});return NextResponse.json({pages});}
export async function POST(request:Request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const p=schema.safeParse(await request.json());if(!p.success)return NextResponse.json({error:"Invalid page details."},{status:400});const base=p.data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)||"page";let slug=base,n=1;while(await prisma.page.findUnique({where:{slug}}))slug=`${base}-${n++}`;const page=await prisma.page.create({data:{name:p.data.name,bio:p.data.description||"",slug,ownerId:user.id}});return NextResponse.json({page},{status:201});}
