import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest){
    const {userId}= auth()
    if(!userId){
        throw new Error("Unauthorized")
    }
    try {
        return NextResponse.json(userId)
    } catch (error) {
        console.log(error)
    }
}