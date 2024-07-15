import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";

export async function POST(req:NextRequest){
    const {userId}= auth()
    if(!userId){
        throw new Error("Unauthorized")
    }
    //Check if already following
    const {AuthorId} = await req.json()
    if(AuthorId === userId){
        return NextResponse.error()
    }
    const isFollow = await prisma.following.findFirst({
        where:{
            followerId: userId,
            followingId: AuthorId
        }
    })
    if(isFollow){
        await prisma.following.delete({
            where:{
                id: isFollow.id
            }
        })
        return NextResponse.json({message: "Unfollowed successfully"})
    }
    await prisma.following.create({
        data:{
            followerId: userId,
            followingId: AuthorId
        }
    })
    return NextResponse.json({message: "Followed successfully"})
    
}