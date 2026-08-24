import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
const schema=z.object({postId:z.string().optional(),userId:z.string().optional(),reason:z.enum(["SPAM","HARASSMENT","HATE","SCAM","OTHER"]),details:z.string().trim().max(1000).optional()}).refine(v=>v.postId||v.userId,{message:"A post or user is required."});
export async function POST(request:Request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const p=schema.safeParse(await request.json());if(!p.success)return NextResponse.json({error:"Invalid report."},{status:400});if(p.data.userId===user.id)return NextResponse.json({error:"You cannot report yourself."},{status:400});const report=await prisma.report.create({data:{reporterId:user.id,postId:p.data.postId||null,reportedUserId:p.data.userId||null,reason:p.data.reason,details:p.data.details||""}});return NextResponse.json({reportId:report.id},{status:201});}
