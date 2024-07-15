"use server"
import prisma from "@/app/prismadb";
import { response } from "express";

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

export const getStoriesByAuthor = async(storyId:string, AuthorId:string)=>{
    try {
        const AuthorStories = await prisma.story.findMany({
            where: {
                authorId: AuthorId,
                NOT:{
                    id: storyId
                },
                publish:true    
            }
            
        })

        return {response: AuthorStories}
    } catch (error) {
        return {error: "Error fetching stories"}
    }
}