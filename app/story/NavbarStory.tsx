"use client";

import Link from 'next/link'
import React, { useEffect } from 'react'
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getStoryById } from '@/actions/getStories';
import { Story } from '@prisma/client';
import Select from 'react-select';


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
    const [story, setStory] = React.useState<Story>()
    const [selectedtopics, setSelectedTopics] = React.useState<string[]>([])
    useEffect(() => {
        const getStory = async () => {
            try {
                const result = await getStoryById(storyId)
                if (result.response) {
                    setStory(result.response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getStory()
    }, [])

    const topics = [
        {
            value: "Artificial Intelligence",
            label: "Artificial Intelligence"
        },
        {
            value: "Python",
            label: "Python"
        },
        {
            value: "Programming",
            label: "Programming"
        },
        {
            value: "Algorithms",
            label: "Algorithms"
        },
        {
            value: "Software Engineering",
            label: "Software Engineering"
        },
        {
            value: "Web Development",
            label: "Web Development"
        },

    ]
    if (!story) return null

    // first 10 words for description

    const stripHtmlTags = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };

    const contentWithoutH1 = story.content!.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '');

    const textWithoutHtml = stripHtmlTags(contentWithoutH1);

    const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(' ');

    // H1 tag for heading

    const h1match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';


    const h1elemntwithouttag = stripHtmlTags(h1Element)

    const ImageMatch = story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);

    const imgSrc = ImageMatch ? ImageMatch[1] : ''



    return (
        <div className='fixed flex flex-col justify-center items-center bg-gray-50 md:w-3/5 w-4/5 mx-auto z-20 px-10 rounded-xl border-blue-300 my-10  border-[3px] overflow-auto top-0 left-0 right-0 bottom-0'>
            <span onClick={(e) => { e.preventDefault(); setShowPopup(false) }} className='absolute top-4 right-6 text-3xl cursor-pointer h-0 '>
                &times;
            </span>
            <div className='max-w-[900px] mx-auto grid md:grid-cols-2 grid-cols-1 gap-10' >
                <div className='max-md:hidden '>
                    <p className='font-semibold text-lg py-3'>Story Preview</p>
                    <div className='w-full'>
                        {imgSrc && <Image src={imgSrc} alt='story image' width={250} height={250} className='  object-cover rounded-xl ' />}
                    </div>
                    <h1 className='border-b-[1px] text-[18px] font-semibold py-2 '>
                        {h1elemntwithouttag}
                    </h1>
                    <p className='border-b-[1px] text-sm text-neutral-500 pt-3 py-2'>{first10Words}</p>
                    <p className='font-medium text-sm pt-2'>Note: <span className='font-normal text-neutral-500'>Changes here will affect how your story appears in public places like Medium’s homepage and in subscribers’ inboxes — not the contents of the story itself.</span></p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='py-2 text-base'>Publishing to: <span >
                        {currentUserFirstname} {currentUserLastname}
                    </span>
                    </p>
                    <p className='text-sm pb-3 pt-1'>
                        Add or Change topics (up to 5) so reader know what your story is about
                    </p>
                    <Select
                        placeholder='Select Topics'
                        isMulti
                        onChange={(selectedValues: any) => {
                            const values = selectedValues as { value: string, label: string }[]
                            const stringValues = values.map(value => value.value)
                            setSelectedTopics(stringValues)
                        }}

                        isOptionDisabled={() =>
                            selectedtopics?.length >= 5
                        }

                        name="topics"
                        options={topics}
                        className='basic-multi-select'
                        classNamePrefix="Add a topic..."
                    />

                    <button onClick={() => {
                        publishStory(selectedtopics)

                    }} className='rounded-full w-1/3 bg-blue-400 text-sm font-semibold py-1 px-3 text-white'>Publish</button>


                </div>
            </div>
        </div>
    )
}