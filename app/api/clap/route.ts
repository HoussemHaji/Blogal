import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";
import { Story } from '@prisma/client';

export async function POST(req: NextRequest) {
    const {userId}= auth()
    if(!userId){
        throw new Error("Unauthorized")
    }

    try {
        const {storyId} = await req.json()
        const storyExist = await prisma.story.findUnique({
            where: {
                id: storyId
            }
        })
        if(!storyExist){
            throw new Error("Story not found")
        }

        const clapped = await prisma.clap.findFirst({
            where: {
                storyId,
                userId
            }
        })

        if(clapped && clapped.clapCount >= 50){
            await prisma.clap.update({
                where: {
                    id: clapped.id
                },
                data: {
                    clapCount: clapped.clapCount + 1
                }
            })
            return NextResponse.json({message: "Clapped updated successfully"})
        }else{
            await prisma.clap.create({
                data: {
                    userId,
                    storyId,
                    clapCount: 1
                }
            })
            return NextResponse.json({message: "Clapped successfully"})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }
}