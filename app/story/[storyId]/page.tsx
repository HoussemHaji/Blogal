import Navbar from '@/app/components/Navbar'
import React from 'react'
import NewStory from '../New-story'


const page = ({ params }: { params: { storyId: string } }) => {
    console.log(params.storyId)
    return (
        <div className='max-w-screen-2xl'>
            <Navbar />
            <NewStory />
        </div>
    )
}

export default page