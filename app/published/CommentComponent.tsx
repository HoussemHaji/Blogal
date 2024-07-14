'use client'
import axios from 'axios'
import { CopyX, MessageCircleMore, Send } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    AuthorImage: string,
    AuthorFirstName: string | null,
    AuthorLastName: string | null,
}

const CommentComponent = ({ AuthorImage, AuthorFirstName, AuthorLastName }: Props) => {
    const [showSideComp, setShowSideComp] = React.useState(false)
    const [content, setContent] = React.useState('')
    const pathname = usePathname()
    const storyId = pathname.split('/')?.[2] as string

    const commentStory = async () => {
        try {
            await axios.post('/api/commentStory', {
                storyId,
                content
            })
            setContent('')
            console.log('success')
        } catch (error) {
            console.log('error posting comment')
        }
    }

    return (
        <div >
            <button onClick={() => setShowSideComp(!showSideComp)} className='flex items-center opacity-60'>
                <MessageCircleMore color="#000000" strokeWidth={0.75} width={20} />
                <p className='text-sm'>3</p>
            </button>
            <div className={`h-screen fixed top-0 right-0 w-[400px] shadow-xl bg-white z-20 duration-200 ease-linear transform overflow-y-scroll ${showSideComp ? "translate-x-0" : "translate-x-[450px]"}`}>
                <div className='px-6 pt-6 flex items-center justify-between'>
                    <p className='font-medium'>Responses (83)</p>
                    <span onClick={() => setShowSideComp(false)} className='cursor-pointer opacity-60 scale-150'>
                        &times;
                    </span>
                </div>
                <div className='m-4 shadow-md  rounded-xl'>
                    <div className='flex items-center space-x-3 p-3 '>
                        <img className="w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 " src={AuthorImage} alt="Bordered avatar" />
                        <p > {AuthorFirstName} {AuthorLastName} <span className='font-medium cursor-pointer text-blue-600'></span> </p>
                    </div>

                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className='w-full p-3 text-sm focus:outline-none overflow-hidden h-20 placeholder:text-sm prose' placeholder='Add a comment'></textarea>
                    <div className='flex flex-row-reverse p-3'>
                        <div className='flax items-center space-x-4'>
                            <button className='text-sm' onClick={() => setContent('')} >
                                <CopyX color="black" width={20} className='opacity-60 hover:stroke-red-500 transform duration-150' />
                            </button>
                            <button className='text-sm' onClick={commentStory} >
                                <Send color="black" width={20} className='opacity-60 hover:stroke-blue-500 transform duration-150' />
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentComponent