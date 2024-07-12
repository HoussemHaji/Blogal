import { Story } from '@prisma/client'
import React from 'react'

type Props = {
    authorFirstName: string | null,
    authorLastName: string | null,
    authorImageUrl: string | null,
    publishedStory: Story
}

function RenderStory({ authorFirstName, authorImageUrl, authorLastName, publishedStory }: Props) {
    const stripHtmlTags = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };
    // H1 tag for heading

    const h1match = publishedStory.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';


    const h1elemntwithouttag = stripHtmlTags(h1Element)

    return (
        <div>

        </div>
    )
}

export default RenderStory