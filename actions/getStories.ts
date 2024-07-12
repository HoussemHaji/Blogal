"use server"
import prisma from "@/app/prismadb";

export const getStoryById = async (storyId: string) => {
    if(!storyId){
        throw new Error("Story ID is required")
    }

    try {
        const Story = await prisma.story.findUnique({
            where: {
                id: storyId
            }  
        })

        return {response : Story}
        
    } catch (error) {
        return {error: "Error fetching story"}
        
    }

}

export const getPublishedStoryById = async (storyId: string) => {
    if(!storyId){
        throw new Error("Story ID is required")
    }

    try {
        const Story = await prisma.story.findUnique({
            where: {
                id: storyId
            }  
        })

        return {response : Story}
        
    } catch (error) {
        return {error: "Error fetching story"}
        
    }

}