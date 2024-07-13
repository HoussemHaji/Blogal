"use server"

import { getCurrentUserId} from "./User";
import prisma from "@/app/prismadb";



export const clapCount =  async(storyId:string, commentId?:string)=>{
    try {
        if(!commentId){
            const Clap  = await prisma.clap.aggregate({
                where: {
                    storyId: storyId,
                    commentId:null
                },
                _sum: {
                    clapCount: true
                }
            })

            return Clap._sum?.clapCount || 0
        }
        const Clap  = await prisma.clap.aggregate({
                where: {
                    storyId: storyId,
                    commentId:commentId
                },
                _sum: {
                    clapCount: true
                }
            })

            return Clap._sum?.clapCount || 0
    } catch (error) {
        return 0
        
    }
}

export const clapCountByUser = async(storyId:string, commentId?:string)=>{

    const userId = getCurrentUserId()
    if(!userId){
        throw new Error("Not logged in")
    }

    try {
        if(!commentId){
            const Clap  = await prisma.clap.aggregate({
                where: {
                    storyId: storyId,
                    userId,
                    commentId:null
                },
                _sum: {
                    clapCount: true
                }
            })

            return Clap._sum?.clapCount || 0
        }
        const Clap  = await prisma.clap.aggregate({
                where: {
                    storyId: storyId,
                    userId,
                    commentId:commentId
                },
                _sum: {
                    clapCount: true
                }
            })

            return Clap._sum?.clapCount || 0
    } catch (error) {
        return 0
        
    }
}