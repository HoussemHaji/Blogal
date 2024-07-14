"use server"

import { stat } from "fs";
import { getCurrentUserId} from "./User";
import prisma from "@/app/prismadb";

export const checkSave=async(storyId:string)=>{
    const userId = getCurrentUserId()
    if(!userId){
        throw new Error("No user found")
    }

    try {
        const saved = await prisma.save.findFirst({
        where:{
            storyId,
            userId
        }
    })
    return {status:!!saved}
    } catch (error) {
        console.log("Error in checking save", error)
        return {status:false}
    }

   
}

