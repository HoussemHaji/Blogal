import React from 'react'
import NewStory from '../New-story'
import NavbarStory from '../NavbarStory'
import { getStoryById } from '../../../actions/getStories';


const page = async ({ params }: { params: { storyId: string } }) => {
    console.log(params.storyId)
    const Story = await getStoryById(params.storyId)
    return (
        <div className='max-w-screen-2xl'>
            <NavbarStory />
            <NewStory storyId={params.storyId} StoryContent={Story.response?.content} />
        </div>
    )
}

export default page