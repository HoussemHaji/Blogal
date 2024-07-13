import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";

export async function POST(req : NextRequest){
    const {storyId, content}= await req.json()
    const {userId}= auth()
    if(!userId){
        console.log('Unauthorized')
        return NextResponse.error()
    }

    try {

        if(!storyId || !content){
            console.log('StoryId or content is missing')
            return NextResponse.error()  
        }
        const storyExist = await prisma.story.findFirst({
            where: {
                id: storyId
            }
        })

        if(!storyExist){
            console.log('Story not found')
            return NextResponse.error()
        }

        await prisma.comment.create({
            data: {
                content,
                storyId,
                userId
            }
        })

        return NextResponse.json({message: "Commented successfully"})
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }

}