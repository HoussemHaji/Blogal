"use client"
import { CheckFollowing } from '@/actions/Following'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type Props = {
    AuthorId: string
}

function FollowComponent({ AuthorId }: Props) {

    const [isFollowed, setIsFollowed] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)



    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const res = await CheckFollowing(AuthorId)
                setIsFollowed(res.isFollowing)
            } catch (error) {
                console.log("Error in FollowComponent", error)
            }
        }

        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("/api/currentUser")
                setCurrentUserId(response.data)
            } catch (error) {
                console.log("Error fetching current user", error)
            }
        }

        fetchFollowing()
        fetchCurrentUser()
    }, [AuthorId])

    const FollowAuthor = async () => {
        setIsFollowed(!isFollowed)
        try {
            await axios.post("/api/follow", { AuthorId })
            console.log("Success Following")
        } catch (error) {
            console.log("Error Following", error)
            setIsFollowed(!isFollowed)
        }
    }

    return (
        <span onClick={() => FollowAuthor()} className={`font-medium  cursor-pointer ${isFollowed ? "text-blue-500" : "text-red-400"} ${currentUserId === AuthorId ? "hidden" : ""}`}>. {`${isFollowed ? "unfollow" : "follow"}`}</span>
    )
}

export default FollowComponent