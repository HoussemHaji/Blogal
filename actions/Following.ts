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

export const NumberFollowers=async(AuthorId:string)=>{
    if(!AuthorId){
        return {followers:0}
    }

    try {
        const followers = await prisma.following.count({
            where:{
                followingId:AuthorId
            }
        })

        return {followers}
    } catch (error) {
        console.log("Error in NumberFollowers",error)
        return {followers:0}
    }
}