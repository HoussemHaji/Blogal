"use server"

import { getCurrentUserId} from "./User";
import prisma from "@/app/prismadb";

export const CheckFollowing=async(AuthorId:string)=>{
    const currentUser = getCurrentUserId()
    if(!currentUser){
        return {isFollowing: false}
        
    }
    try {
        const isFollow = await prisma.following.findFirst({
            where:{
                followingId:AuthorId,
                followerId:currentUser
            }
        })

        return {isFollowing: !!isFollow}
    } catch (error) {
        console.log("Error in CheckFollowing",error)
        return {isFollowing: false}

    }
}