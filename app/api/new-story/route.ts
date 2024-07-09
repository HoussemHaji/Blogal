import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";

export async function POST(req : NextRequest){
    const {userId} : {userId: string | null} = auth()
    if(!userId){
        throw new Error("Unauthorized")
    }

    try {
        const NewStory = await prisma.story.create({
            data: {
                authorId: userId
                
            }})
            return NextResponse.json(NewStory, {status: 201})

    } catch (error) {
        return NextResponse.error()
        
        
    }
}