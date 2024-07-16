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

export const AllStoryTopics= async()=>{
    try {
        const allTopics = await prisma.story.findMany(
            {
                select: {
                    topics: true
                }
            }
        )

        const uniqueTopics = Array.from(new Set(allTopics.flatMap((topic)=>topic.topics)))

        const formattedTopics = uniqueTopics.map((topic)=>{
            return {label: topic, value: topic}
        })

        return {response: formattedTopics}
    } catch (error) {
        return {response: []}
        
    }
}

export const getStoryByTag = async(tag:string)=>{
    try {

        if(tag === "All"){
            const AllStories = await prisma.story.findMany({
                where: {
                    publish: true
                }
            })

            return {stories: AllStories}
        }
        const AllStories = await prisma.story.findMany({
            where: {
                topics: {
                    has: tag
                },
                publish: true
            }
        })

        return {stories: AllStories}
    } catch (error) {
        return {stories: []}
    }
}