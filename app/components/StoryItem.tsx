/* eslint-disable @next/next/no-img-element */
import { Story } from '@prisma/client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthorDetail } from '@/app/me/StoryPage'
import ClapComponent from '@/app/published/ClapComponent'
import SaveComponent from '@/app/published/SaveComponent'
import { checkSave } from '@/actions/Save'
import { clapCount, clapCountByUser } from '@/actions/Clap'
import { useEffect } from 'react'
import { useState } from 'react'

type Props = {
    key: string,
    story: Story
}

const StoryItem = ({ key, story }: Props) => {
    const [userClaps, setUserclaps] = useState<number>(0)
    const [totalClaps, setTotalClaps] = useState<number>(0)
    const [SavedStatus, setSavedStatus] = useState<boolean>(false)


    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await clapCountByUser(story.id)
                setUserclaps(claps)
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }

        const fetchTotalClaps = async () => {
            try {
                const claps = await clapCount(story.id)
                setTotalClaps(claps)
            } catch (error) {
                console.log("Error fetching the  claps")
            }
        }

        const fetchSavedStatus = async () => {
            try {
                const Savedstatus = await checkSave(story.id)
                if (Savedstatus.status)
                    setSavedStatus(Savedstatus.status)
            } catch (error) {
                console.log("Error fetching the saved status")
            }
        }

        fetchSavedStatus()
        fetchTotalClaps()
        fetchClapCountByUser()
    }, [story.id])

    const stripHtmlTags = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };
    const match = story.content?.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
    const imgSrc = match ? match[1] : '';
    const h1match = story.content?.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';
    const H1Element = stripHtmlTags(h1Element)
    // Remove <h1> tags from the content
    const contentWithoutH1 = story.content!.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '');

    // Use stripHtmlTags to remove HTML tags from the entire content
    const textWithoutHtml = stripHtmlTags(contentWithoutH1);

    // Split the text into words and select the first 10
    const first30Words = textWithoutHtml.split(/\s+/).slice(0, 30).join(' ');
    return (
        <div className='mt-5 border-b-2 pb-5 w-full  '>

            <Link key={story.id} href={`/published/${story.id}`} className='w-full h-[500px] pb-10 border-neutral-100'>
                <div className='flex w-full items-center '>
                    <img src={imgSrc ? imgSrc : "/no-image.jpg"} alt='Story Image' className='w-7/12 rounded-xl ' />

                    <div className=' bg-white rounded-3xl shadow-md w-[400px] flex flex-col justify-center p-5 h-64 -ml-20 mt-15'>
                        <AuthorDetail story={story} />

                        <h1 className='text-lg font-bold py-3'>{H1Element}</h1>
                        <p className='max-md:hidden text-sm text-neutral-600 font-serif'>{first30Words} ...
                        </p>
                        <div className='flex items-center space-x-5 mt-6'>
                            {story.topics && (
                                <span className='bg-neutral-50 px-2 py-1 rounded-full text-[13px]'>{story.topics}</span>
                            )}
                            <ClapComponent storyId={story.id} userClaps={userClaps} clapCount={totalClaps} />
                            <SaveComponent storyId={story.id} saveStatus={SavedStatus} />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default StoryItem