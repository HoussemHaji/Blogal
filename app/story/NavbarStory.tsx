"use client";

import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


type Props = {
    storyId: string
    currentUserId: string | null
    currentUserFirstname: string | null
    currentUserLastname: string | null

}

function NavbarStory({ storyId, currentUserId, currentUserFirstname, currentUserLastname }: Props) {
    const router = useRouter()

    const [showPopup, setShowPopup] = React.useState(false)

    const publishStory = async (topics: string[]) => {
        try {
            const response = await axios.patch('/api/publish-new-story', {
                storyId,
                topics
            })
            router.push(`/published/${response.data.id}`)
        } catch (error) {
            console.log(error)
        }

    }




    return (
        <div className='px-8 py-2 border-b-[1px] '>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>

                    <Link href='/'>
                        <Image src='/logo.png' alt='logo' width={100} height={100} className='cursor-pointer' />
                    </Link>

                </div>
                <div className='flex items-center space-x-7'>
                    <button onClick={() => setShowPopup(!showPopup)} className='flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 text-[13px] text-white '>Publish</button>
                    <UserButton signInUrl='/' />

                </div>


            </div>
            {showPopup &&
                <SaveStoryPopup storyId={storyId} publishStory={publishStory} setShowPopup={setShowPopup} currentUserId={currentUserId} currentUserFirstname={currentUserFirstname} currentUserLastname={currentUserLastname} />}
        </div>
    )
}

export default NavbarStory

type SaveStoryPopuptype = {
    storyId: string
    publishStory: (topics: string[]) => void
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
    currentUserId: string | null
    currentUserFirstname: string | null
    currentUserLastname: string | null
}
const SaveStoryPopup = ({ storyId, publishStory, setShowPopup, currentUserFirstname, currentUserId, currentUserLastname }: SaveStoryPopuptype) => {
    return (
        <div></div>
    )
}