import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/prismadb";


export async function PATCH(request: NextRequest){
    const {storyId, topics} = await request.json()

    if(!storyId){
        throw new Error("No story ID was found")

    }

    const story = await prisma.story.findUnique({
        where: {
            id: storyId
        }
    })

    if(!story){
        throw new Error("Story not found")
    }

    try {
        const updatedStory = await prisma.story.update({
            where: {
                id: storyId
            },
            data: {
                topics:topics,
                publish: true,
        }})
        return NextResponse.json(updatedStory)
    } catch (error) {
        return NextResponse.error()
    }

}
