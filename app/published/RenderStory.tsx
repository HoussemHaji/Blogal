/* eslint-disable @next/next/no-img-element */
import { Story } from '@prisma/client'
import { MoreHorizontal, Save } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import "highlight.js/styles/github.css"
import ClapComponent from './ClapComponent'
import CommentComponent from './CommentComponent'
import SaveComponent from './SaveComponent'
import ShareComponent from './ShareComponent'
import { clapCount, clapCountByUser } from '@/actions/Clap'
import { getCurrentUser } from '@/actions/User'
import { checkSave } from '@/actions/Save'
import FollowComponent from './FollowComponent'

type Props = {
    AuthorFirstName: string | null
    AuthorLastName: string | null
    AuthorImage: string
    PublishedStory: Story
}

const RenderStory = async ({ AuthorFirstName, AuthorImage, AuthorLastName, PublishedStory }: Props) => {

    const stripHtmlTags = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };

    const h1match = PublishedStory.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';

    const h1elemntwithouttag = stripHtmlTags(h1Element)



    const content = PublishedStory.content!;

    const firstH1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/);

    const sanitizedContent = firstH1Match
        ? content.replace(firstH1Match[0], '')
        : content;

    const finalSanitizedContent = sanitizedContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>|<select[^>]*>[\s\S]*?<\/select>|<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '');

    const clapCounts = await clapCount(PublishedStory.id)

    const clapCountsByUser = await clapCountByUser(PublishedStory.id)

    const currentUser = await getCurrentUser()

    const savedStatus = await checkSave(PublishedStory.id)

    return (
        <div className='flex items-center justify-center mt-6 max-w-[800px] mx-auto lg:px-0 px-10'>
            <div>
                <div className='flex items-center space-x-5'>

                    <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 " src={AuthorImage} alt="Bordered avatar" />

                    <div className='text-sm'>
                        <p > {AuthorFirstName} {AuthorLastName} <FollowComponent AuthorId={PublishedStory.authorId} /> </p>
                        <p className='opacity-60'>Published on {new Date(PublishedStory.updatedAt).toDateString().split(' ').slice(1, 4).join(' ')}</p>
                    </div>
                </div>
                <h1 className='text-4xl font-bold my-8'>{h1elemntwithouttag}</h1>

                <div className='border-y-[1px] border-neutral-200 py-3 mt-6 flex items-center justify-between px-3'>
                    <div className='flex items-center space-x-4'>
                        <ClapComponent storyId={PublishedStory.id} clapCount={clapCounts} userClaps={clapCountsByUser} />
                        <CommentComponent AuthorFirstName={currentUser.firstName} AuthorLastName={currentUser.lastName} AuthorImage={currentUser.imageUrl} />
                    </div>
                    <div className='flex items-center space-x-4'>
                        <SaveComponent storyId={PublishedStory.id} saveStatus={savedStatus.status} />
                        <ShareComponent />

                        <button>
                            <MoreHorizontal size={24} className='opacity-80 text-blue-600' />
                        </button>
                    </div>
                </div>
                <div className='prose my-5 font-mono' dangerouslySetInnerHTML={{ __html: finalSanitizedContent }}></div>
            </div>
        </div >
    )
}

export default RenderStory