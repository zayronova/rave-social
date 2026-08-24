import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function admin(){const u=await getCurrentUser();if(!u)return null;const db=await prisma.user.findUnique({where:{id:u.id},select:{id:true,role:true}});return db?.role==="ADMIN"?db:null;}
export async function GET(){const a=await admin();if(!a)return NextResponse.json({error:"Admin access required."},{status:403});const reports=await prisma.report.findMany({orderBy:{createdAt:"desc"},take:100,include:{reporter:{select:{id:true,name:true}},post:{select:{id:true,content:true}},reportedUser:{select:{id:true,name:true}}}});return NextResponse.json({reports});}
export async function PATCH(request:Request){const a=await admin();if(!a)return NextResponse.json({error:"Admin access required."},{status:403});const body=await request.json();const id=String(body.id||"");const status=String(body.status||"");if(!id||!["PENDING","REVIEWED","RESOLVED","DISMISSED"].includes(status))return NextResponse.json({error:"Invalid moderation update."},{status:400});const report=await prisma.report.update({where:{id},data:{status}});return NextResponse.json({report});}
