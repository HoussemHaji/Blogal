"use server"

import { getCurrentUserId} from "./User";
import prisma from "@/app/prismadb";

export const getComments = async(storyId:string, parentCommentId?:string)=>{
    try {

        if(!storyId){
            throw new Error("StoryId is required")
        }
        if(parentCommentId){
            const comments = await prisma.comment.findMany({
                where:{
                    storyId,
                    parentCommentId
                },
                include:{
                    Clap:true,
                    replies:true
                }
            })
            return {response:comments}
        
        }

        
        const comments = await prisma.comment.findMany({
            where:{
                storyId
            },
            include:{
                Clap:true,
                replies:true

            }
        })
        return {response:comments}

    } catch (error) {
        console.log(error)
        return {error}
        
    }
}
