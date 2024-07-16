"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"
import { notFound } from "next/navigation"
import { SignIn } from "@clerk/nextjs"
import { Tags } from "lucide-react"

export const GetSelectedTopics = async () => {
    const UserId = await getCurrentUserId()
    if(!UserId) {
        return {Tags:[], error: "No user found"}
    }

    try {
        const tags = await prisma.topics.findFirst({
            where:{
                userId:UserId
            },
            select:{
                selectedTopics:true
            }
        })
        
        const formattedData = tags?.selectedTopics.map(topic => ({
            value:topic,
            label:topic
        }))
        return {Tags: formattedData || []}
    } catch (error) {
        return {Tags: []}
    }
}