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

export async function PATCH(req: NextRequest){
    const {userId} : {userId: string | null} = auth()
    if(!userId){
        throw new Error("Unauthorized")
    }
    const body = await req.json()
    const {storyId, content} = body

    if(!storyId || !content){
        throw new Error("Story ID and content are required")
    }

    const Story = await prisma.story.findUnique({
        where: {
            id: storyId
        }
    })

    if (!Story) {
        throw new Error("Story not found")
    }

    try {
        await prisma.story.update({
            where: {
                id: storyId
            },
            data: {
                content
            }})
            return NextResponse.json({message: "Story updated successfully"})
    } catch (error) {
        return NextResponse.error()
    }
}