/* eslint-disable @next/next/no-img-element */
'use client'
import { getComments } from '@/actions/comments'
import { getUser } from '@/actions/User'
import { Clap, Comment } from '@prisma/client'
import axios from 'axios'
import { CopyX, MessageCircleMore, Send } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { comment } from 'postcss'
import React, { useEffect, useState } from 'react'
import UserBadge from './AuthorBadge'
import AuthorBadge from './AuthorBadge'
import { clapCount, clapCountByUser } from '@/actions/Clap'
import ClapComponent from './ClapComponent'

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
    const [comments, setComments] = React.useState<Comments[]>([])

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const result = await getComments(storyId)
                if (result && result.response) {
                    setComments(result.response)
                } else {
                    console.log('no response')
                }
            } catch (error) {
                console.log("Error fetching comments")
            }
        }
        fetchComment()
    }, [])

    return (
        <div >
            <button onClick={() => setShowSideComp(!showSideComp)} className='flex items-center opacity-60'>
                <MessageCircleMore color="#000000" strokeWidth={0.75} width={20} />
                <p className='text-sm'> {comments.length} </p>
            </button>
            <div className={`h-screen fixed top-0 right-0 w-[400px] shadow-xl bg-white z-20 duration-200 ease-linear transform overflow-y-scroll ${showSideComp ? "translate-x-0" : "translate-x-[450px]"}`}>
                <div className='px-6 pt-6 flex items-center justify-between'>
                    <p className='font-medium'>Responses ({comments.length})</p>
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
                    <RenderComments storyId={storyId} />
                </div>
            </div>
        </div>
    )
}

export default CommentComponent

interface Comments extends Comment {
    replies: Comment[]
    Clap: Clap[]
}

const RenderComments = ({ storyId, parentCommentId }: { storyId: string, parentCommentId?: string }) => {
    const [comments, setComments] = React.useState<Comments[]>([])

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const result = await getComments(storyId, parentCommentId)
                if (result && result.response) {
                    setComments(result.response)
                } else {
                    console.log('no response')
                }
            } catch (error) {
                console.log("Error fetching comments")
            }
        }
        fetchComment()
    }, [])






    return (
        <div className='py-10 border-t-[1px]'>
            {comments.map((comment, index) => {
                const clapCounts = comment.Clap.map((clap) => clap.clapCount)
                const totalClaps = clapCounts.reduce((acc, curr) => acc + curr, 0)


                return (
                    <div key={index} className='m-4 mt-5 py-4 border-b-[1px] rounded-3xl px-7 border-neutral-100'>
                        <AuthorBadge UserId={comment.userId} createdAt={comment.createdAt} />
                        <UserEngagement storyId={storyId} comment={comment} totalClaps={totalClaps} />

                    </div>
                )
            })}
        </div>
    )

}

const UserEngagement = ({ storyId, comment, totalClaps }: { storyId: string, comment: Comments, totalClaps: number }) => {

    const [showCommentArea, setShowCommentArea] = React.useState(false)
    const [showReplyComments, setShowReplyComments] = React.useState(false)
    const [userClaps, setUserClaps] = React.useState<number>()

    useEffect(() => {
        const fetchUserClaps = async () => {
            try {
                const claps = await clapCountByUser(storyId, comment.id)
                setUserClaps(claps)
            } catch (error) {
                console.log('error fetching claps')
            }
        }
        fetchUserClaps()
    }, [storyId])

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <ClapComponent storyId={storyId} clapCount={totalClaps} commentId={comment.id} userClaps={userClaps || 0} />
                    {comment.replies.length > 0 && (
                        <button onClick={() => setShowReplyComments(!showReplyComments)} className='flex items-center space-x-2 text-sm opacity-80'>
                            <svg width="24" height="24" viewBox="0 0 24 24" className="ku"><path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                            </svg>
                            {comment.replies.length} Replies
                        </button>
                    )}
                    <div>
                        <button onClick={() => setShowCommentArea(!showCommentArea)} className='text-sm opacity-80'>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
            {showReplyComments && (
                <ReplyComments storyId={comment.storyId} parentCommentId={comment.id} />
            )}
            {showCommentArea && (
                <div className='border-l-[3px] ml-5'>
                    <CommentArea setShowCommentArea={setShowCommentArea} commentId={comment.id} />
                </div>
            )}
        </div>
    )

}


const ReplyComments = ({ storyId, parentCommentId }: {
    storyId: string, parentCommentId: string
}) => {
    const [userClaps, setUserclaps] = useState<number>()
    const [totalClaps, setTotalClaps] = useState<number>()

    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await clapCountByUser(storyId, parentCommentId)
                setUserclaps(claps)
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }

        const fetchTotalClaps = async () => {
            try {
                const claps = await clapCount(storyId, parentCommentId)
                setTotalClaps(claps)
            } catch (error) {
                console.log("Error fetching the  claps")
            }
        }

        fetchTotalClaps()
        fetchClapCountByUser()
    }, [storyId])

    return (
        <div>
            <RenderComments storyId={storyId} parentCommentId={parentCommentId} />
        </div>
    )
}


