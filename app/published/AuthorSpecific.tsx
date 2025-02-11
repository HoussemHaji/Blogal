"use client"

import { CheckFollowing, NumberFollowers } from '@/actions/Following'
import { getStoriesByAuthor } from '@/actions/getStories'
import axios from 'axios'
import { MailPlus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AuthorStories from './AuthorStories'

type Props = {
    PublishedStory: any
    AuthorFirstName: string | null
    AuthorLastName: string | null
    AuthorImage: string
    AuthorEmail: string
}

function AuthorSpecific({ PublishedStory, AuthorFirstName, AuthorImage, AuthorLastName, AuthorEmail }: Props) {
    4

    const [authorStories, setAuthorStories] = React.useState<any[]>([])
    const [currentUserId, setCurrentUserId] = React.useState<string | null>(null)
    const [isfollowed, setisfollowed] = useState<boolean>(false)
    const [NoOfFollowings, setFollowing] = useState<number>()

    useEffect(() => {
        const fetchStories = async () => {
            const stories = await getStoriesByAuthor(PublishedStory.id, PublishedStory.authorId)
            if (stories.response)
                setAuthorStories(stories.response)

        }

        const fetchCurrentUser = async () => {
            const result = await axios.get('/api/currentUser')
            if (result.data) {
                setCurrentUserId(result.data)
            }
        }

        const fetchFollowingStatus = async () => {
            try {
                const response = await CheckFollowing(PublishedStory.authorId)
                if (response?.isFollowing)
                    setisfollowed(response?.isFollowing)
            } catch (error) {
                console.log("Error while fetching the following status", error)
            }
        }

        const fetchFollowing = async () => {
            try {
                const NoOfFollowing = await NumberFollowers(PublishedStory.authorId)
                setFollowing(NoOfFollowing.followers)
            } catch (error) {
                console.log("Error getting no of follwere")
            }
        }

        fetchStories()
        fetchCurrentUser()
        fetchFollowingStatus()
        fetchFollowing()

    }, [PublishedStory])

    const FollowAuthor = async () => {
        setisfollowed(!isfollowed)
        try {
            await axios.post('/api/following', {
                AuthorId: PublishedStory.authorId
            })
            console.log('Success folloing')
        } catch (error) {
            console.log("Error in foloowing the author")
            setisfollowed(!isfollowed)
        }
    }

    return (
        <div className='bg-gray-50 py-10'>
            <div className='max-w-[700px] mx-auto'>
                <Image src={AuthorImage} width={72} height={72} className='rounded-full' alt='Author' />
                <div className='flex items-center justify-between border-b-[1px] pb-4'>
                    <div>
                        <p className='text-xl font-medium mt-5'>Written By {AuthorFirstName} {AuthorLastName}</p>
                        <p className='text-sm opacity-60 mt-1 '>{NoOfFollowings} followers</p>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <button onClick={FollowAuthor} className={`py-2 px-4 p-2 rounded-full text-sm text-white ${currentUserId === PublishedStory.authorId ? "hidden" : ""} ${isfollowed ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}>
                            {`${isfollowed ? "Followed" : "Follow"}`}
                        </button>
                        <a href={`mailto:${AuthorEmail}`} className='py-2 px-4 bg-orange-600 hover:bg-orange-700 p-2 rounded-full text-sm'>
                            <MailPlus size={18} className='text-white font-thin p-[1px]' />
                        </a>
                    </div>
                </div>
                <p className='text-sm py-5 font-medium'>More from {AuthorFirstName} {AuthorLastName}</p>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>
                    {authorStories.map((story, index) => (
                        <AuthorStories key={story.id} AuthorFirstName={AuthorFirstName} AuthorImage={AuthorImage} AuthorLastName={AuthorLastName} story={story} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AuthorSpecific