"use client";

import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


type Props = {}

function NavbarStory(props: Props) {
    const router = useRouter()


    const MakeNewStroy = async () => {
        try {
            const response = await axios.post('/api/new-story');
            router.push(`/story/${response.data.id}`)
            console.log(response)


        } catch (error) {
            console.log("Error Creating new Story", error)

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
                    <button className='flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full px-3 py-1 text-[13px] text-white '>Publish</button>
                    <UserButton signInUrl='/' />

                </div>


            </div>
        </div>
    )
}

export default NavbarStory