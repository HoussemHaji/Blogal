import { getStoriesByAuthor } from '@/actions/getStories'
import React, { useEffect } from 'react'

type Props = {
    PublishedStory: any
    AuthorFirstName: string | null
    AuthorLastName: string | null
    AuthorImage: string | null
}

function AuthorSpecific({ PublishedStory, AuthorFirstName, AuthorImage, AuthorLastName }: Props) {
    4

    const [AuthorStories, setAuthorStories] = React.useState<any[]>([])

    useEffect(() => {
        const fetchStories = async () => {
            const stories = await getStoriesByAuthor(PublishedStory.id, PublishedStory.authorId)
            if (stories.response)
                setAuthorStories(stories.response)

        }
    }, [PublishedStory])

    return (
        <div>AuthorSpecific</div>
    )
}

export default AuthorSpecific