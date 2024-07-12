
import { auth, clerkClient } from "@clerk/nextjs/server"

export const getCurrentUserId=()=>{
    const {userId} = auth()
    return userId
}

export const getCurrentUser = async() =>{
    const userId = getCurrentUserId()
    if(!userId){
        throw new Error("No user found")
    }
    const user = await clerkClient.users.getUser(userId)
    return user
}

export const getUser = async(userId: string) =>{
    if(!userId){
        throw new Error("No user found")
    }
    const user = await clerkClient.users.getUser(userId)
    return user
}

