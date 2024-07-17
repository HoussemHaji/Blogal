// src/app/api/getUser/[userId]/route.ts
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const userId = params.userId

    if (!userId) {
        return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
    }

    try {
        const user = await clerkClient.users.getUser(userId)
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }
}
