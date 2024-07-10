import React from 'react'
import NewStory from '../New-story'
import NavbarStory from '../NavbarStory'
import { getStoryById } from '../../../actions/getStories';
import { getCurrentUser, getCurrentUserId } from '@/actions/User';
import { get } from 'https';


const page = async ({ params }: { params: { storyId: string } }) => {
    console.log(params.storyId)
    const Story = await getStoryById(params.storyId)
    const User = await getCurrentUser()
    const UserId = await getCurrentUserId()
    return (
        <div className='max-w-screen-2xl'>
            <NavbarStory storyId={params.storyId} currentUserId={UserId} currentUserFirstname={User.firstName} currentUserLastname={User.lastName} />
            <NewStory storyId={params.storyId} StoryContent={Story.response?.content} />
        </div>
    )
}

export default page