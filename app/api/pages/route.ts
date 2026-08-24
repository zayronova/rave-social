import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(){const pages=await prisma.page.findMany({orderBy:{createdAt:"desc"},take:50,include:{owner:{select:{id:true,name:true}},_count:{select:{posts:true}}}});return NextResponse.json({pages});}
export async function POST(request:Request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const form=await request.formData();const name=String(form.get("name")||"").trim();const bio=String(form.get("bio")||"").trim();if(name.length<2||name.length>100||bio.length>300)return NextResponse.json({error:"Invalid page details."},{status:400});function slugify(v:string){return v.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)}let slug=slugify(name)||"page",base=slug,n=1;while(await prisma.page.findUnique({where:{slug}}))slug=`${base}-${n++}`;const page=await prisma.page.create({data:{name,bio,slug,ownerId:user.id},include:{owner:{select:{id:true,name:true}}}});return NextResponse.json({page},{status:201})}
