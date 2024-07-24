"use client";

import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { ScrollText, Search } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

type Props = {}

function Navbar(props: Props) {

    const [searchInput, setSearchInput] = React.useState('')
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

    const search = (e: any) => {
        if (e.key === 'Enter') {
            router.push(`/search?for=${searchInput}`)
        }
    }

    return (
        <div className='px-8 py-2 border-b-[1px] '>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>

                    <Link href='/'>
                        <Image src='/logo.png' alt='logo' width={100} height={100} className='cursor-pointer' />
                    </Link>
                    <div className='flex items-center bg-gray-50 rounded-full px-1 '>
                        <Search size={20} className="opacity-50" onClick={() => { router.push(`/search?${searchInput}`) }} />
                        <input onChange={(e) => { setSearchInput(e.target.value) }} onKeyDown={(e) => { search(e) }} type="text" placeholder='Search...' className='focus:outline-none px-1 py-2 placeholder:text-sm text-sm bg-gray-50 rounded-full' />
                    </div>
                </div>
                <div className='flex items-center space-x-7'>
                    <span onClick={MakeNewStroy} className='flex items-center space-x-1 opacity-70 hover:opacity-100 duration-100 ease-in cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 opacity-70 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        <p className='text-sm font-light'>Write</p>


                    </span>
                    <Link href='/me/drafts' className='opacity-60 flex items-center space-x-1 text-sm font-light'><ScrollText size={20} opacity={20} /> Me</Link>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton signInUrl='/' />

                    </SignedIn>

                </div>


            </div>
        </div>
    )
}

export default Navbar