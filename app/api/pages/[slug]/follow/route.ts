import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";
export async function POST(_:Request,context:{params:Promise<{slug:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const {slug}=await context.params;const page=await prisma.page.findUnique({where:{slug},select:{id:true,ownerId:true}});if(!page)return NextResponse.json({error:"Page not found."},{status:404});return NextResponse.json({error:"Page following is not available in the current database schema."},{status:501});}
