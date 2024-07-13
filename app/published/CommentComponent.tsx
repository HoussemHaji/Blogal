'use client'
import axios from 'axios'
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
        <div>CommentComponent</div>
    )
}

export default CommentComponent